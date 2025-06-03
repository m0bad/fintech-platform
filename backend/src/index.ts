import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { SERVER_CONFIG } from '@fintech-platform/shared';
import { disbursementRequestRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler.js';
import { slackNotificationService } from './services/index.js';

config();

slackNotificationService.initialize();

const app = express();
const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [...SERVER_CONFIG.CORS_ORIGINS];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
  app.use(requestLogger);
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/requests', disbursementRequestRoutes);

app.get('/api/slack/status', (req, res) => {
  const status = slackNotificationService.validateConfiguration();
  res.json({
    success: true,
    data: {
      isConfigured: status.isConfigured,
      configuredChannels: status.configuredChannels,
      // Don't expose actual URLs for security reasons
      webhookStatus: {
        small: !!status.slackUrls.small,
        medium: !!status.slackUrls.medium,
        large: !!status.slackUrls.large
      }
    }
  });
});

app.post('/api/test/slack', async (req, res) => {
  try {
    await slackNotificationService.testConnections();
    res.json({
      success: true,
      message: 'Slack notification test completed. Check console for results.',
    });
  } catch (error) {
    console.error('Slack test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Slack test failed',
    });
  }
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log('🚀 Fintech Platform Backend Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/api/requests`);
  
  // Log Slack configuration status
  slackNotificationService.logConfigurationStatus();
  
  console.log('✨ Ready to accept requests!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export { app, server }; 