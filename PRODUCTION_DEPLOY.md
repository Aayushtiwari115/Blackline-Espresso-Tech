# Production Deployment Guide

## Security Headers (Configure on Host)

Add these headers in your server configuration (nginx, Apache, or hosting control panel):

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://api.web3forms.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.web3forms.com; frame-ancestors 'none';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## HTTPS/SSL

- Force HTTPS on all traffic.
- Use HSTS headers for 1 year minimum.

## Database/Environment

- Store Web3Forms API key securely (never in source code).
- Rotate API keys periodically.

## Form Submission

- Privacy consent is now mandatory before booking submission.
- All form data is validated client-side and server-side.
- Submissions go to Web3Forms, which emails bookings to onepixcce@gmail.com.

## Database Cleanup

- Regularly purge old booking submissions (per your retention policy).
- Comply with Privacy Act retention limits.

## Monitoring & Logging

- Enable server logs for booking submissions.
- Monitor for abuse or spam submissions.
- Track form conversion rates.

## Pre-Launch Checklist

- [ ] Domain DNS configured and SSL certificate installed.
- [ ] All security headers configured.
- [ ] HTTPS redirects working.
- [ ] Sitemap submitted to Google Search Console.
- [ ] Google Business Profile created and verified.
- [ ] Web3Forms access key secured in environment.
- [ ] Email forwarding to onepixcce@gmail.com tested.
- [ ] Privacy Policy and Terms reviewed by legal counsel.
- [ ] Form submissions tested end-to-end.
- [ ] Mobile responsiveness verified on all breakpoints.
- [ ] Page performance checked (Lighthouse audit).
- [ ] Accessibility audit run (WCAG 2.1 AA).
- [ ] Production server uptime monitoring enabled.

## Post-Launch

- Monitor error logs daily for first week.
- Test booking form weekly.
- Review analytics and conversion data.
- Update sitemaps periodically.
