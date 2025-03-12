# Pedal Dashboard

A modern cycling management dashboard built with Next.js, React, and Tailwind CSS.

## Features

- Modern UI with responsive design
- Strava OAuth authentication
- Dashboard with cycling statistics
- Messages system
- Trending places for cyclists
- Settings management

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide React](https://lucide.dev/) - Icon library
- [React Query](https://tanstack.com/query/latest) - Data fetching library
- [Strava API](https://developers.strava.com/) - Cycling data API

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm or bun
- Strava API credentials (see below)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/pedal-dashboard.git
cd pedal-dashboard
```

2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. Set up Strava API credentials

   - Go to [Strava API Settings](https://www.strava.com/settings/api)
   - Create a new application
   - Set the "Authorization Callback Domain" to `localhost` for development
   - Note your Client ID and Client Secret

4. Create a `.env.local` file in the root directory and add your Strava credentials

```
# Strava OAuth Configuration
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id
```

5. Verify your environment variables

```bash
npm run check-env
# or
yarn check-env
# or
pnpm check-env
# or
bun check-env
```

This will check if all required environment variables are set correctly.

6. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Troubleshooting

If you encounter issues with Strava authentication:

1. Make sure your environment variables are set correctly by running `npm run check-env`
2. Ensure that both `STRAVA_CLIENT_ID` and `NEXT_PUBLIC_STRAVA_CLIENT_ID` have the same value
3. Verify that your Strava API application has the correct callback URL: `http://localhost:3000/api/auth/strava/callback` (for development)
4. Check the browser console for any errors
5. Use the "Check Configuration" button on the login page to verify your setup

## Project Structure

```
pedal-dashboard/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   └── auth/         # Authentication API routes
│   ├── messages/         # Messages page
│   ├── settings/         # Settings page
│   ├── trend-places/     # Trending places page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components
│   └── ...               # Other components
├── lib/                  # Utility functions and hooks
│   └── auth-context.tsx  # Authentication context
├── scripts/              # Utility scripts
│   └── check-env.js      # Environment variable checker
├── public/               # Static assets
└── ...                   # Config files
```

## Authentication Flow

The application uses Strava OAuth for authentication:

1. User clicks "Login with Strava" button
2. User is redirected to Strava's authorization page
3. After authorizing, Strava redirects back to our callback URL
4. The callback endpoint exchanges the authorization code for access and refresh tokens
5. Tokens are stored in HTTP-only cookies for security
6. User information is stored in a regular cookie for UI display

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For production deployment, make sure to:

1. Update your Strava API application with the production callback URL
2. Set the environment variables in your hosting platform

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
