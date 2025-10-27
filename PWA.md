# PWA Setup Guide

Your application is now a Progressive Web App (PWA) that can be installed on mobile and desktop devices.

## ✅ What's Included

### Service Worker (Offline Support)
- **File**: `public/sw.js`
- Automatically caches pages and assets for offline access
- Uses cache-first strategy for static assets
- Network-first strategy for navigation

### Web Manifest
- **File**: `app/manifest.json`
- Defines app metadata, icons, and display mode
- Enables "Add to Home Screen" functionality

### Registration
- Service worker automatically registers when the app loads
- **File**: `app/sw-register.tsx`

## 📱 How Users Can Install the PWA

### Mobile (iOS & Android)

1. Open the app in a mobile browser
2. Tap the browser menu (⋮ or ...)
3. Look for **"Add to Home Screen"** or **"Install App"**
4. Confirm installation
5. Icon appears on home screen

### Desktop (Chrome, Edge)

1. Look for the install icon in the address bar
2. Or use menu: **"Install Maintenance Manager"**
3. App opens in standalone window

## 🎯 Features Enabled

- ✅ **Offline Access**: Works without internet after first visit
- ✅ **Installable**: Can be added to home screen/desktop
- ✅ **Standalone Mode**: Opens without browser UI
- ✅ **Responsive**: Works on mobile and desktop
- ✅ **Fast Loading**: Assets cached locally

## 🔧 Testing the PWA

### Chrome DevTools

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest** - Verify metadata
   - **Service Workers** - Should see active SW
   - **Cache Storage** - Should see cached assets

### Lighthouse Audit

1. Open DevTools → **Lighthouse** tab
2. Run PWA audit
3. Should score 100/100 on PWA metrics

## 📝 Customize Icons

Replace the placeholder icons in `public/` with your own:

- `icon-192.png` - 192x192px
- `icon-512.png` - 512x512px
- Update manifest.json with your icon paths

## 🔄 Update Service Worker

When you update the app:

1. Change `CACHE_NAME` version in `public/sw.js`
2. Old cache will be cleared automatically
3. New version will be cached

## ⚠️ Important Notes

- Requires **HTTPS** (or localhost for development)
- Service worker only works on first visit or manual update
- For development, unregister in DevTools if needed

## 🚀 Deployment

The PWA works automatically when deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any HTTPS hosting

HTTPS is required for service workers to work!

