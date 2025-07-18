# Live Slack Monitor

A real-time Slack presence dashboard built with React, TypeScript, and Vite. Displays user status, custom status messages, and presence information from Slack.

## Features

- Real-time Slack presence monitoring
- Custom status display with emoji support
- Live connection status indicator
- Responsive design with dark theme
- Auto-refresh every 30 seconds

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Slack workspace with API access
- Slack app with required permissions

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live_slack_monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_SLACK_USER_ID=your_slack_user_id
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   ```

4. **Slack App Configuration**
   - Create a Slack app in your workspace
   - Add OAuth scopes: `users:read`, `users.profile:read`
   - Install the app to your workspace
   - Copy the Bot User OAuth Token to your `.env` file

## Running the Application

**You need to run TWO commands in separate terminal windows/tabs:**

### Terminal 1 (Backend Proxy Server)
```bash
npm run server
```
This starts the Express.js proxy server on port 3001 that handles Slack API calls and CORS.

### Terminal 2 (Frontend Development Server)
```bash
npm run dev
```
This starts the Vite development server on port 5173 that serves your React app.

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

## Why Two Commands?

- **Backend**: The proxy server handles Slack API authentication and prevents CORS issues
- **Frontend**: The React app runs separately and makes requests to the backend proxy

## Troubleshooting

### Server Already Running
If you get a port conflict, kill the existing server:
```bash
pkill -f "node server.js" && sleep 2 && npm run server
```

### Connection Issues
- Ensure both servers are running
- Check that your Slack app has the correct permissions
- Verify your `.env` file contains the correct tokens

## Development

The app automatically refreshes every 30 seconds to show the latest Slack status. Custom status emojis are converted from Slack format (`:emoji_name:`) to Unicode emojis.

## Project Structure

```
live_slack_monitor/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── server.js          # Express proxy server
├── .env              # Environment variables
└── package.json      # Dependencies and scripts
```
