# Cloudinary Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Get Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a **free account** (no credit card required)
3. Verify your email

### Step 2: Get Your Cloud Name

1. After login, you'll see your **Dashboard**
2. Find your **Cloud Name** (looks like: `demo-cloud-xyz`)
3. Copy it - you'll need this!

### Step 3: Create Upload Preset

1. Go to **Settings** (gear icon) → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `problem_images` (or any name you like)
   - **Signing Mode**: Select **Unsigned** ⚠️ IMPORTANT
   - **Folder**: `leetcode-problems` (optional, for organization)
5. Click **Save**
6. Copy the preset name

### Step 4: Configure Your App

Create a `.env` file in `apps/client/` directory:

```bash
# apps/client/.env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=problem_images
```

**Example:**
```bash
VITE_CLOUDINARY_CLOUD_NAME=demo-cloud-xyz
VITE_CLOUDINARY_UPLOAD_PRESET=problem_images
```

### Step 5: Restart Dev Server

```bash
# Stop your dev server (Ctrl+C)
# Start it again
npm run dev
```

---

## ✅ Verification

Test image upload:
1. Navigate to `/submit-problem`
2. Scroll to Examples section
3. Click "Click to upload image"
4. Select an image
5. Should see upload progress and preview

---

## 🔒 Security Notes

### Why "Unsigned" Mode?

- ✅ Allows direct uploads from browser
- ✅ No server-side signature needed
- ✅ Perfect for user-generated content
- ✅ Can still set restrictions (file size, format)

### Recommended Settings

In your upload preset, configure:

- **Max file size**: 5 MB
- **Allowed formats**: jpg, png, gif, webp
- **Folder**: `leetcode-problems` (keeps uploads organized)
- **Transformation**: Optional (resize, optimize)

---

## 📊 Free Tier Limits

Cloudinary free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Unlimited transformations
- ✅ More than enough for development!

---

## 🐛 Troubleshooting

### Issue: "Upload failed" error

**Check:**
1. Cloud name is correct in `.env`
2. Upload preset name matches exactly
3. Upload preset is set to **Unsigned**
4. Dev server was restarted after adding `.env`

### Issue: Image not showing

**Check:**
1. Browser console for errors
2. Network tab shows successful upload (200 status)
3. Cloudinary dashboard shows the uploaded image

### Issue: Environment variables not working

**Solution:**
```bash
# Make sure file is named exactly: .env
# Make sure it's in: apps/client/.env
# Restart dev server after changes
```

---

## 🎨 Advanced: Image Transformations

Cloudinary can automatically optimize images:

```typescript
// In ImageUploader.tsx, modify the upload:
formData.append('transformation', JSON.stringify({
  width: 800,
  height: 600,
  crop: 'limit',
  quality: 'auto',
  fetch_format: 'auto'
}));
```

This will:
- Limit max dimensions to 800x600
- Auto-optimize quality
- Auto-select best format (WebP for supported browsers)

---

## 📚 Alternative: Manual Configuration

If you prefer not to use environment variables, directly edit:

**File:** `apps/client/src/components/common/ImageUploader.tsx`

```typescript
// Line 27-28
const cloudName = 'your-cloud-name'; // Replace this
const uploadPreset = 'your-preset-name'; // Replace this
```

---

## 🔗 Useful Links

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Upload Presets Docs](https://cloudinary.com/documentation/upload_presets)
- [Unsigned Upload Guide](https://cloudinary.com/documentation/upload_images#unsigned_upload)

---

## ✨ You're Done!

Once configured, image uploads will work seamlessly in your problem submission form. Users can upload example images that will be stored in Cloudinary and displayed in problem descriptions.

**Next:** Test the feature by submitting a problem with images!
