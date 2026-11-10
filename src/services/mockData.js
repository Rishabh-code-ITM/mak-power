/**
 * MAK POWER - Initial Demo Catalog & Store Data
 * Uses real workspace images from /image/... with realistic Indian electronics store pricing in ₹
 */

export const INITIAL_CATEGORIES = [
  {
    id: "cat-audio-earbuds",
    name: "Bluetooth Earbuds",
    slug: "bluetooth-earbuds",
    icon: "Headphones",
    image: "/image/bluetooth-earbuds.jpg",
    description: "True wireless stereo earbuds with low latency and deep bass."
  },
  {
    id: "cat-chargers",
    name: "Chargers & Adapters",
    slug: "chargers-adapters",
    icon: "Zap",
    image: "/image/mobile-chargers.jpg",
    description: "Fast charging power adapters with multi-port QC and PD support."
  },
  {
    id: "cat-cables",
    name: "USB Data Cables",
    slug: "usb-cables",
    icon: "Cable",
    image: "/image/mobile-chargers.jpg",
    description: "Braided high-speed Type-C, Lightning, and Micro USB cables."
  },
  {
    id: "cat-powerbanks",
    name: "Power Banks",
    slug: "power-banks",
    icon: "BatteryCharging",
    image: "/image/power-banks.jpg",
    description: "High-capacity dual-output portable power banks."
  },
  {
    id: "cat-covers",
    name: "Mobile Back Covers",
    slug: "mobile-back-covers",
    icon: "Shield",
    image: "/image/back-covers.jpg",
    description: "Shockproof, designer, and matte finish mobile protective cases."
  },
  {
    id: "cat-speakers",
    name: "Bluetooth Speakers",
    slug: "bluetooth-speakers",
    icon: "Volume2",
    image: "/image/bluetooth-speakers.jpg",
    description: "Booming 360-degree party speakers with long battery life."
  },
  {
    id: "cat-headphones",
    name: "Over-Ear Headphones",
    slug: "headphones",
    icon: "Radio",
    image: "/image/headphones.jpg",
    description: "Ergonomic studio bass headphones with cushioned earcups."
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-earbuds-tws10",
    name: "MAK POWER True Wireless Earbuds TWS-100",
    slug: "mak-power-true-wireless-earbuds-tws-100",
    categorySlug: "bluetooth-earbuds",
    categoryName: "Bluetooth Earbuds",
    originalPrice: 1999,
    sellingPrice: 899,
    stock: 35,
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isTrending: true,
    isBestseller: true,
    warrantyMonths: 12,
    images: [
      "/image/bluetooth-earbuds.jpg",
      "/image/featured-electronics.jpg"
    ],
    shortDesc: "Environmental Noise Cancellation, 35-hour playback, IPX5 water resistance, and deep heavy bass.",
    description: "Experience premium wireless freedom with MAK POWER TWS-100. Tuned for Indian music lovers with extra punchy bass, clear vocal acoustics, and fast pairing Bluetooth 5.3 technology. Compact pocket-sized charging case provides up to 35 hours of non-stop entertainment.",
    specifications: {
      "Bluetooth Version": "v5.3 + EDR",
      "Playback Time": "Up to 35 Hours (with case)",
      "Charging Time": "1.2 Hours Type-C Fast Charge",
      "Water Resistance": "IPX5 Splash & Sweat Resistant",
      "Driver Size": "13mm Dynamic Bass Boost Drivers",
      "Mic": "Dual HD Microphones with ENC",
      "Warranty": "1 Year Brand Replacement"
    }
  },
  {
    id: "prod-charger-65w",
    name: "MAK POWER 65W GaN Super Fast Charger with Type-C Cable",
    slug: "mak-power-65w-gan-super-fast-charger",
    categorySlug: "chargers-adapters",
    categoryName: "Chargers & Adapters",
    originalPrice: 1499,
    sellingPrice: 699,
    stock: 50,
    rating: 4.9,
    reviewsCount: 215,
    isFeatured: true,
    isTrending: true,
    isBestseller: true,
    warrantyMonths: 6,
    images: [
      "/image/mobile-chargers.jpg",
      "/image/featured-electronics.jpg"
    ],
    shortDesc: "Supports VOOC, Dash, Warp, Dart, QC 3.0 & 65W PD. Comes with braided 1m Type-C cable.",
    description: "Charge your smartphone from 0% to 70% in just 25 minutes! Built with smart IC protection against over-voltage, short circuits, and heating. Tested thoroughly for high endurance and compatible with all Android smartphones, iPhones, tablets, and smart gadgets.",
    specifications: {
      "Power Output": "65W Max Power Delivery",
      "Ports": "Dual Ports (Type-C + USB-A)",
      "Cable Included": "1 Meter 6A Fast Braided Type-C Cable",
      "Protection": "Multi-Layer Smart Surge & Heat Shield",
      "Compatibility": "Universal (OnePlus, Samsung, Xiaomi, Realme, iPhone, Vivo)"
    }
  },
  {
    id: "prod-powerbank-20k",
    name: "MAK POWER 20,000mAh Ultra-Compact Heavy Duty Power Bank",
    slug: "mak-power-20000mah-ultra-compact-power-bank",
    categorySlug: "power-banks",
    categoryName: "Power Banks",
    originalPrice: 2499,
    sellingPrice: 1299,
    stock: 22,
    rating: 4.8,
    reviewsCount: 98,
    isFeatured: true,
    isTrending: false,
    isBestseller: true,
    warrantyMonths: 6,
    images: [
      "/image/power-banks.jpg",
      "/image/featured-electronics.jpg"
    ],
    shortDesc: "22.5W Two-Way Fast Charge, Digital LED Battery Display, Dual Output + Type-C Input/Output.",
    description: "Never run out of power during journeys. MAK POWER 20000mAh heavy-duty power bank packs immense energy in an anti-scratch textured shell. Certified safe for flights and capable of charging a modern smartphone 4 to 5 times completely.",
    specifications: {
      "Battery Capacity": "20,000mAh Lithium Polymer",
      "Output Speed": "22.5W Max Fast Charge",
      "Input Ports": "Type-C (18W) + Micro USB",
      "Output Ports": "2x USB-A (22.5W) + 1x Type-C (20W PD)",
      "Display": "Digital Numeric LED Display",
      "Certification": "BIS Approved & Flight Safe"
    }
  },
  {
    id: "prod-covers-designer",
    name: "MAK POWER Shockproof Matte Protective Back Cover Series",
    slug: "mak-power-shockproof-matte-protective-back-cover",
    categorySlug: "mobile-back-covers",
    categoryName: "Mobile Back Covers",
    originalPrice: 499,
    sellingPrice: 199,
    stock: 80,
    rating: 4.7,
    reviewsCount: 310,
    isFeatured: false,
    isTrending: true,
    isBestseller: true,
    warrantyMonths: 1,
    images: [
      "/image/back-covers.jpg"
    ],
    shortDesc: "Air-cushioned corners, raised camera protection ring, anti-yellowing TPU + polycarbonate back.",
    description: "Shield your phone against accidental drops and bumps. Precision cutouts ensure effortless access to buttons, charging ports, and speakers. Available for popular phone models from Samsung, Redmi, Realme, Vivo, and iPhone.",
    specifications: {
      "Material": "Hybrid Rigid PC + Flexible TPU Bumper",
      "Drop Protection": "Military-grade 6ft drop cushion corners",
      "Camera Guard": "1.2mm Raised Bezel Protection",
      "Finish": "Translucent Frosted Matte (Anti-Fingerprint)"
    }
  },
  {
    id: "prod-speaker-bass",
    name: "MAK POWER Pulse 360° Portable Bluetooth Speaker with FM",
    slug: "mak-power-pulse-360-portable-bluetooth-speaker",
    categorySlug: "bluetooth-speakers",
    categoryName: "Bluetooth Speakers",
    originalPrice: 1899,
    sellingPrice: 799,
    stock: 28,
    rating: 4.9,
    reviewsCount: 76,
    isFeatured: true,
    isTrending: false,
    isBestseller: false,
    warrantyMonths: 6,
    images: [
      "/image/bluetooth-speakers.jpg",
      "/image/featured-electronics.jpg"
    ],
    shortDesc: "10W RMS Output, passive bass radiator, 8 hours playtime, USB drive, SD card & FM Radio.",
    description: "Turn any room or outdoor gathering into a party with booming stereo sound and rumbling bass. Features multi-mode playback including Bluetooth 5.0, USB flash drive, micro SD slot, AUX input, and built-in FM Radio.",
    specifications: {
      "Sound Output": "10 Watts RMS with Passive Subwoofer",
      "Playtime": "Up to 8 Hours Continuous Music",
      "Connectivity": "Bluetooth 5.0, USB Pen Drive, TF Card, AUX, FM",
      "Battery": "1800mAh Rechargeable Li-ion",
      "Dimensions": "Compact Cylinder with Carrying Strap"
    }
  },
  {
    id: "prod-headphones-studio",
    name: "MAK POWER BassMaster Over-Ear Wireless Headphones",
    slug: "mak-power-bassmaster-over-ear-wireless-headphones",
    categorySlug: "headphones",
    categoryName: "Over-Ear Headphones",
    originalPrice: 2299,
    sellingPrice: 999,
    stock: 19,
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    isTrending: true,
    isBestseller: false,
    warrantyMonths: 6,
    images: [
      "/image/headphones.jpg"
    ],
    shortDesc: "40mm Deep Bass Drivers, 25 hours wireless battery, foldable design, and low latency gaming.",
    description: "Immerse yourself in high-fidelity acoustics with ultra-soft memory foam earcups designed for prolonged hours of movies, gaming, and online meetings. Dual connectivity allows you to use wireless Bluetooth or the included 3.5mm AUX cable.",
    specifications: {
      "Acoustic Driver": "40mm Dynamic Neodymium Drivers",
      "Battery Life": "25+ Hours Playtime",
      "Mic": "Omnidirectional microphone with voice assistance support",
      "Form Factor": "Adjustable & Foldable Headband with Soft Cushions"
    }
  }
];

export const INITIAL_COUPONS = [
  {
    code: "MAK10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 150,
    description: "Get 10% instant off on orders above ₹499"
  },
  {
    code: "FIRSTPOWER",
    discountType: "flat",
    discountValue: 50,
    minOrderValue: 299,
    maxDiscount: 50,
    description: "Flat ₹50 off on your first order"
  },
  {
    code: "GARKHAFREESHIP",
    discountType: "flat",
    discountValue: 49,
    minOrderValue: 0,
    maxDiscount: 49,
    description: "Free express delivery coupon"
  }
];

export const STORE_INFO = {
  name: "MAK POWER",
  tagline: "Powering Your Digital World",
  phone: "9942670379",
  whatsapp: "919942670379",
  email: "rishbahkr9942@gmail.com",
  address: "Chhapra–Road, Garkha, Bihar 841311",
  workingHours: "Monday – Sunday: 9:00 AM – 9:00 PM",
  shopImage: "/image/mak-power-shop.jpg",
  logoImage: "/image/mak power logo.png"
};
