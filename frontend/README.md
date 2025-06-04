# Fintech Platform Frontend

A modern Next.js dashboard for managing SME loan disbursement requests across African markets.

## Features

- 🎯 **Real-time Dashboard** - Monitor loan requests with live updates
- 🔍 **Advanced Filtering** - Filter by status, borrower name, and amount range
- ✅ **Approval Workflow** - One-click approve/reject with Slack notifications
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **TypeScript**: Full type safety
- **Icons**: Lucide React
- **State Management**: React hooks with custom data fetching

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on port 3001

### Environment Setup

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Fintech Platform"
NEXT_PUBLIC_APP_DESCRIPTION="SME Loan Disbursement Platform for African Lenders"
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   └── dashboard/        # Dashboard-specific components
├── hooks/                # Custom React hooks
├── services/             # API service layer
└── lib/                  # Utility functions
```

## Key Components

### Dashboard Features

- **DisbursementRequestsTable** - Main data table with actions
- **DisbursementFilters** - Search and filter controls
- **useDisbursementRequests** - Data fetching and state management hook

### API Integration

- Connects to Express backend on port 3001
- RESTful endpoints for CRUD operations
- Real-time status updates
- Error handling and loading states

## Pages

- **Home** (`/`) - Landing page with navigation to dashboard
- **Dashboard** (`/dashboard`) - Main application interface

## API Endpoints Used

- `GET /api/requests` - Fetch disbursement requests with filtering
- `PUT /api/requests/:id` - Update request status
- `GET /health` - Backend health check

## Development Notes

- Uses TypeScript strict mode for type safety
- Implements proper error handling and loading states
- Responsive design with mobile-first approach
- Optimistic updates for better UX
- Debounced search for performance

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `"Fintech Platform"` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | `"SME Loan Disbursement Platform for African Lenders"` |

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Test components with different data states
4. Ensure responsive design principles

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
