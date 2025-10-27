# Deploy to GitHub Pages

## Quick Start

### 1. Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository

```bash
# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/maintenance-qr-app.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to `main`

### 4. Your Site Will Be Live At:

```
https://YOUR_USERNAME.github.io/maintenance-qr-app
```

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the static site
npm run build

# Create or switch to gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# Copy the built files
cp -r out/* .
git add .

# Commit and push
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Return to main branch
git checkout main
```

Then in GitHub Settings → Pages, select branch `gh-pages` as the source.

## Important Notes

- The workflow uses Node.js 18
- It automatically installs dependencies with `--legacy-peer-deps` flag
- Static files are built to the `out` folder
- Deployment happens automatically on every push to `main` branch

## Troubleshooting

### Build Fails
- Check the Actions tab in GitHub for error details
- Make sure all dependencies are listed in `package.json`

### Site Not Updating
- Check the Actions tab to see if the workflow completed
- Wait a few minutes for GitHub Pages to update
- Check your repository name in the URL

### 404 Errors
- If deploying to a custom domain, you may need to update the basePath in `next.config.mjs`

