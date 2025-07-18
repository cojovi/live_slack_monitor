import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the frontend (both ports)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));

app.use(express.json());

// Proxy endpoint for Slack presence
app.get('/api/slack/presence', async (req, res) => {
  try {
    const { userId } = req.query;
    const botToken = process.env.VITE_SLACK_BOT_TOKEN;
    
    if (!botToken || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, {
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Slack presence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New endpoint for user profile information (includes custom status)
app.get('/api/slack/user-profile', async (req, res) => {
  try {
    const { userId } = req.query;
    const botToken = process.env.VITE_SLACK_BOT_TOKEN;
    
    if (!botToken || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Slack user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Combined endpoint that fetches both presence and profile
app.get('/api/slack/user-status', async (req, res) => {
  try {
    const { userId } = req.query;
    const botToken = process.env.VITE_SLACK_BOT_TOKEN;
    
    if (!botToken || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Fetch both presence and profile information
    const [presenceResponse, profileResponse] = await Promise.all([
      fetch(`https://slack.com/api/users.getPresence?user=${userId}`, {
        headers: {
          'Authorization': `Bearer ${botToken}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(`https://slack.com/api/users.info?user=${userId}`, {
        headers: {
          'Authorization': `Bearer ${botToken}`,
          'Content-Type': 'application/json'
        }
      })
    ]);

    const presenceData = await presenceResponse.json();
    const profileData = await profileResponse.json();

    // Combine the data
    const combinedData = {
      ok: presenceData.ok && profileData.ok,
      presence: presenceData.presence,
      status_text: profileData.ok ? profileData.user.profile.status_text : null,
      status_emoji: profileData.ok ? profileData.user.profile.status_emoji : null,
      real_name: profileData.ok ? profileData.user.real_name : null,
      display_name: profileData.ok ? profileData.user.profile.display_name : null,
      avatar: profileData.ok ? profileData.user.profile.image_192 : null
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 