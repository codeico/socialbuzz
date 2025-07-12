# 🚀 Quick Start - OBS Donation Alerts

Panduan cepat untuk menguji fitur OBS donation alerts di SocialBuzz.

## ✅ Prerequisites

- Node.js 18+ installed
- Socket.IO dependencies installed (`npm install`)
- Server sudah running (`npm run dev`)

## 🔧 Setup Cepat

### 1. Start Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` dengan WebSocket support.

### 2. Test OBS Overlay

**URL untuk OBS Browser Source:**

```
http://localhost:3000/obs/[CREATOR_ID]
```

**Contoh:**

```
http://localhost:3000/obs/1
```

### 3. OBS Setup Instructions

1. **Buka OBS Studio**
2. **Add Browser Source:**
   - Right-click scene → Add → Browser
   - URL: `http://localhost:3000/obs/1`
   - Width: `1920`
   - Height: `1080`
   - ✅ Shutdown source when not visible
   - ✅ Refresh browser when scene becomes active

### 4. Customize Settings

**Settings Page:**

```
http://localhost:3000/obs/1/settings
```

**Fitur Customization:**

- 🎨 **Themes**: Default, Neon, Minimal, Gaming
- 📍 **Position**: Top-left, Top-right, Bottom-left, Bottom-right, Center
- ⏱️ **Duration**: 3-15 seconds
- 🎬 **Animation**: Slide, Fade, Bounce, Zoom
- 🎵 **Sound**: Enable/disable with volume control
- 🎨 **Colors**: Custom background, text, accent colors

### 5. Test Donation Alert

1. Buka settings page: `http://localhost:3000/obs/1/settings`
2. Klik **"Send Test Donation"**
3. Check OBS overlay untuk melihat test donation alert

## 🎁 Donation Widget

**Widget URL:**

```
http://localhost:3000/widget/[CREATOR_ID]
```

**Contoh:**

```
http://localhost:3000/widget/1
```

Widget ini bisa:

- Digunakan di website
- Di-embed sebagai iframe
- Dijadikan link sharing
- Menampilkan real-time donations

## 🔍 Testing Workflow

### Skenario 1: Basic OBS Test

1. ✅ Start server (`npm run dev`)
2. ✅ Buka OBS, add browser source dengan URL overlay
3. ✅ Buka settings page di tab lain
4. ✅ Send test donation
5. ✅ Verify alert muncul di OBS

### Skenario 2: Full Integration Test

1. ✅ Setup OBS overlay
2. ✅ Buka donation widget di tab lain
3. ✅ Isi form donation (test mode)
4. ✅ Submit donation
5. ✅ Verify notifikasi real-time di overlay

### Skenario 3: Customization Test

1. ✅ Buka settings page
2. ✅ Ubah theme ke "Neon"
3. ✅ Ubah position ke "Bottom-right"
4. ✅ Set duration ke 8 seconds
5. ✅ Send test donation
6. ✅ Verify perubahan tercermin di overlay

## 🐛 Troubleshooting

### Problem: Alert tidak muncul

**Solution:**

```bash
# Check console di browser
# Verify WebSocket connection
console.log('WebSocket status:', socket.connected);
```

### Problem: No sound

**Solution:**

1. Check browser audio permissions
2. Verify sound enabled di settings
3. Check file `/public/sounds/donation-alert.mp3` exists

### Problem: Wrong position/theme

**Solution:**

1. Clear localStorage: `localStorage.clear()`
2. Refresh settings page
3. Reconfigure settings

## 📋 Development Testing Checklist

- [ ] Server starts without errors
- [ ] WebSocket connection established
- [ ] OBS overlay loads correctly
- [ ] Settings page functional
- [ ] Test donation triggers alert
- [ ] Customization options work
- [ ] Sound alerts play
- [ ] Animation effects smooth
- [ ] Mobile responsive (widget)
- [ ] Multiple concurrent connections

## 🔗 URLs Summary

| Feature             | URL                         | Purpose                  |
| ------------------- | --------------------------- | ------------------------ |
| **OBS Overlay**     | `/obs/[creatorId]`          | For OBS Browser Source   |
| **OBS Settings**    | `/obs/[creatorId]/settings` | Customize alerts         |
| **Donation Widget** | `/widget/[creatorId]`       | Standalone donation form |
| **Dashboard**       | `/dashboard`                | Creator main dashboard   |
| **Admin Panel**     | `/admin`                    | Platform management      |

## 🎯 Next Steps

1. **Production Setup**: Update URLs untuk production domain
2. **Real Payment**: Integrate dengan Duitku payment gateway
3. **Database**: Connect ke real user data
4. **Sound Files**: Add custom donation sounds
5. **Advanced Features**: Multi-language, custom CSS themes

---

**Ready to go live? 🚀**

Sistem OBS donation alerts sudah fully functional dan siap untuk streaming!
