# Quick Start Guide - Problem Submission Feature

## 🚀 Get Started in 5 Minutes

### **Step 1: Configure Frontend** (2 minutes)

Create `apps/client/.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Get Cloudinary credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name from dashboard
3. Create unsigned upload preset in Settings → Upload

See `CLOUDINARY_SETUP_GUIDE.md` for detailed instructions.

---

### **Step 2: Configure Backend** (2 minutes)

Create `apps/server/.env`:

```env
PORT=3000
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_secret_key_here

# Cloudinary (already configured)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=292153253423969
CLOUDINARY_API_SECRET=NKZ_AbcoJFMt6PYjQssEgT6LJPQ
```

---

### **Step 3: Start Servers** (1 minute)

```bash
# Terminal 1 - Backend
cd apps/server
npm run dev

# Terminal 2 - Frontend
cd apps/client
npm run dev
```

---

### **Step 4: Test the Feature**

1. **Login** to your app
2. **Click** "Submit Problem" button in navbar
3. **Fill out** the form
4. **Submit** and verify!

---

## 📋 What Was Built

### **Frontend** (`apps/client/`)
- ✅ 7 reusable components
- ✅ Problem submission page
- ✅ TinyMCE rich text editor
- ✅ Cloudinary image upload
- ✅ Form validation
- ✅ Toast notifications

### **Backend** (`apps/server/`)
- ✅ POST `/api/problems` endpoint
- ✅ JWT authentication
- ✅ Input validation
- ✅ Data transformation
- ✅ PostgreSQL storage

---

## 🔑 Key Features

✅ **Rich Text Editor** - TinyMCE with dark theme  
✅ **Image Upload** - Cloudinary integration  
✅ **Dynamic Sections** - Add/remove examples & test cases  
✅ **Authentication** - JWT protected endpoint  
✅ **Validation** - Frontend & backend validation  
✅ **Responsive Design** - Works on all devices  

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete feature overview
- **BACKEND_SETUP_GUIDE.md** - Backend integration details
- **CLOUDINARY_SETUP_GUIDE.md** - Cloudinary configuration
- **PROBLEM_SUBMISSION_SETUP.md** - Detailed setup guide

---

## 🐛 Common Issues

### Frontend: Image upload fails
→ Check Cloudinary credentials in `apps/client/.env`

### Backend: "User not authenticated"
→ Ensure you're logged in and JWT token is valid

### Backend: "JWT_SECRET is not defined"
→ Add JWT_SECRET to `apps/server/.env`

---

## 🎯 API Endpoint

```
POST http://localhost:3000/api/problems
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## ✅ Verification

Test that everything works:

1. ✅ Frontend dev server running
2. ✅ Backend dev server running
3. ✅ Can login to app
4. ✅ "Submit Problem" button visible
5. ✅ Form loads correctly
6. ✅ Can upload images
7. ✅ Can submit problem
8. ✅ Success toast appears

---

## 🎉 You're Ready!

The problem submission feature is fully functional. Users can now:

- Write rich problem descriptions
- Add examples with optional images
- Define test cases
- Submit to database
- View their submitted problems

**Need help?** Check the detailed documentation files listed above.

---

**Implementation Date:** November 9, 2025  
**Status:** ✅ Production Ready
