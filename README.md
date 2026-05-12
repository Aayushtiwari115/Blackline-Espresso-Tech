# Blackline Espresso Tech - Website Files

## Quick Start

### Run Locally

```bash
python3 -m http.server 8001
```

Then open: http://localhost:8001

### Files

- `index.html` - Main landing page
- `assets/css/style.css` - All styling
- `assets/js/script.js` - Form handling & interactions
- `sitemap.xml` - Search engine sitemap (15 pages)
- `assets/videos/blackline_Espresso_tech.mp4` - Original background/hero video
- `assets/videos/blackline_Espresso_tech_small.mp4` - Lighter/trimmed mp4 (used as fallback)
- `assets/videos/blackline_Espresso_tech.webm` - WebM copy for better compression/support
- `assets/images/poster.svg` - Poster/fallback image for hero

Optimizing the video (run locally using ffmpeg):

```bash
# Trim to first 12 seconds and create a lighter mp4
ffmpeg -i blackline_Espresso_tech.mp4 -ss 0 -t 12 -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 96k blackline_Espresso_tech_small.mp4

# Create a webm copy for better compression
ffmpeg -i blackline_Espresso_tech_small.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -c:a libopus blackline_Espresso_tech.webm
```

Place the produced `blackline_Espresso_tech_small.mp4` and `blackline_Espresso_tech.webm` in `assets/videos/`. The site will serve the best available source and use `assets/images/poster.svg` as a fallback image.

- `robots.txt` - Crawler configuration

### Location Pages (15 total)

All location pages follow the same structure with location-specific SEO:

**North Darwin (0810):** Casuarina, Nightcliff, Tiwi, Nakara
**South Darwin (0830):** Palmerston, Durack
**East Darwin (0820):** Fannie Bay, Winnellie, Larrakeyah
**Inner Suburbs (0812):** Malak, Leanyer, Marrara
**Outer Suburbs:** Howard Springs (0835), Zuccoli (0821)

### Form Integration

- Forms submit to Web3Forms API
- Receives bookings at: onepixcce@gmail.com
- Access key stored in .env.local (for reference only)

### SEO Features

✓ LocalBusiness schema markup
✓ Service area schema
✓ Location-specific titles & meta tags
✓ Canonical URLs
✓ Mobile responsive design
✓ Sitemap for search engines

### Australian Pre-Production Checklist

- Privacy Policy is published and linked sitewide.
- Terms of Service is published and linked sitewide.
- Booking form requires privacy consent before submission.
- Business contact details are accurate (phone, email, service locations).
- Google Business Profile and Search Console are configured.
- Keep records of customer consent and enquiry submissions.

### Next Steps

1. Deploy to live domain (blacklineespresso.com)
2. Create Google Business Profile
3. Submit sitemap to Google Search Console
4. Test booking form

### Color Theme

- Background: #ffffff (white)
- Primary: #000000 (black)
- Accent borders: #e0e0e0
- Text: #000000 / #666666

### Customization

All colors, text, and contact info can be easily updated in:

- `index.html` - Main content
- `assets/css/style.css` - Colors and layout
- Location pages - Add new suburbs by copying pattern
