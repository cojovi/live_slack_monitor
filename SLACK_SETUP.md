# Slack API Setup Guide

## Current Issue
Your Slack app doesn't have the necessary permissions to read user profile information, including custom status messages.

## Required Permissions
To read custom status messages, your Slack app needs these OAuth scopes:

### Bot Token Scopes (OAuth & Permissions)
- `users:read` - Read user information
- `users:read.email` - Read user email addresses
- `users.profile:read` - Read user profile information (including custom status)

### App-Level Token Scopes (Basic Information)
- `connections:write` - For WebSocket connections (if using real-time updates)

## How to Add Permissions

1. **Go to your Slack App settings**: https://api.slack.com/apps
2. **Select your app**: "presencemirror" or similar
3. **Navigate to "OAuth & Permissions"** in the left sidebar
4. **Scroll to "Bot Token Scopes"**
5. **Add the required scopes**:
   - Click "Add an OAuth Scope"
   - Add `users:read`
   - Add `users.profile:read`
6. **Reinstall the app** to your workspace:
   - Scroll to "OAuth Tokens for Your Workspace"
   - Click "Reinstall to Workspace"
   - Authorize the new permissions

## Testing the Permissions

After adding permissions, test with:

```bash
# Test user profile access
curl -H "Authorization: Bearer YOUR_BOT_TOKEN" \
  "https://slack.com/api/users.info?user=U07H70D4YRW" | jq '.user.profile.status_text'
```

## Current Workaround

Until you add the proper permissions, the app will show:
- **Status**: "running a marathon" 🏃 (manually set)
- **Presence**: "Away" (from real API)
- **Name**: "Cody Viveiros" (from real API)

## Expected Result After Permissions

With proper permissions, the app will automatically show:
- **Status**: Your actual custom status from Slack
- **Emoji**: Your actual status emoji from Slack
- **Real-time updates**: When you change your status in Slack

## Troubleshooting

If permissions are still not working:
1. Make sure you reinstall the app after adding scopes
2. Check that the bot token starts with `xoxb-`
3. Verify the user ID is correct
4. Check the Slack API documentation for any recent changes 