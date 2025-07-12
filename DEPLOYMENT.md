# Firebase Deployment Guide

This guide will help you deploy the Archivo application to Firebase Hosting.

## Prerequisites

1. **Firebase Account**: Create a free account at [https://firebase.google.com/](https://firebase.google.com/)
2. **Firebase CLI**: Install globally with `npm install -g firebase-tools`

## Deployment Steps

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "archivo-audio-app")
4. Follow the setup wizard (you can disable Google Analytics for this project)
5. Note your project ID from the project settings

### 2. Configure Firebase Locally

1. Login to Firebase CLI:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

   When prompted:
   - Select "Use an existing project" and choose your project
   - Set public directory to: `out`
   - Configure as single-page app: `Yes`
   - Overwrite existing index.html: `No`

3. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

### 3. Build and Deploy

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

   Or use the combined command:
   ```bash
   npm run deploy
   ```

### 4. Access Your App

After deployment, Firebase will provide you with hosting URLs:
- **Live URL**: `https://your-project-id.web.app`
- **Custom Domain** (optional): You can set up a custom domain in the Firebase Console

## Configuration Files

- `firebase.json`: Firebase hosting configuration
- `.firebaserc`: Project aliases and settings
- `next.config.ts`: Next.js configuration for static export

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`

### Deployment Issues
- Verify Firebase CLI is logged in: `firebase login:list`
- Check project ID in `.firebaserc`
- Ensure the `out` directory exists after build

### Audio Player Issues
- The SpectrogramPlayer uses dynamic imports to avoid SSR issues
- Mock audio URLs are used - replace with real URLs for production

## Production Considerations

1. **Audio Files**: Replace dummy URLs in `src/data/audioData.ts` with actual audio file URLs
2. **CDN**: Use a proper CDN (DigitalOcean Spaces, AWS S3, etc.) for audio files
3. **Analytics**: Consider adding Firebase Analytics for usage tracking
4. **Performance**: Optimize audio file sizes and formats for web delivery
5. **SEO**: Add proper meta tags and structured data for better SEO

## Environment Variables (Optional)

For production, you might want to use environment variables:

1. Create `.env.local`:
   ```env
   NEXT_PUBLIC_AUDIO_CDN_URL=https://your-cdn.digitaloceanspaces.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   ```

2. Use in your code:
   ```typescript
   const audioUrl = `${process.env.NEXT_PUBLIC_AUDIO_CDN_URL}/audio/track.mp3`
   ```

## Continuous Deployment

For automatic deployments, you can set up GitHub Actions:

1. Create `.github/workflows/deploy.yml`
2. Add Firebase token: `firebase login:ci`
3. Store token in GitHub Secrets
4. Configure workflow to build and deploy on push to main branch
