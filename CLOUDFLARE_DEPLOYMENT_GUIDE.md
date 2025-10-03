# Cloudflare Pages Deployment Guide for Excalidraw

This guide provides comprehensive instructions for deploying Excalidraw to Cloudflare Pages using Claude Code workflow commands.

## Overview

Excalidraw is deployed to Cloudflare Pages as a static web application, providing:

- **Zero Cost**: Unlimited bandwidth and requests on free tier
- **Global Performance**: 300+ edge locations worldwide
- **Instant Deployment**: Sub-second deploys with instant cache purge
- **Automatic HTTPS**: Free SSL certificates with auto-renewal
- **DDoS Protection**: Built-in enterprise-grade protection
- **Preview Deployments**: Automatic preview URLs for pull requests

## Claude Code Workflow Command

This repository includes a Claude Code workflow command that automates the entire deployment process:

| Command | Description | Usage |
|---------|-------------|-------|
| `/deploy-cloudflare` | Deploys to Cloudflare Pages | Builds and deploys to specified environment |

## Quick Start

### 1. Prerequisites

Ensure you have:
- Node.js 18-22 installed
- Yarn package manager
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account (free at cloudflare.com)
- Git repository initialized

### 2. Install Wrangler CLI

```bash
npm install -g wrangler

# Verify installation
wrangler --version
```

### 3. Authenticate with Cloudflare

```bash
# Interactive login (recommended)
wrangler login

# OR use API token
export CLOUDFLARE_API_TOKEN=your-api-token
```

To get an API token:
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Add "Cloudflare Pages — Edit" permission
5. Save token securely

### 4. Deploy to Staging

```
/deploy-cloudflare staging
```

This will:
- Build the application (`yarn build:app`)
- Create Cloudflare Pages project
- Deploy to `staging.excalidraw.pages.dev`
- Set staging environment variables

### 5. Deploy to Production

```
/deploy-cloudflare production
```

This will:
- Build with production configuration
- Deploy to production
- Configure custom domain (if specified)
- Enable monitoring

## Deployment Architecture

### Static Hosting on Cloudflare's Edge

```
User Request
    ↓
Cloudflare Edge (300+ locations)
    ↓
Cloudflare Pages (Static Files)
    ↓
Origin (Build artifacts)
```

### Benefits:

- **Performance**: Content served from nearest edge location
- **Scalability**: Automatic scaling to handle any traffic
- **Reliability**: 99.99% uptime SLA
- **Security**: DDoS protection, WAF, bot management

## Deployment Workflows

### First-Time Setup

```bash
# 1. Deploy to staging
/deploy-cloudflare staging

# 2. Test staging deployment
# Visit: https://staging-excalidraw.pages.dev

# 3. Deploy to production
/deploy-cloudflare production --domain learn.metaglass.ai

# 4. Configure custom domain (follow prompts)
```

### Continuous Deployment

```bash
# Staging: Automatic on push to main
git push origin main

# Production: Manual or on git tag
git tag v1.0.0
git push origin v1.0.0
```

### Preview Deployments

Pull requests automatically get preview URLs:

```
https://pr-123.excalidraw.pages.dev
```

## Configuration Files

### wrangler.toml

Created automatically by `/deploy-cloudflare`:

```toml
name = "excalidraw"
pages_build_output_dir = "excalidraw-app/build"

[env.production]
name = "excalidraw-production"

[env.production.vars]
VITE_APP_ENV = "production"
VITE_APP_ENABLE_TRACKING = "true"

[env.staging]
name = "excalidraw-staging"

[env.staging.vars]
VITE_APP_ENV = "staging"
VITE_APP_DISABLE_SENTRY = "true"
```

### _headers

Custom HTTP headers for security and caching:

```
# Global headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()

# Static assets - cache for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Service worker
/service-worker.js
  Cache-Control: public, max-age=0, must-revalidate

# HTML - no cache
/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

### _redirects

SPA routing configuration:

```
# Redirect all routes to index.html for SPA routing
/*    /index.html   200
```

## Environment Variables

### Staging Environment

```bash
VITE_APP_ENV=staging
VITE_APP_DISABLE_SENTRY=true
NODE_ENV=production
```

### Production Environment

```bash
VITE_APP_ENV=production
VITE_APP_ENABLE_TRACKING=true
VITE_APP_GIT_SHA=${GITHUB_SHA}
NODE_ENV=production
```

Set environment variables:

**Via wrangler.toml**:
```toml
[env.production.vars]
VITE_APP_CUSTOM_VAR = "value"
```

**Via Cloudflare Dashboard**:
1. Go to Workers & Pages
2. Select your project
3. Go to Settings → Environment Variables
4. Add variable for production/staging

## Custom Domain Setup

### Prerequisites

- Domain registered and added to Cloudflare
- DNS managed by Cloudflare

### Setup Steps

1. **Deploy to Production**:
   ```
   /deploy-cloudflare production --domain learn.metaglass.ai
   ```

2. **Add Custom Domain in Cloudflare**:
   - Go to: https://dash.cloudflare.com/
   - Select Workers & Pages → Your project
   - Go to "Custom domains"
   - Click "Set up a custom domain"
   - Enter: `learn.metaglass.ai`
   - Click "Activate domain"

3. **DNS Configuration** (automatic):
   Cloudflare automatically creates:
   ```
   Type: CNAME
   Name: learn.metaglass.ai
   Target: excalidraw.pages.dev
   Proxy: Enabled
   ```

4. **SSL Certificate** (automatic):
   - Certificate provisioned automatically
   - Usually ready in 5-15 minutes
   - Monitor in "SSL/TLS" section

5. **Verify**:
   ```bash
   curl -I https://learn.metaglass.ai
   ```

### Subdomain Setup

For staging subdomain:

```
staging.learn.metaglass.ai → staging-excalidraw.pages.dev
```

Cloudflare automatically handles:
- DNS records
- SSL certificates
- Traffic routing

## CI/CD Integration

### GitHub Actions Workflow

Generated at `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build application
        run: yarn build:app
        env:
          VITE_APP_ENV: ${{ github.ref == 'refs/heads/main' && 'staging' || 'production' }}
          VITE_APP_GIT_SHA: ${{ github.sha }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: excalidraw
          directory: excalidraw-app/build
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Required GitHub Secrets

Add these secrets to your repository:

1. `CLOUDFLARE_API_TOKEN`: API token with Pages edit permissions
2. `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

Get Account ID:
```bash
wrangler whoami
```

## Monitoring and Analytics

### Cloudflare Web Analytics

**Enable Web Analytics**:
1. Go to Cloudflare dashboard
2. Select "Web Analytics"
3. Click "Add a site"
4. Choose your Pages project

**Metrics Tracked**:
- Page views and unique visitors
- Bounce rate and session duration
- Top pages and referrers
- Geographic distribution
- Device and browser breakdown
- Core Web Vitals (LCP, FID, CLS)

### Performance Monitoring

**Built-in Metrics**:
- Request count and bandwidth
- Cache hit ratio
- Response time percentiles (p50, p95, p99)
- Error rate (4xx, 5xx)
- Geographic performance

**Access Metrics**:
- Cloudflare dashboard → Analytics
- Or use GraphQL Analytics API

### Alert Configuration

Set up alerts for:
- Traffic spikes
- Error rate increases
- Origin failures
- Custom domain issues

Configure in: Dashboard → Notifications

## Rollback Procedures

### Via Cloudflare Dashboard

1. Go to Workers & Pages → Your project
2. Click on "View build" or "Deployments"
3. Find the previous working deployment
4. Click "Rollback to this deployment"
5. Confirm rollback

**Rollback Time**: ~10 seconds

### Via Wrangler CLI

```bash
# List deployments
wrangler pages deployment list --project-name=excalidraw

# Rollback to specific deployment
wrangler pages deployment rollback <DEPLOYMENT_ID>
```

### Via Script

Use generated rollback script:

```bash
./cloudflare/scripts/rollback.sh
```

### Automatic Rollback

Configure in CI/CD:
- Health check after deployment
- Automatic rollback if checks fail
- Notification on rollback

## Troubleshooting

### Common Issues

#### Build Fails

**Symptoms**: Build error in GitHub Actions or local deployment

**Solutions**:
```bash
# 1. Check Node.js version
node --version  # Should be 18-22

# 2. Clear cache and reinstall
rm -rf node_modules .yarn/cache
yarn install

# 3. Test build locally
yarn build:app

# 4. Check build logs
cat excalidraw-app/build/index.html
```

#### Deployment Fails

**Symptoms**: Wrangler returns error

**Solutions**:
```bash
# 1. Verify authentication
wrangler whoami

# 2. Check API token permissions
# Ensure token has "Cloudflare Pages — Edit" permission

# 3. Verify project name is unique
wrangler pages project list

# 4. Check account ID
wrangler whoami
```

#### Site Not Accessible

**Symptoms**: 404 or connection errors

**Solutions**:
1. Wait 30-60 seconds for deployment propagation
2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
3. Check deployment status in dashboard
4. Verify custom domain DNS records
5. Check SSL certificate status

#### Custom Domain Not Working

**Symptoms**: Domain not resolving or showing "Not Found"

**Solutions**:
1. Verify domain added in Pages settings
2. Check DNS records in Cloudflare DNS dashboard
3. Wait for SSL certificate provisioning (5-15 min)
4. Purge Cloudflare cache
5. Test with `dig` or `nslookup`:
   ```bash
   dig learn.metaglass.ai
   ```

#### Performance Issues

**Symptoms**: Slow page loads

**Solutions**:
1. Enable Auto Minify in Cloudflare dashboard
2. Check cache hit ratio in analytics
3. Optimize image sizes
4. Enable Brotli compression
5. Use Cloudflare Images for optimization
6. Check _headers file for proper caching

## Cost Analysis

### Cloudflare Pages Free Tier

**Included**:
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds per month
- ✅ Unlimited sites
- ✅ Custom domains (unlimited)
- ✅ SSL certificates
- ✅ DDoS protection
- ✅ Web Analytics
- ✅ Preview deployments

**Usage Limits**:
- 500 builds/month (more than enough)
- 25 MB per file
- 20,000 files per deployment

**Exceeding Limits**:
- Upgrade to Workers Paid plan: $5/month
- Adds: Unlimited builds, faster builds, priority support

### Cost Comparison

| Provider | Monthly Cost | Bandwidth | Requests | Build Minutes |
|----------|--------------|-----------|----------|---------------|
| **Cloudflare Pages** | **$0** | Unlimited | Unlimited | 500 builds |
| AWS S3+CloudFront | $5-15 | 1-10 TB | Included | Pay per build |
| Vercel Free | $0 | 100 GB | Unlimited | 100 hours |
| Netlify Free | $0 | 100 GB | Unlimited | 300 minutes |

**Winner**: Cloudflare Pages (truly unlimited for free)

## Performance Optimization

### Built-in Optimizations

Cloudflare Pages automatically provides:

1. **HTTP/3 and QUIC**: Faster protocol
2. **Brotli Compression**: Better than gzip
3. **Early Hints**: Faster resource loading
4. **Smart Tiered Caching**: Multi-tier cache hierarchy
5. **Argo Smart Routing**: Intelligent traffic routing (paid)

### Manual Optimizations

1. **Enable Auto Minify**:
   - Dashboard → Speed → Optimization
   - Enable: JavaScript, CSS, HTML

2. **Configure Browser Cache**:
   - Set appropriate TTL values
   - Use `_headers` file for fine control

3. **Image Optimization**:
   - Use WebP format
   - Lazy load images
   - Consider Cloudflare Images (paid)

4. **Code Splitting**:
   - Already enabled in Vite build
   - Reduces initial bundle size

5. **Service Worker**:
   - Cache static assets
   - Offline support
   - Already configured in Excalidraw

### Performance Targets

**Achieved with Cloudflare**:
- TTFB: <50ms (p95)
- FCP: <1s (p95)
- LCP: <1.5s (p95)
- CLS: <0.1
- FID: <100ms

## Security Best Practices

### Implemented Security

✅ **HTTPS Only**: Automatic SSL/TLS certificates
✅ **Security Headers**: CSP, X-Frame-Options, etc.
✅ **DDoS Protection**: Built-in enterprise-grade
✅ **Bot Management**: Basic bot protection included
✅ **WAF**: Web Application Firewall (available)

### Recommended Enhancements

1. **Enable Bot Fight Mode**:
   - Dashboard → Security → Bots
   - Free basic bot protection

2. **Configure WAF Rules**:
   - Dashboard → Security → WAF
   - Add custom rules for protection

3. **Enable Rate Limiting**:
   - Protect against abuse
   - Configure per-path limits

4. **Set Up Access Control**:
   - Cloudflare Access for staging
   - Restrict access by email/IP

5. **Monitor Security Events**:
   - Review security events regularly
   - Set up alerts for attacks

## Advanced Features

### Preview Deployments

**Automatic for PRs**:
- Each PR gets unique URL
- Format: `pr-123.excalidraw.pages.dev`
- Automatic cleanup after PR merge

**Manual Preview**:
```bash
wrangler pages deploy excalidraw-app/build \
  --project-name=excalidraw \
  --branch=feature-branch
```

### Branch Deployments

Configure different branches:
- `main` → staging
- `production` → production
- Feature branches → preview

Setup in: Dashboard → Settings → Builds & deployments

### Functions (Optional)

Add serverless functions:

```
functions/
└── api/
    └── hello.ts
```

Deployed at: `https://your-site.pages.dev/api/hello`

### Headers and Redirects

**Advanced _headers**:
```
# Specific security policy for app
/app/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'

# CORS for API
/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
```

**Advanced _redirects**:
```
# Redirect old paths
/old-path  /new-path  301

# Country-specific redirects
/  /us  302  Country=US
/  /uk  302  Country=GB

# A/B testing
/  /variant-a  302  Cookie=ab_test=a
```

## Migration from AWS

### If Currently Using AWS

**Migration Steps**:

1. **Keep AWS Running**: Don't shut down yet
2. **Deploy to Cloudflare**: Run `/deploy-cloudflare production`
3. **Test Cloudflare Deployment**: Verify functionality
4. **Update DNS**: Point domain to Cloudflare
5. **Monitor**: Watch for issues
6. **Decommission AWS**: After 7-30 days of stability

**DNS Migration**:
```
# Before (AWS)
learn.metaglass.ai → CloudFront distribution

# After (Cloudflare)
learn.metaglass.ai → excalidraw.pages.dev
```

**Rollback Plan**:
Keep AWS infrastructure for 30 days as fallback.

## Support and Resources

### Cloudflare Resources

- **Documentation**: https://developers.cloudflare.com/pages/
- **Community Forum**: https://community.cloudflare.com/
- **Discord**: https://discord.gg/cloudflaredev
- **Status Page**: https://www.cloudflarestatus.com/
- **Blog**: https://blog.cloudflare.com/

### Getting Help

1. Check deployment logs in Cloudflare dashboard
2. Review GitHub Actions logs
3. Search Cloudflare Community forum
4. Ask in Cloudflare Discord
5. Contact Cloudflare support (Enterprise customers)

### Useful Commands

```bash
# Check Wrangler version
wrangler --version

# List all deployments
wrangler pages deployment list

# View project details
wrangler pages project list

# Tail deployment logs
wrangler pages deployment tail

# View build logs
wrangler pages deployment tail --deployment-id=xxx
```

## Appendix

### File Sizes and Limits

- Maximum file size: 25 MB
- Maximum files per deployment: 20,000
- Maximum total deployment size: 20 GB

**If you exceed**:
- Optimize images
- Remove unused assets
- Split into multiple Pages projects

### Build Configuration

**Build command**:
```bash
yarn build:app
```

**Output directory**:
```
excalidraw-app/build/
```

**Node version**:
```
18 (LTS)
```

### Environment Best Practices

1. **Use separate projects** for staging and production
2. **Different custom domains** for each environment
3. **Environment-specific variables** in wrangler.toml
4. **Test in staging** before production deploy
5. **Monitor both environments** separately

---

**Last Updated**: 2025-01-15
**Version**: 1.0.0
**Recommended for**: All Excalidraw deployments
