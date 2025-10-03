# Cloudflare Pages Deployment

## 🚀 Deployment Complete!

Your Excalidraw application has been successfully deployed to Cloudflare Pages.

### Deployment URLs

- **Production**: https://excalidraw-c3r.pages.dev
- **Custom Domain**: https://learn.metaglass.ai (requires DNS configuration)

### Quick Deploy

```bash
# Deploy to staging
./cloudflare/scripts/deploy.sh staging

# Deploy to production
./cloudflare/scripts/deploy.sh production

# Create preview deployment
./cloudflare/scripts/preview.sh --pr 123
```

## Custom Domain Setup

To configure the custom domain `learn.metaglass.ai`:

1. **Add domain via Cloudflare Dashboard**:
   - Go to https://dash.cloudflare.com
   - Navigate to your Pages project: `excalidraw`
   - Click on "Custom domains"
   - Click "Set up a custom domain"
   - Enter: `learn.metaglass.ai`
   - Follow the instructions to add DNS records

2. **DNS Configuration**:
   Add a CNAME record in your DNS provider:
   ```
   Type:   CNAME
   Name:   learn.metaglass.ai (or just 'learn' if base is metaglass.ai)
   Target: excalidraw-c3r.pages.dev
   Proxy:  Enabled (orange cloud)
   ```

3. **SSL Certificate**:
   - Cloudflare will automatically provision an SSL certificate
   - This process takes 5-15 minutes
   - Once complete, your site will be accessible via HTTPS

## CI/CD Configuration

### GitHub Secrets

Add these secrets to your GitHub repository:

1. **CLOUDFLARE_API_TOKEN**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create token with "Cloudflare Pages — Edit" permissions
   - Add to GitHub: Settings → Secrets → Actions

2. **CLOUDFLARE_ACCOUNT_ID**:
   - Find at: https://dash.cloudflare.com/ (right sidebar)
   - Add to GitHub: Settings → Secrets → Actions

### Automated Deployments

The GitHub workflow automatically deploys:

- **Staging**: On push to `main` or `master` branch
- **Production**: On git tags (e.g., `v1.0.0`)
- **Preview**: On pull requests

### Manual Deployment

Trigger manual deployment:
1. Go to: Actions → Deploy to Cloudflare Pages
2. Click "Run workflow"
3. Select environment (staging/production)

## Directory Structure

```
cloudflare/
├── README.md                        # This file
├── wrangler.toml                    # Cloudflare Pages configuration
├── _headers                         # HTTP headers configuration
├── _redirects                       # SPA routing rules
├── scripts/
│   ├── deploy.sh                    # Main deployment script
│   ├── rollback.sh                  # Rollback to previous deployment
│   └── preview.sh                   # Preview deployment script
├── environments/
│   ├── staging.env                  # Staging environment variables
│   └── production.env               # Production environment variables
└── .github/
    └── workflows/
        └── deploy-cloudflare.yml    # CI/CD workflow
```

## Configuration Files

### HTTP Headers (_headers)

Security and caching headers are automatically applied:

- **Security Headers**:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin

- **Caching**:
  - Static assets (fonts, JS, CSS): 1 year immutable
  - HTML files: no-cache, must revalidate

### SPA Routing (_redirects)

All routes redirect to `index.html` for client-side routing.

## Rollback

To rollback to a previous deployment:

```bash
# List deployments
./cloudflare/scripts/rollback.sh

# Rollback via dashboard
1. Go to https://dash.cloudflare.com
2. Select Pages project: excalidraw
3. View deployments
4. Click "Rollback to this deployment"
```

## Monitoring

### Cloudflare Dashboard

Access deployment metrics:
- https://dash.cloudflare.com
- Navigate to Pages → excalidraw
- View Analytics tab

### Key Metrics

- Requests per second
- Bandwidth usage
- Cache hit ratio
- Response time (p50, p95, p99)
- Geographic distribution
- Error rate

### Web Analytics

Free, privacy-first analytics available at:
- https://dash.cloudflare.com → Web Analytics

## Costs

**Cloudflare Pages is FREE** with:
- Unlimited bandwidth
- Unlimited requests
- 500 builds per month
- Custom domains
- SSL certificates
- DDoS protection
- Web Analytics

## Troubleshooting

### Build Fails

```bash
# Check Node.js version
node --version  # Should be 18-22

# Clear cache and reinstall
rm -rf node_modules .yarn/cache
yarn install

# Test build locally
yarn build:app
```

### Deployment Fails

```bash
# Verify authentication
wrangler whoami

# Re-authenticate if needed
wrangler login

# Check project exists
wrangler pages project list
```

### Site Not Accessible

1. Wait 30-60 seconds for DNS propagation
2. Check custom domain configuration in dashboard
3. Verify CNAME record points to correct target
4. Clear browser cache

## Performance Optimization

Cloudflare automatically applies:

- **Brotli and Gzip compression**
- **HTTP/3 and QUIC support**
- **Early Hints** for faster page loads
- **Rocket Loader** for JavaScript optimization
- **Auto Minify** for HTML/CSS/JS

### Recommended Settings

Enable in Cloudflare dashboard:
1. Auto Minify (HTML, CSS, JS)
2. Browser Cache TTL
3. HTTP/2 Server Push
4. Cloudflare Images (optional)

## Support

### Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Community Forum](https://community.cloudflare.com/)
- [Discord](https://discord.gg/cloudflaredev)

### Dashboard Links

- **Pages Dashboard**: https://dash.cloudflare.com → Pages
- **Project Settings**: https://dash.cloudflare.com → Pages → excalidraw
- **API Tokens**: https://dash.cloudflare.com/profile/api-tokens
- **Analytics**: https://dash.cloudflare.com → Web Analytics

## Next Steps

1. ✅ Application deployed to Cloudflare Pages
2. ⏳ Configure custom domain `learn.metaglass.ai` in dashboard
3. ⏳ Add GitHub secrets for CI/CD automation
4. ⏳ Test preview deployments on pull requests
5. ⏳ Set up monitoring and alerts

---

**Deployment completed successfully!** 🎉

Your Excalidraw application is now live at: https://excalidraw-c3r.pages.dev
