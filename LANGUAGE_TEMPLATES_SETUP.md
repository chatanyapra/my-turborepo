# Language-Specific Code Templates Feature

## Overview
This feature allows admins to add language-specific wrapper and boilerplate code for each problem. The system supports Java, Python, C++, and JavaScript.

## Database Schema

### ProblemCode Model
```prisma
model ProblemCode {
  id                Int       @id @default(autoincrement())
  problem_id        Int
  language          String    @db.VarChar(50)
  wrapper_code      String    @db.Text
  boilerplate_code  String    @db.Text
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  problem           Problem   @relation(fields: [problem_id], references: [id], onDelete: Cascade)

  @@unique([problem_id, language])
}
```

## Setup Instructions

### 1. Install Dependencies

First, install Monaco Editor for the frontend:

```bash
cd apps/client
npm install @monaco-editor/react
```

### 2. Run Prisma Migration

Generate and apply the database migration:

```bash
cd apps/server
npx prisma migrate dev --name add_problem_code_model
npx prisma generate
```

This will:
- Create the `ProblemCode` table in your database
- Add the relation to the `Problem` table
- Generate the Prisma client with the new model

### 3. Rebuild the Project

```bash
cd ../..
npx turbo run build
```

### 4. Start the Development Servers

```bash
npx turbo run dev
```

## API Endpoints

### Problem Code Management

#### Create/Update Code (Upsert)
```
POST /api/problem-codes/upsert
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "problemId": 1,
  "language": "java",
  "wrapperCode": "...",
  "boilerplateCode": "..."
}
```

#### Get Code by Language
```
GET /api/problem-codes/:problemId/:language
```

#### Get All Codes for a Problem
```
GET /api/problem-codes/:problemId
```

#### Delete Code
```
DELETE /api/problem-codes/:problemId/:language
Authorization: Bearer <admin_token>
```

## Frontend Components

### LanguageCodeSection
Main component that manages code templates for all languages.

**Props:**
- `problemId: number | null` - The problem ID (null for new problems)
- `token: string` - Admin authentication token

**Features:**
- Language selector dropdown
- Monaco Editor for wrapper and boilerplate code
- Auto-save functionality
- Default code templates for each language
- Unsaved changes indicator

### CodeEditor
Reusable Monaco Editor wrapper component.

**Props:**
- `value: string` - Current code value
- `onChange: (value: string) => void` - Change handler
- `language: string` - Programming language
- `height?: string` - Editor height (default: '300px')
- `readOnly?: boolean` - Read-only mode

### LanguageSelector
Dropdown for selecting programming languages.

**Supported Languages:**
- Java
- Python
- C++
- JavaScript

## Usage

### For Admins - Creating a Problem

1. Navigate to `/submit-problem`
2. Fill in the problem details (title, description, examples, etc.)
3. Click "Submit Problem"
4. After submission, the **Language Wrappers & Boilerplate Code** section appears
5. Select a language from the dropdown
6. Add wrapper code (test execution logic)
7. Add boilerplate code (starter code for users)
8. Click "Save Code"
9. Repeat for other languages
10. Click "View Problem" to see the created problem

### For Admins - Editing a Problem

1. Navigate to a problem detail page
2. Click "Edit Problem" (admin only)
3. Update problem details if needed
4. Scroll down to the **Language Wrappers & Boilerplate Code** section
5. Select a language and modify the code
6. Click "Save Code"

## Default Code Templates

### Java
**Boilerplate:**
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}
```

**Wrapper:**
```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test case execution logic here
    }
}
```

### Python
**Boilerplate:**
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass
```

**Wrapper:**
```python
from typing import List

# Test case execution logic here
if __name__ == "__main__":
    sol = Solution()
    # Add test execution
```

### C++
**Boilerplate:**
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};
```

**Wrapper:**
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    Solution sol;
    // Test case execution logic here
    return 0;
}
```

### JavaScript
**Boilerplate:**
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
};
```

**Wrapper:**
```javascript
// Test case execution logic here
const result = twoSum([2,7,11,15], 9);
console.log(result);
```

## Backend Structure

### Files Created/Modified

**New Files:**
- `apps/server/src/services/problemCode.service.ts`
- `apps/server/src/controllers/problemCode.controller.ts`
- `apps/server/src/routes/problemCode.routes.ts`
- `apps/client/src/api/problemCodes.ts`
- `apps/client/src/components/problem/CodeEditor.tsx`
- `apps/client/src/components/problem/LanguageCodeSection.tsx`

**Modified Files:**
- `apps/server/prisma/schema.prisma`
- `apps/server/src/types/index.ts`
- `apps/server/src/validators/index.ts`
- `apps/server/src/index.ts`
- `apps/client/src/components/problem/index.ts`
- `apps/client/src/pages/ProblemSubmissionPage.tsx`
- `apps/client/src/pages/ProblemEditPage.tsx`

## Security

- All create/update/delete operations require admin authentication
- JWT token validation on all protected routes
- `requireAdmin` middleware enforces admin-only access
- Frontend checks prevent non-admins from seeing edit options

## Features

✅ Language-specific code templates  
✅ Monaco Editor with syntax highlighting  
✅ Auto-save with unsaved changes indicator  
✅ Default templates for all languages  
✅ Upsert functionality (create or update)  
✅ Admin-only access control  
✅ Seamless integration with problem creation/editing  
✅ Responsive UI with Tailwind CSS  

## Testing

### Test the Feature

1. **Login as Admin**
   - Ensure your user has `role: 'admin'` in the database

2. **Create a New Problem**
   - Go to `/submit-problem`
   - Fill in all required fields
   - Submit the problem
   - Add code templates for each language

3. **Edit Existing Problem**
   - Navigate to any problem
   - Click "Edit Problem"
   - Modify code templates
   - Save changes

4. **Verify API**
   ```bash
   # Get code for a language
   curl http://localhost:3000/api/problem-codes/1/java
   
   # Get all codes for a problem
   curl http://localhost:3000/api/problem-codes/1
   ```

## Troubleshooting

### Prisma Errors
If you see "Property 'problemCode' does not exist" errors:
```bash
cd apps/server
npx prisma generate
npx turbo run build
```

### Monaco Editor Not Loading
Ensure `@monaco-editor/react` is installed:
```bash
cd apps/client
npm install @monaco-editor/react
```

### Admin Access Issues
Check that:
1. User has `role: 'admin'` in database
2. JWT token includes the role field
3. `requireAdmin` middleware is applied to routes

## Future Enhancements

- [ ] Code validation before saving
- [ ] Test case execution preview
- [ ] Import/export code templates
- [ ] Version history for code templates
- [ ] Support for more languages
- [ ] Code formatting and linting
- [ ] Template library/marketplace

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.
