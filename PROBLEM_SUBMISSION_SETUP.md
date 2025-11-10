# Problem Submission Feature - Setup Guide

## 📋 Overview

A complete problem submission system has been implemented for your LeetCode-like coding platform. This feature allows authenticated users to submit new coding problems with rich text descriptions, examples with optional images, and test cases.

---

## 🗂️ Files Created

### **Components** (`src/components/common/`)
- ✅ `FormInput.tsx` - Reusable text input with label and error handling
- ✅ `SelectInput.tsx` - Dropdown select component
- ✅ `TextArea.tsx` - Multi-line text input component
- ✅ `RichTextEditor.tsx` - Simple rich text editor with formatting toolbar
- ✅ `ImageUploader.tsx` - Image upload component with Cloudinary integration
- ✅ `DynamicExampleSection.tsx` - Dynamic form section for problem examples
- ✅ `DynamicTestCaseSection.tsx` - Dynamic form section for test cases
- ✅ `index.ts` - Barrel export for all common components

### **Pages** (`src/pages/`)
- ✅ `ProblemSubmissionPage.tsx` - Main problem submission page with complete form

### **API** (`src/api/`)
- ✅ `problems.ts` - API utilities for problem submission and retrieval

### **Types** (`src/types/`)
- ✅ Updated `index.ts` with `Example`, `TestCase`, and `ProblemFormData` interfaces

### **Routing**
- ✅ Updated `App.tsx` with `/submit-problem` route
- ✅ Updated `src/pages/index.ts` to export `ProblemSubmissionPage`

---

## 🔧 Required Setup

### 1. **Cloudinary Configuration**

The `ImageUploader` component needs Cloudinary credentials. Update the following in:

**File:** `src/components/common/ImageUploader.tsx`

```typescript
// Line 24-25: Replace with your Cloudinary details
formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace this
const response = await fetch(
  `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, // Replace YOUR_CLOUD_NAME
  // ...
);
```

#### How to get Cloudinary credentials:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** → **Upload** → **Upload presets**
3. Create an **unsigned upload preset** (or use `ml_default`)
4. Note your **Cloud Name** from the dashboard
5. Replace the placeholders in `ImageUploader.tsx`

**Alternative:** Create a `.env` file and use environment variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Then update the component:

```typescript
formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
const response = await fetch(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
  // ...
);
```

---

### 2. **Backend API Endpoint**

Ensure your backend has the following endpoint:

**Endpoint:** `POST /api/problems`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```typescript
{
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
    image?: string;
  }>;
  test_cases: Array<{
    input: string;
    expected_output: string;
  }>;
  tags: string[];
  time_limit: number;
  memory_limit: number;
}
```

**Expected Response:**
```typescript
{
  success: boolean;
  message: string;
  id?: number; // or problemId
}
```

---

## 🎨 Features Implemented

### ✅ Form Fields
- **Title** - Text input
- **Difficulty** - Dropdown (Easy, Medium, Hard)
- **Description** - Rich text editor with formatting
- **Constraints** - Textarea
- **Examples** - Dynamic section with add/remove
  - Input, Output, Explanation (optional)
  - Image upload (optional) via Cloudinary
- **Test Cases** - Dynamic section with add/remove
  - Input and Expected Output
- **Tags** - Comma-separated input
- **Time Limit** - Number input (default: 1s)
- **Memory Limit** - Number input (default: 128MB)

### ✅ Validation
- All required fields validated before submission
- Real-time error display
- Toast notifications for success/error states

### ✅ UX Features
- Loading states during submission
- Image preview before upload
- Progress indicators
- Responsive design with TailwindCSS
- Clean, dark-themed UI matching existing design
- Form reset after successful submission
- Auto-navigation to problem detail page

---

## 🚀 Usage

### Access the Page

Navigate to `/submit-problem` when logged in:

```typescript
// In your navigation/menu component
<Link to="/submit-problem">Submit Problem</Link>

// Or programmatically
navigate('/submit-problem');
```

### Example Navigation Button

Add this to your `Navbar.tsx` or `Dashboard.tsx`:

```tsx
import { Plus } from 'lucide-react';

<button
  onClick={() => navigate('/submit-problem')}
  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
>
  <Plus className="w-5 h-5" />
  Submit Problem
</button>
```

---

## 📝 Code Quality

### TypeScript
- ✅ Full type safety with interfaces
- ✅ Proper type annotations
- ✅ No `any` types (except in error handling)

### React Best Practices
- ✅ Functional components with hooks
- ✅ Controlled form inputs
- ✅ Proper state management
- ✅ Component composition
- ✅ Reusable components

### Styling
- ✅ TailwindCSS utility classes
- ✅ Consistent with existing design system
- ✅ Responsive layout
- ✅ Dark theme matching platform

---

## 🔒 Security Notes

1. **Authentication Required** - Page checks for `authUser.token`
2. **JWT Token** - Sent in Authorization header
3. **Image Upload** - Validates file type and size (max 5MB)
4. **Input Sanitization** - Backend should sanitize HTML in description

---

## 🧪 Testing Checklist

- [ ] Form validation works for all required fields
- [ ] Examples can be added/removed dynamically
- [ ] Test cases can be added/removed dynamically
- [ ] Image upload to Cloudinary works
- [ ] Image preview displays correctly
- [ ] Form submits successfully to backend
- [ ] Success toast appears on submission
- [ ] Error handling works for API failures
- [ ] Navigation works after submission
- [ ] Form resets after successful submission
- [ ] Responsive design works on mobile/tablet
- [ ] Authentication check redirects to login if needed

---

## 🐛 Troubleshooting

### Issue: Image upload fails
**Solution:** Check Cloudinary credentials in `ImageUploader.tsx`

### Issue: API submission fails
**Solution:** Verify backend endpoint is running and accepts the request format

### Issue: TypeScript errors
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Styling looks broken
**Solution:** Ensure TailwindCSS is properly configured and running

---

## 📚 Next Steps

1. **Configure Cloudinary** credentials
2. **Test the backend** API endpoint
3. **Add navigation link** to the submission page
4. **Customize styling** if needed
5. **Add additional validation** rules as required
6. **Implement backend** problem controller if not done

---

## 🎯 Backend Implementation Reference

If you need to implement the backend endpoint, here's a basic structure:

```typescript
// Example Express.js controller
router.post('/problems', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      constraints,
      examples,
      test_cases,
      tags,
      time_limit,
      memory_limit,
    } = req.body;

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        constraints,
        examples, // JSON field
        test_cases, // JSON field
        tags,
        time_limit,
        memory_limit,
        created_by: req.user.id, // From JWT token
      },
    });

    res.json({
      success: true,
      message: 'Problem created successfully!',
      id: problem.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message,
    });
  }
});
```

---

## ✨ Summary

The problem submission system is fully implemented and ready to use. Just configure Cloudinary credentials and ensure your backend API is ready to receive submissions. The feature includes comprehensive validation, error handling, and a polished user experience matching your platform's design.
