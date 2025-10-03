# AWS Deployment Guide for Excalidraw

This guide provides comprehensive instructions for deploying Excalidraw to AWS infrastructure using Claude Code workflow commands.

## Overview

Excalidraw can be deployed to AWS using two primary architectures:

1. **S3 + CloudFront** (Recommended): Static hosting with global CDN
2. **ECS Fargate**: Containerized deployment with auto-scaling

## Claude Code Workflow Commands

This repository includes Claude Code workflow commands that automate the entire deployment process:

| Command | Description | Usage |
|---------|-------------|-------|
| `/setup-aws-infra` | Creates AWS infrastructure | Sets up S3, CloudFront, ECR, ECS resources |
| `/containerize` | Validates Docker configuration | Optimizes Dockerfile and creates build scripts |
| `/deploy` | Deploys application to AWS | Builds and deploys to specified environment |
| `/monitor` | Sets up monitoring | Creates CloudWatch dashboards and alarms |
| `/rollback` | Rolls back to previous version | Reverts failed deployments |

## Quick Start

### 1. Prerequisites

Ensure you have:
- AWS CLI installed and configured (`aws configure`)
- AWS account with appropriate permissions
- Node.js 18-22 and Yarn installed
- Docker installed (for container deployments)
- Git repository initialized

### 2. Setup AWS Infrastructure

**For S3 + CloudFront (Recommended)**:
```
/setup-aws-infra s3-cloudfront --environment staging
```

**For ECS Fargate**:
```
/setup-aws-infra ecs-fargate --environment production
```

This creates:
- S3 bucket for static hosting OR ECR repository for containers
- CloudFront distribution OR Application Load Balancer
- IAM roles and policies
- CloudFormation stacks
- Configuration files

### 3. Containerize (Optional for S3, Required for ECS)

```
/containerize --optimize
```

This validates and optimizes:
- Existing Dockerfile
- Build scripts
- Docker Compose configurations
- CI/CD workflows

### 4. Deploy Application

**To staging**:
```
/deploy staging
```

**To production**:
```
/deploy production
```

This executes:
- Application build (`yarn build:app:docker`)
- Container build (if using ECS) or static file preparation
- Upload to S3 or ECR
- Deployment to CloudFront or ECS
- Health checks and validation

### 5. Set Up Monitoring

```
/monitor production --type standard
```

This creates:
- CloudWatch dashboards
- Alarms for errors and performance
- Log aggregation
- Cost tracking
- Notification routing (Slack, email, PagerDuty)

## Deployment Workflows

### Staging Deployment Workflow

```bash
# First time setup
/setup-aws-infra s3-cloudfront --environment staging
/containerize
/deploy staging
/monitor staging --type basic

# Subsequent deployments
/deploy staging
```

### Production Deployment Workflow

```bash
# First time setup
/setup-aws-infra s3-cloudfront --environment production --domain learn.metaglass.ai
/containerize --optimize
/deploy production
/monitor production --type standard

# Subsequent deployments
# Deploy to staging first
/deploy staging

# After validation, deploy to production
/deploy production
```

### Rollback Workflow

```bash
# Automatic rollback to previous version
/rollback production

# Rollback to specific version
/rollback production --to-version v1.2.0

# List available versions
/rollback production --list-only
```

## Architecture Options

### Option 1: S3 + CloudFront (Recommended)

**Best for**: Static web applications like Excalidraw

**Architecture**:
```
User → CloudFront (CDN) → S3 Bucket (Static Files)
```

**Benefits**:
- Low cost (~$1-5/month for low traffic)
- High performance (global CDN)
- Automatic scaling
- HTTPS included
- No server management

**Use when**:
- Hosting static SPA
- Global user base
- Cost optimization is priority
- Simple deployment preferred

### Option 2: ECS Fargate

**Best for**: Applications requiring backend processing or custom server logic

**Architecture**:
```
User → Route53 → ALB → ECS Fargate Tasks (Containers) → ECR
                              ↓
                        CloudWatch Logs
```

**Benefits**:
- Full container orchestration
- Auto-scaling
- Easy updates (rolling deployments)
- Support for backend services
- Advanced networking options

**Use when**:
- Need custom server-side logic
- Require WebSocket connections
- Need background processing
- Want containerized deployments

## Cost Estimates

### S3 + CloudFront

| Environment | Monthly Cost | Details |
|-------------|--------------|---------|
| Staging | $1-3 | Minimal traffic, small storage |
| Production | $5-15 | Moderate traffic, optimized caching |
| High Traffic | $20-50 | High traffic, multiple regions |

**Cost Breakdown**:
- S3 Storage: $0.023/GB/month
- CloudFront Data Transfer: $0.085/GB (first 10 TB)
- CloudFront Requests: $0.0075 per 10,000 requests
- Route53 (if custom domain): $0.50/month

### ECS Fargate

| Environment | Monthly Cost | Details |
|-------------|--------------|---------|
| Staging | $30-50 | Single task, minimal resources |
| Production | $80-150 | Multiple tasks, auto-scaling |
| High Availability | $200-300 | Multi-region, redundancy |

**Cost Breakdown**:
- Fargate vCPU: $0.04048/vCPU/hour
- Fargate Memory: $0.004445/GB/hour
- ALB: ~$16/month + $0.008/LCU-hour
- NAT Gateway: ~$32/month + data transfer
- ECR Storage: $0.10/GB/month

## Environment Configuration

### Staging Environment

**Purpose**: Testing and validation before production

**Configuration**:
- Lower resource limits
- Debug logging enabled
- Sentry disabled
- Shorter cache TTLs
- Lower costs

**Environment Variables**:
```bash
VITE_APP_DISABLE_SENTRY=true
NODE_ENV=production
VITE_APP_ENV=staging
```

### Production Environment

**Purpose**: Live user-facing application

**Configuration**:
- Production-grade resources
- Error tracking enabled (Sentry)
- Optimized caching
- Multi-region (optional)
- Monitoring and alarms

**Environment Variables**:
```bash
VITE_APP_ENABLE_TRACKING=true
VITE_APP_GIT_SHA=${GIT_SHA}
NODE_ENV=production
VITE_APP_ENV=production
```

## CI/CD Integration

The workflow commands generate GitHub Actions workflows:

### `.github/workflows/deploy-aws.yml`

Automates:
- Build on push to main/master
- Deploy to staging automatically
- Deploy to production on git tag
- Run tests before deployment
- Automated rollback on failure

### Manual Trigger

```bash
# Trigger deployment via GitHub Actions
gh workflow run deploy-aws.yml -f environment=production
```

## Security Best Practices

### Infrastructure Security

✅ **Implemented**:
- HTTPS only (CloudFront/ALB with ACM certificates)
- S3 bucket not publicly accessible (CloudFront OAI)
- IAM roles with least privilege
- Encryption at rest (S3, EBS)
- VPC isolation (ECS deployments)
- Security headers (CSP, X-Frame-Options, etc.)

✅ **Recommended**:
- Enable AWS WAF for DDoS protection
- Enable AWS Shield Standard (free)
- Use AWS Secrets Manager for sensitive data
- Enable CloudTrail for audit logging
- Set up AWS GuardDuty for threat detection
- Implement MFA for AWS console access

### Application Security

✅ **Built-in**:
- Content Security Policy headers
- CORS configuration for fonts/assets
- No sensitive data in client code
- Secure WebSocket connections (WSS)

✅ **Recommended**:
- Regular dependency updates
- Security scanning in CI/CD
- Monitor for CVEs in dependencies
- Implement rate limiting
- Add bot protection

## Monitoring and Alerts

### Key Metrics to Monitor

**Availability**:
- Uptime percentage (target: >99.9%)
- Health check status
- 5xx error rate (target: <0.1%)

**Performance**:
- Page load time (target: <2s p95)
- TTFB (target: <200ms p95)
- Cache hit ratio (target: >90%)

**Cost**:
- Daily spending trends
- Month-to-date vs budget
- Cost per user

### Alert Thresholds

**Critical** (PagerDuty + Email):
- 5xx error rate > 1% for 5 minutes
- Service completely down
- All health checks failing

**Warning** (Email):
- 5xx error rate > 0.5% for 10 minutes
- Response time > 3s (p95)
- Cache hit ratio < 80%
- Daily cost exceeds $20

**Info** (Slack):
- Deployment completed
- Unusual traffic spike
- Cache hit ratio < 90%

## Troubleshooting

### Common Issues

#### Deployment Fails

**Symptoms**: `/deploy` command fails

**Solutions**:
1. Check AWS credentials: `aws sts get-caller-identity`
2. Verify IAM permissions
3. Check CloudFormation stack status
4. Review build logs for errors
5. Ensure sufficient disk space

#### Site Not Accessible After Deployment

**S3 + CloudFront**:
1. Wait for CloudFront invalidation (5-15 minutes)
2. Check CloudFront distribution status
3. Verify S3 bucket policy
4. Test S3 bucket directly

**ECS Fargate**:
1. Check ECS service status
2. Verify target group health checks
3. Review security group rules
4. Check container logs in CloudWatch

#### High Costs

**Solutions**:
1. Review CloudWatch cost dashboard
2. Check for NAT Gateway data transfer (ECS)
3. Optimize CloudFront caching
4. Review S3 storage and lifecycle policies
5. Consider moving to S3 + CloudFront if using ECS

#### Slow Performance

**Solutions**:
1. Check CloudWatch metrics
2. Increase CloudFront cache TTL
3. Enable compression (gzip/brotli)
4. Optimize image sizes
5. Consider adding CloudFront functions for edge optimization

## Maintenance

### Regular Tasks

**Weekly**:
- Review monitoring dashboards
- Check error logs
- Review costs

**Monthly**:
- Update dependencies (`yarn upgrade`)
- Review and optimize CloudWatch alarms
- Analyze cost trends
- Update documentation

**Quarterly**:
- Review and update IAM policies
- Security audit
- Performance optimization review
- Disaster recovery testing

### Updates and Patching

**Application Updates**:
```bash
# Update dependencies
yarn upgrade

# Test locally
yarn test:all

# Deploy to staging
/deploy staging

# After validation, deploy to production
/deploy production
```

**Infrastructure Updates**:
```bash
# Update CloudFormation stacks
/setup-aws-infra s3-cloudfront --environment production --update
```

## Disaster Recovery

### Backup Strategy

**S3 + CloudFront**:
- S3 versioning enabled automatically
- Cross-region replication (optional)
- CloudFormation stack templates in git

**ECS Fargate**:
- ECR image retention (last 10 versions)
- ECS task definition revisions preserved
- Database backups (if applicable)

### Recovery Procedures

**Complete Outage**:
1. Check AWS Service Health Dashboard
2. Review CloudWatch alarms
3. Attempt rollback: `/rollback production`
4. If rollback fails, redeploy: `/deploy production --force-rebuild`
5. Contact AWS support if infrastructure issue

**Partial Outage**:
1. Identify affected component in monitoring
2. Check recent deployments
3. Rollback if recent deployment caused issue
4. Scale up resources if capacity issue

## Advanced Topics

### Multi-Region Deployment

For global users, consider:
- CloudFront automatically uses edge locations globally (S3 + CloudFront)
- Multi-region ECS deployments with Route53 latency routing
- Cross-region S3 replication

### Blue/Green Deployments

Implement zero-downtime deployments:
- ECS supports blue/green via CodeDeploy
- S3 + CloudFront can use Lambda@Edge for traffic splitting

### Custom Domains

```bash
# Setup with custom domain
/setup-aws-infra s3-cloudfront --environment production --domain app.example.com

# After infrastructure setup:
# 1. Verify domain in ACM (check email or add DNS records)
# 2. Update DNS to point to CloudFront (A record alias)
# 3. Wait for DNS propagation (5-60 minutes)
```

### Performance Optimization

**CloudFront**:
- Enable HTTP/2 and HTTP/3
- Use origin shield for high-traffic origins
- Implement CloudFront Functions for edge logic
- Enable Brotli compression

**Application**:
- Code splitting for smaller bundles
- Lazy loading for images
- Service worker caching
- Optimize fonts and assets

## Support and Resources

### AWS Resources

- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Documentation](https://docs.aws.amazon.com/s3/)
- [ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Support](https://console.aws.amazon.com/support/)

### Excalidraw Resources

- [Excalidraw Documentation](https://docs.excalidraw.com)
- [GitHub Repository](https://github.com/excalidraw/excalidraw)
- [Discord Community](https://discord.gg/UexuTaE)

### Getting Help

1. Check monitoring dashboards
2. Review CloudWatch logs
3. Search GitHub issues
4. Ask in Excalidraw Discord
5. Create GitHub issue with deployment details

## Appendix

### Required AWS Permissions

See individual command documentation for detailed permission requirements:
- `/setup-aws-infra.md` - Infrastructure permissions
- `/deploy.md` - Deployment permissions
- `/monitor.md` - Monitoring permissions

### Command Reference

All workflow commands are documented in individual `.md` files:
- `setup-aws-infra.md` - Infrastructure setup
- `containerize.md` - Docker configuration
- `deploy.md` - Deployment automation
- `monitor.md` - Monitoring setup
- `rollback.md` - Rollback procedures

### Environment Variables Reference

**Build-time**:
- `NODE_ENV` - Node environment (production/development)
- `VITE_APP_ENV` - Application environment (staging/production)
- `VITE_APP_DISABLE_SENTRY` - Disable error tracking
- `VITE_APP_ENABLE_TRACKING` - Enable analytics
- `VITE_APP_GIT_SHA` - Git commit SHA for versioning

**Runtime (ECS only)**:
- Container environment variables configured in task definition
- Secrets managed via AWS Secrets Manager

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintainer**: DevOps Team
