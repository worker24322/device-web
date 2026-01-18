# 🔌 API Integration Guide - Frontend

Hướng dẫn sử dụng API trong Device-Web (Next.js)

## ⚙️ Setup

### 1. API Configuration

File `.env.local` đã được tạo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Services Available

Các service đã được tạo sẵn trong `lib/services/`:

- `auth.service.ts` - Authentication
- `category.service.ts` - Categories management
- `product.service.ts` - Products management
- `order.service.ts` - Orders management

## 📚 API Services Usage

### Authentication Service

```typescript
import { authService } from '@/lib/services/auth.service';

// Login
const response = await authService.login({
  email: 'admin@device-shop.com',
  password: 'admin123456'
});

if (response.success) {
  // Token automatically saved to localStorage
  console.log('User:', response.data.user);
  console.log('Token:', response.data.token);
}

// Logout
authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();
```

### Category Service

```typescript
import { categoryService } from '@/lib/services/category.service';

// Get all categories
const response = await categoryService.getAll();
const categories = response.data; // Array of Category

// Get by ID
const category = await categoryService.getById(1);

// Get by slug
const category = await categoryService.getBySlug('camera-an-ninh');

// Create (requires auth)
const newCategory = await categoryService.create({
  name: 'Camera An Ninh',
  slug: 'camera-an-ninh',
  description: 'Các sản phẩm camera'
});

// Update (requires auth)
const updated = await categoryService.update(1, {
  name: 'Camera An Ninh Updated',
  slug: 'camera-an-ninh',
  description: 'Updated description'
});

// Delete (requires auth)
await categoryService.delete(1);
```

### Product Service

```typescript
import { productService } from '@/lib/services/product.service';

// Get all products
const response = await productService.getAll();
const products = response.data;

// Filter by category
const cameraProducts = await productService.getAll(1); // category_id = 1

// Filter by status
const activeProducts = await productService.getAll(undefined, 'active');

// Get by ID
const product = await productService.getById(1);

// Get by slug
const product = await productService.getBySlug('camera-wifi-4k');

// Create (requires auth)
const newProduct = await productService.create({
  name: 'Camera Wifi 4K',
  slug: 'camera-wifi-4k',
  description: 'Camera IP Wifi',
  price: 1200000,
  original_price: 1500000,
  category_id: 1,
  stock: 45,
  status: 'active',
  image: '/images/banner.webp'
});

// Update (requires auth)
const updated = await productService.update(1, {
  name: 'Camera Wifi 4K Updated',
  slug: 'camera-wifi-4k',
  description: 'Updated',
  price: 1100000,
  category_id: 1,
  stock: 50,
  status: 'active',
  image: '/images/banner.webp'
});

// Delete (requires auth)
await productService.delete(1);
```

### Order Service

```typescript
import { orderService } from '@/lib/services/order.service';

// Create order (checkout - public)
const newOrder = await orderService.create({
  customer_name: 'Nguyễn Văn A',
  customer_phone: '0912345678',
  customer_email: 'nguyenvana@email.com',
  customer_address: '123 ABC, Q1, HCM',
  payment_method: 'COD',
  note: 'Giao buổi chiều',
  items: [
    {
      product_id: 1,
      product_name: 'Camera Wifi 4K',
      product_price: 1200000,
      quantity: 2
    },
    {
      product_id: 2,
      product_name: 'Thiết bị báo động',
      product_price: 850000,
      quantity: 1
    }
  ]
});

// Get all orders (requires auth - admin only)
const response = await orderService.getAll();
const orders = response.data;

// Filter by status
const pendingOrders = await orderService.getAll('pending');

// Get by ID
const order = await orderService.getById(1);

// Update status (requires auth)
await orderService.updateStatus(1, 'completed');

// Delete (requires auth)
await orderService.delete(1);
```

## 🎯 Component Examples

### Login Component

```typescript
'use client';

import { useState } from 'react';
import { authService } from '@/lib/services/auth.service';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await authService.login({ email, password });
    
    if (response.success) {
      // Redirect to dashboard
      window.location.href = '/admin/dashboard';
    } else {
      alert(response.message);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Products List Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/lib/services/product.service';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await productService.getAll();
    if (response.success) {
      setProducts(response.data);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: {product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Checkout Component

```typescript
'use client';

import { useState } from 'react';
import { orderService } from '@/lib/services/order.service';
import { useCart } from '@/app/common/contexts/CartContext';

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleCheckout = async () => {
    const response = await orderService.create({
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      customer_address: customerInfo.address,
      payment_method: 'COD',
      items: items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      })),
    });

    if (response.success) {
      alert('Đặt hàng thành công! Mã đơn: ' + response.data.order_number);
      clearCart();
      // Redirect to success page
    } else {
      alert(response.message);
    }
  };

  return (
    <form>
      {/* Form fields */}
      <button onClick={handleCheckout}>Đặt hàng</button>
    </form>
  );
}
```

## 📡 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## 🔐 Authentication

### Protected Requests

Services automatically add Authorization header when `requiresAuth = true`:

```typescript
// This will include: Authorization: Bearer {token}
await categoryService.create(data); // Auto protected
```

### Manual Auth Header

```typescript
const token = authService.getToken();

fetch('http://localhost:8080/api/products', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});
```

## ✅ Pages Updated

### Admin Pages (đã update để dùng API):

- ✅ `/admin/login/page.tsx` - Sử dụng authService.login()
- ✅ `/admin/categories/page.tsx` - CRUD categories qua API
- ✅ `/admin/products/page.tsx` - CRUD products qua API  
- ✅ `/admin/orders/page.tsx` - Quản lý orders qua API
- ✅ `AdminAuthContext.tsx` - Dùng API thật

### Pages Cần Update (TODO):

- ⏳ `/checkout/page.tsx` - Tạo order khi checkout
- ⏳ `/products/page.tsx` - Hiển thị products từ API
- ⏳ `/products/[slug]/page.tsx` - Product detail từ API
- ⏳ `common/components/Products.tsx` - Load products từ API
- ⏳ `common/components/CategorySidebar.tsx` - Load categories từ API

## 🧪 Testing

### Test Login

```typescript
// In browser console or component
import { authService } from '@/lib/services/auth.service';

const result = await authService.login({
  email: 'admin@device-shop.com',
  password: 'admin123456'
});

console.log(result);
```

### Test Categories

```typescript
import { categoryService } from '@/lib/services/category.service';

const categories = await categoryService.getAll();
console.log(categories.data);
```

## 🔧 Common Patterns

### With Loading State

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await productService.create(data);
    if (response.success) {
      message.success('Success!');
    }
  } finally {
    setLoading(false);
  }
};
```

### With Error Handling

```typescript
try {
  const response = await orderService.create(orderData);
  
  if (!response.success) {
    message.error(response.message);
    return;
  }
  
  // Success
  message.success('Order created!');
} catch (error) {
  message.error('Network error');
}
```

### With SWR (Recommended)

```bash
npm install swr
```

```typescript
import useSWR from 'swr';
import { productService } from '@/lib/services/product.service';

function ProductsList() {
  const { data, error, mutate } = useSWR('/products', async () => {
    const response = await productService.getAll();
    return response.data;
  });

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🎯 Next Steps

1. ✅ Backend API đang chạy tại http://localhost:8080
2. ✅ Services đã được tạo trong `lib/services/`
3. ✅ Admin pages đã được update
4. ⏳ Cập nhật public pages (products, checkout)
5. ⏳ Add loading states và error handling
6. ⏳ Test toàn bộ flow

## 🚀 Run Both Services

### Terminal 1 - Backend
```bash
cd device-app-api-go
go run main.go
```

### Terminal 2 - Frontend
```bash
cd device-web
npm run dev
```

Then open:
- Backend API: http://localhost:8080
- Frontend: http://localhost:3000/admin/login

## 📝 Test Account

```
Email: admin@device-shop.com
Password: admin123456
```

---

**Happy Coding! 🚀**

