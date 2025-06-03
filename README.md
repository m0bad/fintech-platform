# Fintech Platform - SME Loan Disbursement Dashboard

A prototype dashboard for SME lenders across Africa to view and approve loan disbursement requests.

## 🏗️ Project Structure

```
fintech-platform/
├── backend/          # Node.js + Express API server
├── frontend/         # Next.js 15.3.3 + shadcn/ui dashboard
├── shared/           # Common TypeScript types and utilities
├── docs/            # Project documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Start both backend and frontend in development mode
npm run dev
```

### Individual Services

```bash
# Backend only (port 3001)
npm run dev:backend

# Frontend only (port 3000)
npm run dev:frontend
```

## 📋 Features

### Part 1: Backend Data Model
- In-memory disbursement request data model
- REST API endpoints for CRUD operations
- Sample data with realistic loan requests

### Part 2: Frontend Dashboard
- Clean table interface for loan requests
- Status filtering (Pending/Approved/Rejected)
- Responsive design with shadcn/ui components
- Real-time data updates

### Part 3: Slack Integration
- Automated notifications for new loan requests
- Smart routing based on loan amount tiers
- Configurable webhook endpoints

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js 15.3.3, React, TypeScript, shadcn/ui, Tailwind CSS
- **Integration**: Slack Webhooks
- **Development**: ESLint, Prettier, Concurrent development servers

## 📚 API Documentation

Coming soon...

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## 🚢 Deployment

Coming soon...

## 📞 Support

For questions about this implementation, please refer to the documentation in the `docs/` directory. 