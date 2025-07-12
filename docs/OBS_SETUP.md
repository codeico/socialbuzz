# OBS Donation Alerts Setup Guide

This guide will help you set up real-time donation alerts for your OBS streaming
setup using SocialBuzz.

## Prerequisites

- OBS Studio installed
- Active SocialBuzz creator account
- Basic knowledge of OBS scenes and sources

## Quick Setup

### 1. Get Your OBS Overlay URL

1. Log in to your SocialBuzz dashboard
2. Click on "OBS Setup" in the Quick Actions section
3. Copy the overlay URL provided (it will look like:
   `https://yourdomain.com/obs/[your-creator-id]`)

### 2. Add Browser Source to OBS

1. Open OBS Studio
2. In your scene, right-click and select "Add" → "Browser"
3. Create a new Browser Source with these settings:
   - **URL**: Paste your overlay URL
   - **Width**: 1920
   - **Height**: 1080
   - **CSS**: Leave empty
   - **Shutdown source when not visible**: ✅ Checked
   - **Refresh browser when scene becomes active**: ✅ Checked
   - **Control audio via OBS**: ✅ Checked (if you want sound alerts)

### 3. Configure Your Alerts

1. Go to your OBS Settings page:
   `https://yourdomain.com/obs/[your-creator-id]/settings`
2. Customize your donation alerts:
   - **Theme**: Choose from Default, Neon, Minimal, or Gaming
   - **Position**: Top-left, Top-right, Bottom-left, Bottom-right, or Center
   - **Duration**: How long alerts stay visible (3-15 seconds)
   - **Animation**: Slide, Fade, Bounce, or Zoom
   - **Display Options**: Show/hide amount, donor name, or message
   - **Colors**: Customize background, text, and accent colors
   - **Sound**: Enable/disable sound alerts with volume control

### 4. Test Your Setup

1. In the OBS Settings page, click "Send Test Donation"
2. Check that the alert appears in your OBS overlay
3. Verify the animation, sound, and appearance match your preferences

## Advanced Configuration

### Sound Files

The system uses `/sounds/donation-alert.mp3` for notification sounds. You can
replace this file with your own custom sound:

1. Create a sound file (MP3 format recommended)
2. Keep it under 5 seconds for best experience
3. Replace the default file in the `public/sounds/` directory

### Custom Themes

You can create custom themes by modifying the CSS classes in the overlay
component:

```css
/* Example custom theme */
.custom-theme {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #4f46e5;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
```

### Multiple Overlays

You can use the same overlay URL in multiple scenes. Each instance will receive
the same donation alerts simultaneously.

## Troubleshooting

### Common Issues

**Alert not showing up:**

- Check that the browser source URL is correct
- Verify the browser source is not hidden or filtered out
- Make sure the creator ID in the URL matches your account

**No sound:**

- Check that "Control audio via OBS" is enabled in browser source settings
- Verify sound is enabled in the OBS Settings page
- Ensure your system audio is not muted

**Alerts appearing in wrong position:**

- Adjust the position setting in the OBS Settings page
- Consider the overlay dimensions (1920x1080) when positioning

**Missing donations:**

- Check your internet connection
- Verify the WebSocket connection is active (check browser console)
- Refresh the browser source if needed

### Browser Source Settings

For optimal performance, use these browser source settings:

- **Width**: 1920
- **Height**: 1080
- **FPS**: 30 (default)
- **Shutdown source when not visible**: ✅
- **Refresh browser when scene becomes active**: ✅

### Network Requirements

The donation alerts use WebSocket connections for real-time updates. Ensure:

- Stable internet connection
- WebSocket traffic is not blocked by firewall
- Browser supports WebSocket connections

## Donation Widget Integration

You can also embed a donation widget on your website or stream overlay page:

### Widget URL

```
https://yourdomain.com/widget/[your-creator-id]
```

### Features

- Real-time donation form
- Recent donations display
- Mobile-responsive design
- Customizable donation amounts
- Anonymous donation option

## API Integration

For advanced users, you can integrate with the donation system programmatically:

### WebSocket Events

Connect to the WebSocket server and listen for donation events:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('join-obs-overlay', {
  creatorId: 'your-creator-id',
  overlayId: 'custom-overlay-id',
});

socket.on('donation-alert', donation => {
  console.log('New donation:', donation);
  // Handle donation notification
});
```

### Donation Event Structure

```typescript
interface DonationNotification {
  id: string;
  donorName: string;
  amount: number;
  message: string;
  timestamp: string;
  creatorId: string;
  creatorUsername: string;
  isAnonymous: boolean;
  currency: string;
}
```

## Support

For additional help or custom setups:

1. Check the browser console for error messages
2. Test with different browsers
3. Verify your creator account is active
4. Contact support if issues persist

## Examples

### Basic Stream Setup

1. Add browser source for donation alerts
2. Position alerts in top-right corner
3. Use default theme with 5-second duration
4. Enable sound alerts

### Advanced Stream Setup

1. Multiple browser sources for different alert types
2. Custom CSS themes matching stream branding
3. Conditional scene switching based on donation amounts
4. Integration with chat bots for donation announcements

---

**Note**: Make sure to save your OBS settings after configuration and test
thoroughly before going live!
