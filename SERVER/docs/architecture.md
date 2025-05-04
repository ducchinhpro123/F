# System Architecture Documentation

## Overview
This system is a Node.js/Express backend for a product and inventory management application. It uses MongoDB for data storage (via Mongoose), supports user authentication, product/category management, order processing, and file uploads (avatars, product/category images). The backend exposes a RESTful API consumed by a frontend (e.g., React).

---

## Main Components

### 1. Models (`SERVER/models/`)
- **User.js**: User accounts, authentication, roles (user/admin), avatar support, password hashing.
- **Product.js**: Product catalog, including name, description, price, image, category, stock, featured flag, rating, and creator.
- **Category.js**: Product categories, with name, description, and optional image.
- **Order.js**: Customer orders, including user, order items, shipping address, payment, and status fields.




### GET /api/products

```json
{
  "success": true,
  "products": [
    {
      "_id": "67e6b98d6b92cec6b438065f",
      "name": "External SSD 1TB",
      "description": "Portable solid-state drive with high-speed data transfer and durable design.",
      "price": 159.99,
      "image": "/images/dan-clark-e3-angle_2000x.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380640", "name": "Tablets" },
      "stock": 36,
      "sold": 0,
      "featured": true,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.896Z",
      "updatedAt": "2025-03-28T15:00:29.896Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b4380660",
      "name": "Portable Bluetooth Speaker",
      "description": "Waterproof Bluetooth speaker with 24-hour battery life and immersive sound.",
      "price": 130,
      "image": "/images/eaJ3SVhim9ya977gEJMvxH-320-80.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380638", "name": "Audio" },
      "stock": 88,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.896Z",
      "updatedAt": "2025-03-30T06:54:33.071Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b4380662",
      "name": "Bee",
      "description": "Fly around your house",
      "price": 100.01,
      "image": "/images/product-1743317015151-256414245.png",
      "category": { "_id": "67e6b98d6b92cec6b4380643", "name": "Cameras" },
      "stock": 99,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.896Z",
      "updatedAt": "2025-03-30T15:10:04.829Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b4380661",
      "name": "Drone with 4K Camera",
      "description": "Compact drone with stabilized 4K camera, obstacle avoidance, and 30-minute flight time.",
      "price": 799.99,
      "image": "/images/hero-image.fill.size_220x220.v1740914096.jpg",
      "category": { "_id": "67e6b98c6b92cec6b4380632", "name": "Smartphones" },
      "stock": 99,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.896Z",
      "updatedAt": "2025-03-28T15:00:29.896Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b438065d",
      "name": "Wireless Gaming Mouse",
      "description": "High-precision wireless gaming mouse with adjustable DPI and programmable buttons.",
      "price": 79.99,
      "image": "/images/H72DibpMHwRYF3R24dYbe6-320-80.jpg",
      "category": { "_id": "67e6b98c6b92cec6b4380632", "name": "Smartphones" },
      "stock": 108,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.896Z",
      "updatedAt": "2025-03-30T12:58:04.068Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b4380658",
      "name": "Wireless Charging Pad",
      "description": "Fast wireless charging pad compatible with all Qi-enabled devices.",
      "price": 49.99,
      "image": "/images/A15TD2305101B7ESYA0.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380640", "name": "Tablets" },
      "stock": 66,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.895Z",
      "updatedAt": "2025-03-28T15:00:29.895Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b438065b",
      "name": "Ultra-Wide Monitor",
      "description": "34\" curved ultra-wide monitor perfect for gaming and productivity.",
      "price": 499.99,
      "image": "/images/BRFSS2310240LWAW9E4.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380640", "name": "Tablets" },
      "stock": 105,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.895Z",
      "updatedAt": "2025-03-28T15:00:29.895Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b438065a",
      "name": "4K Smart TV",
      "description": "Ultra HD smart TV with vibrant colors, streaming apps, and voice control.",
      "price": 899.99,
      "image": "/images/BRCGS240428073TAN3F.jpg",
      "category": { "_id": "67e6b98c6b92cec6b4380635", "name": "Laptops" },
      "stock": 86,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.895Z",
      "updatedAt": "2025-03-30T14:04:18.447Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b4380659",
      "name": "Fitness Tracker Band",
      "description": "Waterproof fitness tracker with heart rate monitoring and sleep tracking features.",
      "price": 90,
      "image": "/images/ACsxJTrfySTV77S4CiHXkJ-320-80.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380649", "name": "Smart Home" },
      "stock": 59,
      "sold": 0,
      "featured": false,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.895Z",
      "updatedAt": "2025-04-19T07:18:25.629Z",
      "__v": 0
    },
    {
      "_id": "67e6b98d6b92cec6b438065c",
      "name": "Mechanical Gaming Keyboard",
      "description": "RGB mechanical keyboard with customizable keys and macro programming.",
      "price": 149.99,
      "image": "/images/CuSm3XePuDdXHxmbeoZF8M-320-80.jpg",
      "category": { "_id": "67e6b98d6b92cec6b4380649", "name": "Smart Home" },
      "stock": 14,
      "sold": 0,
      "featured": true,
      "rating": 0,
      "numReviews": 0,
      "createdBy": null,
      "createdAt": "2025-03-28T15:00:29.895Z",
      "updatedAt": "2025-03-28T15:00:29.895Z",
      "__v": 0
    }
  ],
  "currentPage": 1,
  "totalPages": 2,
  "totalProducts": 19
}
```

### GET /api/users/getAllUsers

```json
[
  {
    "_id": "67ed0ec8de6d4e4a27987772",
    "username": "vunguyen",
    "name": "vunguyen",
    "role": "admin",
    "avatar": "/avatars/avatar-1745022892272-422160234.jpeg",
    "createdAt": "2025-04-02T10:17:44.368Z",
    "__v": 0
  },
  {
    "_id": "67fb8b8467f8c0b8841a3382",
    "username": "admin",
    "name": "admin",
    "role": "user",
    "avatar": "/avatars/avatar-1744991530648-223224413.jpeg",
    "createdAt": "2025-04-13T10:01:40.625Z",
    "__v": 0
  },
  {
    "_id": "6802f290c4feb43bc09172ce",
    "username": "admin1",
    "name": "Bee",
    "role": "user",
    "avatar": "/avatars/avatar.jpg",
    "createdAt": "2025-04-19T00:47:12.133Z",
    "__v": 0
  },
  {
    "_id": "680304c89a636b654f62c210",
    "username": "user2",
    "name": "user2",
    "role": "admin",
    "avatar": "/avatars/avatar.jpg",
    "createdAt": "2025-04-19T02:04:56.462Z",
    "__v": 0
  },
  {
    "_id": "6817165bffeb1f81960edd86",
    "username": "khsdkfh",
    "name": "sdfasff",
    "role": "admin",
    "avatar": "/avatars/avatar.jpg",
    "createdAt": "2025-05-04T07:25:15.937Z",
    "__v": 0
  }
]
```

### GET /api/categories

```json
{
  "success": true,
  "categories": [
    {
      "name": "Audio",
      "description": "Headphones, earbuds, and speakers",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.147Z",
      "__v": 0
    },
    {
      "name": "Cameras",
      "description": "Digital cameras and photography equipment",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.441Z",
      "__v": 0
    },
    {
      "name": "Gaming",
      "description": "Consoles, peripherals, and accessories",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.537Z",
      "__v": 0
    },
    {
      "name": "Laptops",
      "description": "Portable computers for work and play",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:28.820Z",
      "__v": 0
    },
    {
      "name": "Smart Home",
      "description": "Connected devices for the modern home",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.626Z",
      "__v": 0
    },
    {
      "name": "Smartphones",
      "description": "Mobile phones and accessories",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:28.628Z",
      "__v": 0
    },
    {
      "name": "Tablets",
      "description": "Portable touchscreen devices",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.343Z",
      "__v": 0
    },
    {
      "name": "Wearables",
      "description": "Smartwatches and fitness trackers",
      "image": "default-category.jpg",
      "createdAt": "2025-03-28T15:00:29.245Z",
      "__v": 0
    }
  ]
}
```


*Generated automatically from the current codebase structure and API responses.*
