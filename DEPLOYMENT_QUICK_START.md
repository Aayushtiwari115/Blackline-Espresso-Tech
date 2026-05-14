# Quick Start: Deploy Blackline Espresso Tech to Production

**Estimated Time**: 2-3 hours  
**Difficulty**: Beginner-friendly (with guidance)

---

## Pre-Flight Checklist (15 minutes)

Before you start, ensure you have:

```
✓ Hosting account with SSH/SFTP access
✓ Domain registered and DNS configured
✓ SSL certificate ready (or plan to use Let's Encrypt)
✓ Email forwarding configured for onepixcce@gmail.com
✓ All files downloaded locally
```

**If missing any**: Contact your hosting provider first.

---

## Step 1: Upload Files to Server (15 minutes)

### Option A: Using SFTP (Easier)

1. Download FileZilla or WinSCP (free)
2. Connect to your server with SSH credentials
3. Navigate to `/public_html` or root directory
4. Drag & drop all files from your computer

### Option B: Using Terminal (Advanced)

```bash
# Upload everything
scp -r ./* user@blacklineespresso.com:/home/user/public_html/

# Or via rsync (faster for large files)
rsync -avz ./ user@blacklineespresso.com:/home/user/public_html/
```

### Verify Upload

```bash
ssh user@blacklineespresso.com
ls -la /home/user/public_html/
# You should see: index.html, assets/, robots.txt, sitemap.xml, etc.
```

---

## Step 2: Configure HTTPS/SSL (30 minutes)

### Option A: Let's Encrypt (Free, Recommended)

```bash
# SSH into your server
ssh user@blacklineespresso.com

# Install Certbot
sudo apt-get install certbot python3-certbot-nginx  # For nginx
# OR
sudo apt-get install certbot python3-certbot-apache  # For Apache

# Get certificate (Let's Encrypt)
sudo certbot certonly --webroot -w /home/user/public_html \
  -d blacklineespresso.com -d www.blacklineespresso.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Option B: Hosting Control Panel

1. Log into cPanel/Plesk
2. Click "AutoSSL" or "SSL/TLS"
3. Click "Issue Certificate"
4. Select your domain
5. Wait 5-10 minutes for issuance

---

## Step 3: Redirect HTTP to HTTPS (10 minutes)

### Nginx Configuration

```nginx
# SSH into your server
ssh user@blacklineespresso.com
sudo nano /etc/nginx/sites-available/blacklineespresso.com

# Add this block:
server {
    listen 80;
    server_name blacklineespresso.com www.blacklineespresso.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name blacklineespresso.com www.blacklineespresso.com;

    ssl_certificate /etc/letsencrypt/live/blacklineespresso.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blacklineespresso.com/privkey.pem;

    root /home/user/public_html;
    index index.html;
}

# Test and reload
sudo nginx -t
sudo systemctl restart nginx
```

### Apache Configuration

```apache
# SSH into your server
ssh user@blacklineespresso.com
sudo nano /etc/apache2/sites-available/blacklineespresso.com.conf

# Add this block:
<VirtualHost *:80>
    ServerName blacklineespresso.com
    ServerAlias www.blacklineespresso.com
    Redirect 301 / https://blacklineespresso.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName blacklineespresso.com
    DocumentRoot /home/user/public_html

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/blacklineespresso.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/blacklineespresso.com/privkey.pem
</VirtualHost>

# Enable and reload
sudo a2enmod ssl
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### Using Hosting Control Panel

1. Log into cPanel/Plesk
2. Find "Redirects" or "URL Rewrite"
3. Redirect `http://blacklineespresso.com` → `https://blacklineespresso.com`

---

## Step 4: Add Security Headers (10 minutes)

### Nginx

```nginx
# Add to server block in /etc/nginx/sites-available/blacklineespresso.com
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://api.web3forms.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.web3forms.com; frame-ancestors 'none';";
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Reload
sudo nginx -t
sudo systemctl restart nginx
```

### Apache

```apache
# Add to VirtualHost block in /etc/apache2/sites-available/blacklineespresso.com.conf
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://api.web3forms.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.web3forms.com; frame-ancestors 'none';"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Enable and reload
sudo a2enmod headers
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### Using Hosting Control Panel

1. Log into cPanel/Plesk
2. Find "Custom Headers" or ".htaccess"
3. Paste the headers above

---

## Step 5: Configure Email Forwarding (10 minutes)

### cPanel

1. Log into cPanel
2. Go to "Email Routing" or "Forwarding"
3. Add forwarding rule:
   - **From**: noreply@blacklineespresso.com (or any address)
   - **To**: onepixcce@gmail.com
4. Click "Create"

### Plesk

1. Log into Plesk
2. Go to "Mail" → "Mailboxes"
3. Click "Create Mailbox"
4. Set up forwarding rule (same as above)

### Manual (If not in control panel)

```bash
# Create .forward file in home directory
ssh user@blacklineespresso.com
echo "onepixcce@gmail.com" > ~/.forward
chmod 644 ~/.forward
```

### Test Email Forwarding

```bash
# Send test email
echo "Test booking submission" | mail -s "Test" noreply@blacklineespresso.com

# Check a few minutes later that it arrives at onepixcce@gmail.com
```

---

## Step 6: Test Your Website (20 minutes)

### Basic Tests

```bash
# Test HTTPS (should be secure)
curl -I https://blacklineespresso.com

# Test redirect (should redirect to HTTPS)
curl -I http://blacklineespresso.com

# Check homepage loads
curl https://blacklineespresso.com | head -20
```

### Browser Tests

1. Visit https://blacklineespresso.com in your browser
2. Check for green lock 🔒 (HTTPS working)
3. Click "Book Now" button
4. Fill out and submit form
5. Check onepixcce@gmail.com for booking email (may take 1-2 min)

### Test All Pages

- [ ] https://blacklineespresso.com (main page)
- [ ] https://blacklineespresso.com/privacy-policy.html
- [ ] https://blacklineespresso.com/terms-of-service.html
- [ ] https://blacklineespresso.com/casuarina.html (any location page)

---

## Step 7: Submit to Google (30 minutes)

### Google Search Console

1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Enter: https://blacklineespresso.com
4. Choose verification method:
   - DNS (recommended): Add TXT record to domain
   - HTML file: Upload verification file
   - Meta tag: Add to HTML (already done if following instructions)
5. Wait 24-48 hours for verification
6. Submit sitemap: Go to "Sitemaps" → Add `/sitemap.xml`

### Google Business Profile

1. Go to https://business.google.com
2. Click "Manage your business"
3. Search for your business or create new
4. Add:
   - Business name: Blackline Espresso Tech
   - Phone: 0415244056
   - Service area: Darwin, NT (and specific suburbs)
   - Hours: Add business hours
   - Photos: Add store/logo photos (optional)
5. Verify via SMS or phone call

---

## Step 8: Monitor During First Week (Daily)

### Daily Checks (5 minutes)

```bash
# 1. Check server uptime
curl -I https://blacklineespresso.com

# 2. Check form works
# - Visit site in browser
# - Submit test form
# - Verify email arrives

# 3. Check logs for errors
ssh user@blacklineespresso.com
tail -f /var/log/nginx/error.log  # For nginx
# OR
tail -f /var/log/apache2/error.log  # For Apache

# 4. Monitor bookings
# - Check onepixcce@gmail.com for new submissions
# - Verify all form fields are captured correctly
```

### Weekly Review (After week 1)

- [ ] No critical errors in logs
- [ ] All form submissions received
- [ ] Page load time acceptable (< 3 seconds)
- [ ] Mobile responsiveness verified
- [ ] HTTPS working on all pages
- [ ] Email forwarding working reliably

---

## Troubleshooting

### HTTPS Not Working

```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew --force-renewal

# Check nginx/Apache config
sudo nginx -t          # For nginx
sudo apache2ctl -t     # For Apache
```

### Form Not Submitting

1. Check browser console (F12 > Console)
2. Verify HTTPS is enabled
3. Check Web3Forms API key is set (environment variable)
4. Test with simple curl request

### Email Not Arriving

1. Check spam/junk folder
2. Verify forwarding is configured
3. Check mail logs:
   ```bash
   tail -f /var/log/mail.log
   ```
4. Test with simple email:
   ```bash
   echo "Test" | mail -s "Test" onepixcce@gmail.com
   ```

### Page Not Loading

1. Check all files uploaded
2. Verify file permissions (644 for files, 755 for dirs):
   ```bash
   chmod -R 755 /home/user/public_html
   chmod -R 644 /home/user/public_html/*.html
   ```
3. Check web server config for syntax errors
4. Verify DNS is pointing to correct server IP

---

## Success Checklist

- [ ] Domain resolves to HTTPS
- [ ] Green lock 🔒 appears in browser
- [ ] Homepage loads quickly
- [ ] Form submits successfully
- [ ] Booking email arrives within 1-2 minutes
- [ ] All pages accessible (privacy, terms, locations)
- [ ] Mobile layout works on phone
- [ ] No JavaScript errors in console (F12)
- [ ] Google Search Console verification started
- [ ] Google Business Profile created
- [ ] Team monitoring email inbox

---

## Next Steps

1. **Week 1**: Monitor daily (logs, form submissions, uptime)
2. **Week 2-4**: Review weekly (analytics, performance)
3. **Month 2+**: Review monthly (trends, optimizations)
4. **Every 90 days**: Review security (update headers, rotate API keys)
5. **Annually**: Review compliance (Privacy Act updates, ACL changes)

---

## Need Help?

**Documentation**:

- Full deployment guide: [PRODUCTION_DEPLOY.md](PRODUCTION_DEPLOY.md)
- Pre-launch checklist: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
- Validation report: [PRODUCTION_VALIDATION_REPORT.md](PRODUCTION_VALIDATION_REPORT.md)

**Hosting Support**:

- Contact your hosting provider for server/SSL/email setup
- They can handle most of steps 1-4 if you prefer

**Security Questions**:

- Review [PRODUCTION_DEPLOY.md](PRODUCTION_DEPLOY.md) for details

---

**Ready to launch? Start at Step 1 above.** ✅
