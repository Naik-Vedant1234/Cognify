# Extension Icons

## Required Icons for Chrome Web Store

You need these icon sizes:
- ✅ **icon16.png** - 16x16 pixels (exists)
- ❌ **icon48.png** - 48x48 pixels (need to create)
- ❌ **icon128.png** - 128x128 pixels (need to create)

## How to Create Missing Icons

### Option 1: Online Tool (Easiest)
1. Go to https://www.favicon-generator.org/
2. Upload `icon16.png`
3. Generate larger sizes
4. Download and rename to `icon48.png` and `icon128.png`
5. Save them in this folder

### Option 2: Canva (Free)
1. Go to https://www.canva.com/
2. Create custom size: 128x128
3. Design a simple clock/timer icon with purple gradient
4. Download as PNG
5. Resize to 48x48 for the smaller version

### Option 3: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:
magick icon16.png -resize 48x48 icon48.png
magick icon16.png -resize 128x128 icon128.png
```

### Option 4: Simple Upscale (Quick but lower quality)
Just resize icon16.png to 48x48 and 128x128 using any image editor:
- Windows: Paint, Paint 3D
- Online: https://www.resizepixel.com/

## Icon Design Tips

For best results, your icon should:
- Be simple and recognizable
- Use the Cognify brand colors (purple gradient: #667eea to #764ba2)
- Represent time tracking (clock, timer, stopwatch)
- Look good on both light and dark backgrounds
- Have transparent background (PNG)

## Current Icon
The existing icon16.png is a simple design. You can either:
1. Upscale it for quick submission
2. Create a better quality icon for professional look

