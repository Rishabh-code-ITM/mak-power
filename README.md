# ⚡ MAK POWER – Complete E-Commerce Web Platform

A modern, high-performance Indian electronics and mobile accessories shopping platform for **MAK POWER** (Garkha, Saran, Bihar), built with **React + Vite**, **Vercel Serverless Functions**, and **Supabase PostgreSQL**.

Inspired by the professional shopping experience of **Amazon** and **Flipkart**, customized with MAK POWER's bold brand identity (**Crimson Red `#D71920`**, **Clean White**, and **Deep Carbon `#111827`**).

---

## 🚀 Key Features

### 🛒 1. Customer Shopping Experience
- **Header & Navigation:**
  - Official MAK POWER logo with crisp brand typography.
  - Live search bar with instant autocomplete suggestions.
  - Wishlist count badge and Shopping Cart drawer.
  - Direct delivery address indicator (*"Deliver to Garkha 841311"*).
- **Homepage:**
  - Promotional announcement bar with store timings and direct phone link.
  - Interactive hero banner slider featuring genuine MAK POWER products.
  - Category icon strip (*Earbuds, Chargers, Cables, Power Banks, Covers, Speakers, Headphones*).
  - **Deal of the Day** with live countdown timer.
  - Trending Products & Bestsellers showcase.
  - **Store Visit Section** featuring the actual retail storefront in Garkha.
  - Verified local customer reviews.
- **Product Details Page:**
  - Multi-image gallery with thumbnail switcher.
  - Live Indian Rupee (₹) pricing, MRP strikethrough, and genuine discount tags.
  - **Delivery PIN Code Checker:** Computes estimated delivery date (e.g., 2 business days for Bihar).
  - Quantity selector, **Add to Cart**, and **Buy Now** (instant checkout).
  - Direct 1-click **WhatsApp Enquiry** button with pre-filled product details.
  - Comprehensive Technical Specifications table.
  - Customer review submission form.
- **Shopping Cart & Checkout:**
  - Quantity adjustment stepper with subtotal updates.
  - Discount coupon engine (e.g. `MAK10` for 10% off, `FIRSTPOWER` for ₹50 off).
  - Free delivery on orders above ₹499 (else ₹49).
  - **Cash on Delivery (COD)** default payment method.
  - Online Payment (Razorpay test ready).
  - Auto-generated unique order ID (`MAK-ORD-2026-XXXX`).
- **Order Tracking:**
  - Interactive 5-step visual timeline (*Pending → Confirmed → Packed → Shipped → Delivered*).
  - Courier AWB tracking number display and status history timestamps.

### 🛡️ 2. Admin Dashboard (`/admin`)
- Accessible at `/admin` (or via the Admin toggle in the header).
- **Real-Time Store Stats:** Total Revenue, Total Orders, Pending Dispatches, Active Catalog, and Low-Stock warnings.
- **Order Management:**
  - Search orders by Order Number, Customer Name, or Phone.
  - Update status instantly (*Confirmed, Packed, Shipped, Delivered, Cancelled*).
  - **Printable Tax Invoice Generator:** Generates professional store invoices with itemized taxes, customer address, and store GST details.
- **Product Management:**
  - Add new products modal with category, price, MRP, stock, and descriptions.
  - Edit stock levels and delete products.
- **Database Status Indicator:**
  - Displays whether connected to Supabase or running in Local Demo Mode.
  - One-click catalog reset to restore official demo data.

---

## 📂 Project Architecture

```
2168_sweet_bakery/
├── api/                           # Vercel Serverless Functions
│   ├── orders.js                  # Server-side order creation & price calculation
│   └── verify-payment.js          # Razorpay signature verification
├── public/                        # Static assets & SEO
│   ├── image/                     # Store & product images
│   ├── robots.txt                 # Search engine directives
│   └── sitemap.xml                # SEO sitemap
├── src/
│   ├── components/
│   │   ├── common/                # ProductCard, RatingStars, Toast
│   │   ├── home/                  # HeroSlider, CategoriesStrip, DealOfTheDay, StoreVisitBanner
│   │   └── layout/                # Header, TopAnnouncement, CategoryNav, Footer, FloatingContact
│   ├── context/
│   │   ├── AuthContext.jsx        # Customer & Admin authentication state
│   │   ├── CartContext.jsx        # Persistent shopping cart & coupon engine
│   │   └── WishlistContext.jsx    # Persistent wishlist items
│   ├── pages/
│   │   ├── HomePage.jsx           # Store homepage
│   │   ├── ShopPage.jsx           # Filterable catalog with search & price sliders
│   │   ├── ProductDetailPage.jsx  # Specifications, PIN code checker, reviews
│   │   ├── CartPage.jsx           # Cart review & coupon discounts
│   │   ├── CheckoutPage.jsx       # Address collection & COD order placement
│   │   ├── OrderSuccessPage.jsx   # Confetti confirmation & receipt
│   │   ├── OrderTrackingPage.jsx  # Live 5-step order timeline
│   │   ├── AccountPage.jsx        # User orders, saved addresses, wishlist
│   │   ├── AdminDashboardPage.jsx # Store admin, inventory & tax invoices
│   │   ├── LoginPage.jsx          # Login / Register with 1-click demo access
│   │   └── NotFoundPage.jsx       # 404 handler
│   ├── services/
│   │   ├── supabase.js            # Supabase client initializer
│   │   ├── productsService.js     # Catalog service (Supabase + LocalStorage fallback)
│   │   ├── ordersService.js       # Order processing & inventory logs
│   │   └── mockData.js            # Initial genuine store products & categories
│   ├── styles/
│   │   └── index.css              # Full e-commerce responsive CSS design system
│   ├── App.jsx                    # Route mapping & layout
│   └── main.jsx                   # React root entrypoint
├── supabase/
│   └── schema.sql                 # 14-Table Normalized PostgreSQL database schema
├── .env.example                   # Environment configuration template
├── package.json                   # Dependencies & build scripts
├── vercel.json                    # Vercel deployment rewrites
└── vite.config.js                 # Optimized Vite configuration with vendor chunking
```

---

## 💻 How to Run Locally (Windows CMD / PowerShell)

### Step 1: Open Terminal in Project Folder
```cmd
cd "c:\Users\Rishabh Kumar\Downloads\2168_sweet_bakery"
```

### Step 2: Install Dependencies (if not already installed)
```cmd
npm install
```

### Step 3: Start the Development Server
```cmd
npm run dev
```
Open **`http://localhost:3000`** in Google Chrome or any browser.

> **Note:** The project features a **Dual-Mode Data Architecture**. If Supabase keys are not set, it operates seamlessly in **Local Demo Mode** using browser LocalStorage. Every product added in the admin panel and every order placed will persist across page refreshes!

---

## 🗄️ Setting Up Supabase Database (Optional / Production)

1. Create a free account at [Supabase.com](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open the file `supabase/schema.sql` from this project, copy the entire SQL code, and click **Run**.
   - This creates all **14 normalized tables**: `profiles`, `categories`, `products`, `product_images`, `carts`, `cart_items`, `wishlists`, `addresses`, `orders`, `order_items`, `payments`, `reviews`, `coupons`, and `inventory_logs`.
   - Sets up Row Level Security (RLS) policies, indexes, and automatic timestamp triggers.
4. Copy your **Project URL** and **Anon Public Key** from `Project Settings > API`.
5. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
6. Restart the Vite server (`npm run dev`). The Admin dashboard will automatically show **"Supabase Connected"**!

---

## 🚀 How to Deploy on Vercel

1. Push your updated code to your GitHub repository:
```cmd
git add .
git commit -m "Transform MAK POWER to complete professional e-commerce platform"
git push origin main
```
2. In your [Vercel Dashboard](https://vercel.com):
   - Select your project (`mak-power`).
   - If setting up Supabase, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings > Environment Variables**.
   - Vercel will automatically build and deploy the React frontend and serverless API endpoints.
3. Your website will be live at `https://mak-power.vercel.app/`!

---

## 👤 Admin Access & Testing
- Go to `http://localhost:3000/admin` or click **Admin** in the header.
- If prompted to log in, click **"Admin Demo"** or log in with:
  - **Email:** `admin@makpower.com`
  - **Password:** `admin123`
- From the admin panel, you can:
  - View real-time orders and update their delivery status.
  - Print customer tax invoices.
  - Add new products or adjust stock.
  - Reset to original demo catalog at any time.
