import { IncomingWebhook } from '@slack/webhook';
import {
  DisbursementRequest,
  SlackNotificationPayload,
  SlackAttachment,
  LOAN_AMOUNT_TIERS,
  SLACK_COLORS,
  formatCurrency,
  formatDate,
  getLoanAmountTier,
} from '@fintech-platform/shared';

interface SlackWebhookConfig {
  small: string;
  medium: string;
  large: string;
}

/**
 * Service for sending Slack notifications about loan disbursement requests
 */
class SlackNotificationService {
  private webhooks: Map<string, IncomingWebhook> = new Map();
  private initialized = false;

  constructor() {
    // Delay initialization to ensure dotenv is loaded
  }

  /**
   * Initialize webhook clients from environment variables
   * This should be called after dotenv config() is called
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    const config: SlackWebhookConfig = {
      small: process.env.SLACK_WEBHOOK_URL_SMALL || '',
      medium: process.env.SLACK_WEBHOOK_URL_MEDIUM || '',
      large: process.env.SLACK_WEBHOOK_URL_LARGE || '',
    };

    // Initialize webhook clients
    Object.entries(config).forEach(([tier, url]) => {
      if (url) {
        this.webhooks.set(tier, new IncomingWebhook(url));
      } else {
        console.warn(`⚠️  No Slack webhook URL configured for ${tier} loans`);
      }
    });

    this.initialized = true;
  }

  /**
   * Validate Slack configuration and return status information
   * Can be used to check if Slack is properly configured
   */
  public validateConfiguration(): { 
    isConfigured: boolean; 
    configuredChannels: string[];
    slackUrls: Record<string, string | undefined>;
  } {
    const slackUrls = {
      small: process.env.SLACK_WEBHOOK_URL_SMALL,
      medium: process.env.SLACK_WEBHOOK_URL_MEDIUM,
      large: process.env.SLACK_WEBHOOK_URL_LARGE,
    };
    
    const configuredChannels = Object.entries(slackUrls)
      .filter(([_, url]) => url)
      .map(([tier]) => tier);
      
    return {
      isConfigured: configuredChannels.length > 0,
      configuredChannels,
      slackUrls
    };
  }

  /**
   * Log Slack configuration status
   */
  public logConfigurationStatus(): void {
    const { isConfigured, configuredChannels } = this.validateConfiguration();
    
    if (isConfigured) {
      console.log(`💬 Slack notifications enabled for: ${configuredChannels.join(', ')}`);
    } else {
      console.log('⚠️  No Slack webhooks configured - notifications disabled');
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * Send notification for a new disbursement request
   */
  async notifyNewRequest(request: DisbursementRequest): Promise<void> {
    this.ensureInitialized();
    try {
      const tier = getLoanAmountTier(request.loanAmount);
      const webhook = this.webhooks.get(tier);

      if (!webhook) {
        console.warn(`No webhook configured for ${tier} tier loans`);
        return;
      }

      const payload = this.createNewRequestPayload(request, tier);
      await webhook.send(payload);

      console.log(`✅ Slack notification sent for ${tier} loan: ${request.id}`);
    } catch (error) {
      console.error('❌ Failed to send Slack notification:', error);
      // Don't throw - notification failure shouldn't break the API
    }
  }

  /**
   * Send notification for a status update
   */
  async notifyStatusUpdate(request: DisbursementRequest): Promise<void> {
    this.ensureInitialized();
    try {
      const tier = getLoanAmountTier(request.loanAmount);
      const webhook = this.webhooks.get(tier);

      if (!webhook) {
        console.warn(`No webhook configured for ${tier} tier loans`);
        return;
      }

      const payload = this.createStatusUpdatePayload(request, tier);
      await webhook.send(payload);

      console.log(`✅ Status update notification sent for: ${request.id}`);
    } catch (error) {
      console.error('❌ Failed to send status update notification:', error);
    }
  }

  /**
   * Send a custom notification
   */
  async sendCustomNotification(
    tier: 'small' | 'medium' | 'large',
    payload: SlackNotificationPayload
  ): Promise<void> {
    this.ensureInitialized();
    try {
      const webhook = this.webhooks.get(tier);

      if (!webhook) {
        console.warn(`No webhook configured for ${tier} tier`);
        return;
      }

      await webhook.send(payload);
      console.log(`✅ Custom notification sent to ${tier} channel`);
    } catch (error) {
      console.error('❌ Failed to send custom notification:', error);
    }
  }

  /**
   * Create payload for new request notification
   */
  private createNewRequestPayload(
    request: DisbursementRequest,
    tier: string
  ): SlackNotificationPayload {
    // Get tier-specific color
    const tierColor = this.getTierColor(tier);
    
    const attachment: SlackAttachment = {
      color: tierColor,
      title: `🔔 New ${tier.charAt(0).toUpperCase() + tier.slice(1)} Loan Request: ${formatCurrency(request.loanAmount)}`,
      fields: [
        {
          title: 'Borrower',
          value: request.borrowerName,
          short: true,
        },
        {
          title: 'Amount',
          value: `*${formatCurrency(request.loanAmount)}*`,
          short: true,
        },
        {
          title: 'Status',
          value: request.status,
          short: true,
        },
        {
          title: 'Submitted',
          value: formatDate(request.submittedAt),
          short: true,
        },
        {
          title: 'Request ID',
          value: request.id,
          short: false,
        },
        {
          title: 'Loan Tier',
          value: `${tier.charAt(0).toUpperCase() + tier.slice(1)} (${this.getTierDescription(tier)})`,
          short: false,
        },
      ],
      footer: 'Fintech Platform',
      ts: Math.floor(Date.now() / 1000).toString(),
    };

    return {
      text: `New ${tier} loan request: *${formatCurrency(request.loanAmount)}* for ${request.borrowerName}`,
      attachments: [attachment],
    };
  }

  /**
   * Create payload for status update notification
   */
  private createStatusUpdatePayload(
    request: DisbursementRequest,
    tier: string
  ): SlackNotificationPayload {
    const statusColor = this.getStatusColor(request.status);
    const statusEmoji = this.getStatusEmoji(request.status);
    // Get tier-specific color for the text
    const tierColor = this.getTierColor(tier);

    const attachment: SlackAttachment = {
      color: statusColor,
      title: `${statusEmoji} ${tier.charAt(0).toUpperCase() + tier.slice(1)} Loan Request (${formatCurrency(request.loanAmount)}) Status Updated`,
      fields: [
        {
          title: 'Borrower',
          value: request.borrowerName,
          short: true,
        },
        {
          title: 'Amount',
          value: `*${formatCurrency(request.loanAmount)}*`,
          short: true,
        },
        {
          title: 'New Status',
          value: `*${request.status}*`,
          short: true,
        },
        {
          title: 'Request ID',
          value: request.id,
          short: false,
        },
      ],
      footer: 'Fintech Platform',
      ts: Math.floor(Date.now() / 1000).toString(),
    };

    return {
      text: `${tier.charAt(0).toUpperCase() + tier.slice(1)} loan request ${request.status.toLowerCase()}: *${formatCurrency(request.loanAmount)}* for ${request.borrowerName}`,
      attachments: [attachment],
    };
  }

  /**
   * Get tier description for display
   */
  private getTierDescription(tier: string): string {
    switch (tier) {
      case 'small':
        return `< ${formatCurrency(LOAN_AMOUNT_TIERS.SMALL)}`;
      case 'large':
        return `≥ ${formatCurrency(LOAN_AMOUNT_TIERS.LARGE)}`;
      case 'medium':
      default:
        return `${formatCurrency(LOAN_AMOUNT_TIERS.SMALL)} - ${formatCurrency(LOAN_AMOUNT_TIERS.LARGE - 1)}`;
    }
  }

  /**
   * Get color for status
   */
  private getStatusColor(status: string): string {
    switch (status) {
      case 'Approved':
        return SLACK_COLORS.APPROVED;
      case 'Rejected':
        return SLACK_COLORS.REJECTED;
      case 'Pending':
        return SLACK_COLORS.PENDING;
      default:
        return SLACK_COLORS.INFO;
    }
  }

  /**
   * Get emoji for status
   */
  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      case 'Pending':
        return '⏳';
      default:
        return 'ℹ️';
    }
  }

  /**
   * Get tier-specific color
   */
  private getTierColor(tier: string): string {
    switch (tier) {
      case 'small':
        return '#36a64f'; // Green
      case 'medium':
        return '#3c66dd'; // Blue
      case 'large':
        return '#9c33e6'; // Purple
      default:
        return SLACK_COLORS.INFO;
    }
  }

  /**
   * Test all webhook connections
   */
  async testConnections(): Promise<void> {
    this.ensureInitialized();
    
    for (const [tier, webhook] of this.webhooks) {
      try {
        const tierColor = this.getTierColor(tier);
        const testPayload: SlackNotificationPayload = {
          text: `🧪 Test notification for ${tier} tier channel`,
          attachments: [
            {
              color: tierColor,
              title: `Connection Test: ${tier.charAt(0).toUpperCase() + tier.slice(1)} Loan Channel`,
              fields: [
                {
                  title: 'Status',
                  value: '✅ Webhook connection is working!',
                  short: false,
                },
                {
                  title: 'Tier Description',
                  value: this.getTierDescription(tier),
                  short: false,
                },
                {
                  title: 'Color Sample',
                  value: `This channel uses ${tierColor} as its primary color.`,
                  short: false,
                },
              ],
              footer: 'Fintech Platform - Test',
              ts: Math.floor(Date.now() / 1000).toString(),
            },
          ],
        };
        
        await webhook.send(testPayload);
        console.log(`✅ ${tier} webhook connection test passed`);
      } catch (error) {
        console.error(`❌ ${tier} webhook connection test failed:`, error);
      }
    }
  }
}

// Export singleton instance
export const slackNotificationService = new SlackNotificationService(); 