# STARO - Quick Start Guide

## Getting Started

### 1. Access the Application
```
http://localhost:3000
```
You'll be redirected to the login page if not authenticated.

### 2. Create Your Account
- Click "Sign up" button
- Enter your name, email, and password (minimum 8 characters)
- Account is created instantly with Better Auth
- You'll be logged in automatically

### 3. Start Using STARO

## Main Features

### Home Feed (/home)
**Your daily ship tracker and startup updates**
- **STARO Pulse**: Track your shipping streak
  - Click "+ Ship" to log today's work
  - Maintain your streak for longest shipping days
  - See your best streak record
- **Your Story**: Share 24-hour ephemeral updates
- **Create Posts**: Share startup updates, learnings, or wins
  - Click textarea → Type message → Click "Create post"
  - Posts appear immediately in feed
  - Like and comment on posts (coming soon)

### Watch (/watch)
**Discover videos and shorts from the community**
- Videos tab: Full-length content from founders
- Shorts tab: Quick clips and tips
- Click "Upload a video" to share your content
- Features trending videos, pitch reels, founder talks

### Network (/network)
**Find co-founders and build your team**
- See your network stats (connections, following, mentions)
- Browse people to follow
- Request connections with potential co-founders
- Direct messaging (coming soon)
- AI co-founder matching based on skills

### Explore (/explore)
**Discover startups, jobs, and opportunities**

*Startups Tab:*
- Filter by 8 categories: AI, SaaS, Fintech, HealthTech, ClimateTech, Robotics, Web3
- See startup details: name, description, funding stage
- Click to view full startup profile

*Jobs Tab:*
- Browse job listings from startups
- Filter by location and job type
- Apply directly to opportunities
- Create job postings for your startup

### Profile (/profile)
**Your builder profile and personal hub**
- View your stats: posts, followers, following, ships
- Click gear icon to edit profile:
  - Add bio, role, skills, location, website
  - Upload profile picture
  - Save changes
- See your shipped count and achievements
- Click "Logout" to sign out

## Navigation

The **STARO logo and navigation bar** on the left sidebar shows:
- Home (house icon)
- Explore (search icon)
- Watch (plus icon)
- Network (grid icon)
- Profile (person icon)

Click any to navigate. Active page is highlighted in black.

## Features in Action

### Logging Your First Ship
1. Go to Home
2. Click the blue "+ Ship" button in the STARO Pulse card
3. Your streak increases by 1 day
4. The blue dot advances on the streak tracker
5. "Best 0d" updates to show your current streak

### Creating a Post
1. Go to Home
2. Click the textarea "Share your startup update, photo, or video..."
3. Type your post (e.g., "Just raised our first funding round!")
4. Click "Create post" button
5. Post appears at the bottom of feed immediately
6. Shows your name, date, and content

### Editing Your Profile
1. Go to Profile
2. Click the settings gear icon (top right)
3. Fill in desired fields:
   - Bio: Describe yourself and your mission
   - Role: e.g., "Founder, Engineer, Designer"
   - Skills: Comma-separated, e.g., "React, Node.js, AI"
   - Location: e.g., "San Francisco, CA"
   - Website: Your personal or company site
4. Click "Save Changes"
5. Profile updates immediately

### Finding People to Follow
1. Go to Network
2. Click "Find people to follow"
3. Browse suggested founders
4. Click "Follow" to add to your network
5. Access direct messaging with followed users

### Browsing Startups
1. Go to Explore
2. Click category buttons to filter (All, AI, SaaS, etc.)
3. View startup cards with details
4. Click startup to see full profile and apply for jobs

## Keyboard Shortcuts

- `Escape` - Close modals
- `Tab` - Navigate between elements
- `Enter` - Submit forms

## Troubleshooting

### Getting logged out unexpectedly?
- Check if your session expired (sessions last 7 days)
- Re-login with your credentials
- Session is stored in HTTP-only cookies (secure)

### Posts not showing up?
- Wait a moment for React Query to refresh (updates every 2 seconds)
- Scroll down to see newest posts
- Refresh page to force reload

### Profile not updating?
- Click "Save Changes" button
- Wait 1-2 seconds for database update
- Refresh page if changes don't appear

### Can't log out?
- Click "Logout" button in Profile
- You'll be redirected to login page
- Session cookie is cleared

## Advanced Features (Ready to Build)

- **Real-time notifications**: WebSocket updates for follows, messages
- **AI Matching**: Machine learning co-founder recommendations
- **Video streaming**: Upload and stream videos with HLS
- **Payments**: Stripe integration for premium features
- **Analytics**: Track your impact and engagement
- **Export**: Download your profile data

## API & Development

### Server Actions Available
- `createPost(content)` - Create new post
- `getPosts()` - Fetch posts feed
- `createOrUpdateProfile(data)` - Update profile
- `getCurrentUserProfile()` - Get your profile
- `followUser(userId)` - Follow a user
- `getFollowers()` / `getFollowing()` - Get network

### Database Tables
- `user` - User accounts
- `session` - Active sessions
- `account` - Auth credentials
- `post` - User posts
- `video` - Video uploads
- `message` - Direct messages
- `follows` - Connection relationships
- `startup` - Startup listings
- `job` - Job postings

## Support & Deployment

### Deploy to Vercel
```bash
vercel deploy
```

### GitHub Integration
```bash
git push
# Auto-deploys on push to main
```

### View Logs
```bash
vercel logs
```

---

**Happy Shipping!** 🚀

For issues or questions, check the server logs with `npm run dev` terminal output.

Build. Ship. Hire. Raise. Scale. — STARO
