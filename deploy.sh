#!/bin/bash
# Production Deployment Script for Blackline Espresso Tech
# Run this on your production server after uploading files

set -e  # Exit on error

echo "🚀 Starting Blackline Espresso Tech Production Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="blacklineespresso.com"
ROOT_DIR="/home/user/public_html"  # Update to your actual root
WEB3_ACCESS_KEY="${WEB3_ACCESS_KEY:?ERROR: WEB3_ACCESS_KEY environment variable not set}"

echo -e "${YELLOW}Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Root: $ROOT_DIR"
echo "Web3Forms Access Key: [HIDDEN]"
echo ""

# 1. Verify file structure
echo -e "${YELLOW}1. Verifying file structure...${NC}"
required_files=(
    "index.html"
    "privacy-policy.html"
    "terms-of-service.html"
    "sitemap.xml"
    "robots.txt"
    "assets/css/style.css"
    "assets/js/script.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$ROOT_DIR/$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING!)"
        exit 1
    fi
done

# 2. Set correct permissions
echo -e "${YELLOW}2. Setting file permissions...${NC}"
chmod -R 755 "$ROOT_DIR"
chmod -R 644 "$ROOT_DIR"/*.html
chmod -R 644 "$ROOT_DIR"/assets/css/*.css
chmod -R 644 "$ROOT_DIR"/assets/js/*.js
echo -e "${GREEN}✓${NC} Permissions set"

# 3. Verify HTTPS configuration
echo -e "${YELLOW}3. Checking HTTPS configuration...${NC}"
if [ -f /etc/nginx/sites-enabled/$DOMAIN ] || [ -f /etc/apache2/sites-enabled/$DOMAIN.conf ]; then
    echo -e "${GREEN}✓${NC} Web server configuration found"
else
    echo -e "${RED}⚠${NC} Web server configuration not found (may be configured elsewhere)"
fi

# 4. Test critical pages return 200
echo -e "${YELLOW}4. Testing page availability...${NC}"
pages=(
    "https://$DOMAIN/"
    "https://$DOMAIN/privacy-policy.html"
    "https://$DOMAIN/terms-of-service.html"
    "https://$DOMAIN/sitemap.xml"
)

for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$page" 2>/dev/null || echo "000")
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓${NC} $page ($status)"
    else
        echo -e "${YELLOW}⚠${NC} $page ($status) - May need SSL setup"
    fi
done

# 5. Create log directory
echo -e "${YELLOW}5. Creating log directory...${NC}"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"
echo -e "${GREEN}✓${NC} Logs directory ready at $LOG_DIR"

# 6. Verify Web3Forms API key
echo -e "${YELLOW}6. Testing Web3Forms API key...${NC}"
if [ ! -z "$WEB3_ACCESS_KEY" ]; then
    echo -e "${GREEN}✓${NC} Web3Forms access key configured"
else
    echo -e "${RED}✗${NC} Web3Forms access key not set"
    exit 1
fi

# 7. Summary and next steps
echo ""
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify email forwarding to onepixcce@gmail.com is configured"
echo "2. Test the booking form on https://$DOMAIN"
echo "3. Check submission arrives at support email"
echo "4. Submit sitemap to Google Search Console"
echo "5. Create/verify Google Business Profile"
echo "6. Set up uptime monitoring (Pingdom, Uptime Robot, etc.)"
echo ""
echo -e "${YELLOW}Monitor these files for issues:${NC}"
echo "- $LOG_DIR/access.log (page requests)"
echo "- $LOG_DIR/error.log (server errors)"
echo ""
echo "Need help? Check PRODUCTION_CHECKLIST.md and PRODUCTION_DEPLOY.md"
