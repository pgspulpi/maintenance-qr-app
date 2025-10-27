# Maintenance QR App

A web application for managing equipment codes and scanning QR codes for maintenance tracking.

## Features

- 📋 **Maintenance Page**: Import data from Google Sheets and generate QR codes for equipment
- 📷 **QR Scanner**: Scan QR codes to view equipment information
- 📱 **Progressive Web App**: Installable on mobile devices

## Building for Static Web Server

This app has been configured to export as a static site that can be hosted on any static web server.

### Build the Static Site

```bash
npm run build
# or
pnpm build
# or
pnpm export
```

This will create an `out` folder containing all the static files.

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to your repository Settings → Pages
3. Under "Source", select "GitHub Actions"
4. Push to the `main` branch to trigger automatic deployment
5. Your site will be available at `https://YOUR_USERNAME.github.io/maintenance-qr-app`

The deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`)

### Deploy to Other Platforms

- **Netlify**: Deploy the `out` folder
- **Vercel**: Deploy the `out` folder
- **Apache/Nginx**: Copy the `out` folder contents to your web root directory
- **Any static hosting**: Upload the `out` folder contents to your hosting provider

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Maintenance Page

1. Get a Google Sheets URL with "Anyone with the link can view" permissions
2. Paste the URL into the app
3. Load the data
4. Click "Generate QR" for any equipment to create a QR code

### QR Scanner

1. Click "Start Scanning" to activate the camera
2. Point the camera at a QR code
3. The equipment code will be displayed automatically

## Requirements

- Modern browser with camera support (for QR scanning)
- Public Google Sheets URL (for maintenance data loading)
- Google Sheets must be set to "Anyone with the link can view" to avoid CORS issues

## Important Notes

### QR Code Routing
The QR code generation uses hash-based routing (`/qr#code`). This works perfectly in static export since all pages are client-side rendered and handle routing on the client. The code is passed via the URL hash to avoid build-time generation requirements.

### CORS with Google Sheets
The app fetches Google Sheets data directly from the browser. Make sure your Google Sheet is:
1. Set to "Anyone with the link can view"
2. Contains columns named "Nombre" and "Codigo"

### Build Output
After running `npm run build`, you'll find all static files in the `out` folder ready for deployment.

## Technologies

- Next.js 13.5
- React 18
- Tailwind CSS
- shadcn/ui components
- html5-qrcode for scanning
- qrcode for generation

## Node.js Compatibility

This project has been configured to work with Node.js 16+. The dependencies have been downgraded to compatible versions to ensure the build works on your system.

