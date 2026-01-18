# ✅ Import Paths Fixed!

## 🐛 Lỗi Đã Fix

**Error:**
```
Module not found: Can't resolve '../../services/category.service'
```

**Nguyên nhân:**
- Import path sai trong `CategorySidebar.tsx`
- File services nằm trong `lib/services/` chứ không phải `services/`

**Đã sửa:**
```typescript
// ❌ SAI
import { categoryService } from "../../services/category.service";

// ✅ ĐÚNG
import { categoryService } from "../../../lib/services/category.service";
```

---

## 📁 Cấu Trúc Đúng

```
device-web/
├── lib/
│   └── services/              ← Services ở đây!
│       ├── auth.service.ts
│       ├── category.service.ts
│       ├── product.service.ts
│       ├── order.service.ts
│       └── upload.service.ts
│
└── app/
    └── common/
        └── components/
            └── CategorySidebar.tsx  ← Import từ ../../../lib/services/
```

---

## ✅ Tất Cả Import Paths Đúng

### From `app/` (root level)
```typescript
// app/page.tsx
import { productService } from "../lib/services/product.service";
```

### From `app/checkout/`
```typescript
// app/checkout/page.tsx
import { orderService } from "../../lib/services/order.service";
import { uploadService } from "../../lib/services/upload.service";
```

### From `app/products/`
```typescript
// app/products/page.tsx
import { productService } from "../../lib/services/product.service";
import { categoryService } from "../../lib/services/category.service";
```

### From `app/products/[slug]/`
```typescript
// app/products/[slug]/page.tsx
import { productService } from "../../../lib/services/product.service";
import { uploadService } from "../../../lib/services/upload.service";
```

### From `app/admin/categories/`
```typescript
// app/admin/categories/page.tsx
import { categoryService } from "../../../lib/services/category.service";
```

### From `app/admin/products/`
```typescript
// app/admin/products/page.tsx
import { productService } from "../../../lib/services/product.service";
import { categoryService } from "../../../lib/services/category.service";
import { uploadService } from "../../../lib/services/upload.service";
```

### From `app/common/components/`
```typescript
// app/common/components/CategorySidebar.tsx
import { categoryService } from "../../../lib/services/category.service";

// app/common/components/Products.tsx
import { productService } from "../../../lib/services/product.service";
import { uploadService } from "../../../lib/services/upload.service";

// app/common/components/ProductsSection.tsx
import { uploadService } from "../../../lib/services/upload.service";
```

### From `app/common/contexts/`
```typescript
// app/common/contexts/AdminAuthContext.tsx
import { authService } from "../../../lib/services/auth.service";
```

---

## 🔧 Quy Tắc Import Path

**Từ folder `app/`:**
- Lên 1 level: `../lib/services/xxx.service`

**Từ folder `app/xxx/`:**
- Lên 2 levels: `../../lib/services/xxx.service`

**Từ folder `app/xxx/yyy/`:**
- Lên 3 levels: `../../../lib/services/xxx.service`

**Từ folder `app/common/components/` hoặc `app/common/contexts/`:**
- Lên 3 levels: `../../../lib/services/xxx.service`

---

## ✅ Verified - Tất Cả Đúng

Đã kiểm tra toàn bộ imports:
- ✅ app/page.tsx
- ✅ app/checkout/page.tsx
- ✅ app/products/page.tsx
- ✅ app/products/[slug]/page.tsx
- ✅ app/admin/login/page.tsx
- ✅ app/admin/categories/page.tsx
- ✅ app/admin/products/page.tsx
- ✅ app/admin/orders/page.tsx
- ✅ app/common/components/CategorySidebar.tsx ← **Fixed!**
- ✅ app/common/components/Products.tsx
- ✅ app/common/components/ProductsSection.tsx
- ✅ app/common/contexts/AdminAuthContext.tsx

---

## 🚀 Test Ngay

```bash
cd device-web
npm run dev
```

Mở: http://localhost:3000

**Lỗi đã được fix! ✅**

---

*Updated: 2024*
*All import paths verified and working!*

