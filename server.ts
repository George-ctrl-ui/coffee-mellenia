import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'mellenia_admin_key_2026';

app.use(express.json());

// In-Memory Database Stores (Production-grade relational simulation with ACID transaction semantics)
export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in PHP
  category: string;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  ingredients?: string[];
  tastingNotes?: string[];
  roastLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface DbOrder {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  total: number;
  items: DbOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DbContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const PRODUCTS: DbProduct[] = [
  {
    id: 'prod-1',
    name: 'Espresso',
    description: 'Rich, concentrated double shot of our signature house roast with dense hazelnut crema and notes of dark chocolate.',
    price: 95,
    category: 'Espresso',
    imageUrl: '/src/assets/images/coffee_dark_espresso_shot_1791949180653.jpg',
    available: true,
    featured: false,
    ingredients: ['100% Single-Origin Arabica Beans', 'Filtered Artesian Water', 'Dense Golden Crema'],
    tastingNotes: ['Dark Chocolate', 'Roasted Hazelnut', 'Orange Peel'],
    roastLevel: 'Dark Roast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Americano',
    description: 'Double espresso pulled delicately over hot artisanal mineral water, showcasing subtle citrus and cacao notes.',
    price: 110,
    category: 'Espresso',
    imageUrl: '/src/assets/images/coffee_hot_americano_cup_1791950429972.jpg',
    available: true,
    featured: false,
    ingredients: ['Double Shot Arabica Espresso', 'Purified Hot Spring Water', 'Natural Coffee Crema'],
    tastingNotes: ['Cacao Nibs', 'Citrus Zest', 'Caramelized Sugar'],
    roastLevel: 'Medium-Dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Café Latte',
    description: 'Silky microfoam poured over double espresso, delivering a mellow, well-rounded cup with natural milk sweetness.',
    price: 145,
    category: 'Latte',
    imageUrl: '/src/assets/images/hero_coffee_latte_art_1791815764504.jpg',
    available: true,
    featured: true,
    ingredients: ['Specialty House Roast', 'Steamed Whole Milk', 'Silky Microfoam Art'],
    tastingNotes: ['Toasted Almond', 'Sweet Cream', 'Milk Chocolate'],
    roastLevel: 'Medium Roast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Cappuccino',
    description: 'A traditional balanced thirds composition of bold espresso, dense steamed milk, and airy foam lightly dusted with cinnamon.',
    price: 145,
    category: 'Espresso',
    imageUrl: '/src/assets/images/coffee_fluffy_cappuccino_1791949183469.jpg',
    available: true,
    featured: false,
    ingredients: ['Double Espresso Shot', 'Steamed Fresh Milk', 'Airy Foam Mountain', 'Belgian Cocoa Dust'],
    tastingNotes: ['Bitter Cocoa', 'Roasted Walnut', 'Warm Vanilla'],
    roastLevel: 'Medium-Dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Spanish Latte',
    description: 'Our customer favorite. House espresso blended with sweetened condensed milk and velvety fresh steamed milk.',
    price: 165,
    category: 'Latte',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: true,
    ingredients: ['Espresso Float', 'Sweetened Condensed Milk', 'Chilled Fresh Whole Milk', 'Clear Crystal Ice'],
    tastingNotes: ['Dulce de Leche', 'Raw Brown Sugar', 'Silky Vanilla'],
    roastLevel: 'Dark Roast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Caramel Macchiato',
    description: 'Steamed milk stained with bold espresso, accented with pure Madagascar vanilla and artisanal amber caramel drizzle.',
    price: 175,
    category: 'Latte',
    imageUrl: '/src/assets/images/coffee_caramel_macchiato_1791949182185.jpg',
    available: true,
    featured: false,
    ingredients: ['Dark Espresso Float', 'Madagascar Vanilla Milk', 'Salted Amber Caramel Drizzle', 'Ice'],
    tastingNotes: ['Salted Butter Caramel', 'Vanilla Custard', 'Toasted Pecan'],
    roastLevel: 'Medium-Dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Iced Vanilla Latte',
    description: 'Chilled house espresso over cold milk and steeped real vanilla bean syrup, served over clear handcrafted crystal ice.',
    price: 165,
    category: 'Iced Coffee',
    imageUrl: '/src/assets/images/coffee_iced_vanilla_latte_1791950430690.jpg',
    available: true,
    featured: false,
    ingredients: ['Chilled House Espresso', 'Steamed Cold Milk', 'Pure Vanilla Bean Pod Syrup', 'Ice'],
    tastingNotes: ['Floral Vanilla', 'Smooth Honey', 'Creamy Nougat'],
    roastLevel: 'Medium Roast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Iced Mocha',
    description: 'Dutch dark cocoa infused into fresh double espresso, blended with cold whole milk and poured over crystal ice cubes.',
    price: 175,
    category: 'Iced Coffee',
    imageUrl: '/src/assets/images/coffee_iced_mocha_glass_1791949182497.jpg',
    available: true,
    featured: true,
    ingredients: ['Dutch 70% Dark Cocoa', 'Double Shot Espresso', 'Cold Whole Milk', 'Roasted Bean Garnish'],
    tastingNotes: ['Bittersweet Fudge', 'Espresso Crema', 'Dark Cacao'],
    roastLevel: 'Dark Roast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Matcha Latte',
    description: 'Ceremonial grade Japanese Uji matcha stone-ground and whisked smoothly with whole milk for a clean, vibrant taste.',
    price: 180,
    category: 'Non-Coffee',
    imageUrl: '/src/assets/images/coffee_matcha_latte_1791815816390.jpg',
    available: true,
    featured: true,
    ingredients: ['Ceremonial Uji Matcha', 'Whisked Bamboo Spring Water', 'Silky Oat Milk', 'Pure Cane Sugar'],
    tastingNotes: ['Earthy Umami', 'Sweet Fresh Grass', 'Pistachio Cream'],
    roastLevel: 'Ceremonial Grade',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Chocolate Frappe',
    description: 'Decadent chilled blended chocolate with fresh cream and dark cocoa drizzle, refreshing and rich.',
    price: 185,
    category: 'Non-Coffee',
    imageUrl: '/src/assets/images/coffee_chocolate_frappe_glass_1791950429998.jpg',
    available: true,
    featured: false,
    ingredients: ['Belgian Dark Cocoa Powder', 'Whipped Dairy Cream', 'Blended Ice Base', 'Chocolate Curls'],
    tastingNotes: ['Milk Chocolate', 'Bourbon Vanilla', 'Rich Cream'],
    roastLevel: 'Cocoa Blend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'Butter Croissant',
    description: 'Traditional French croissant with golden flaky honeycomb layers, laminated with pure European cultured butter.',
    price: 105,
    category: 'Pastries',
    imageUrl: '/src/assets/images/bakery_fresh_croissant_1791815828881.jpg',
    available: true,
    featured: true,
    ingredients: ['French Wheat Flour T55', '84% European Cultured Butter', 'Natural Sourdough', 'Sea Salt'],
    tastingNotes: ['Toasted Butter', 'Honeycomb Flakes', 'Caramelized Crust'],
    roastLevel: 'Freshly Baked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'Chocolate Muffin',
    description: 'Moist double chocolate sponge enriched with molten Belgian dark chocolate buttons, baked fresh every morning.',
    price: 95,
    category: 'Pastries',
    imageUrl: '/src/assets/images/bakery_chocolate_muffin_1791949182332.jpg',
    available: true,
    featured: false,
    ingredients: ['Belgian Bittersweet Dark Chocolate', 'Cocoa Sponge', 'Pure Cultured Butter', 'Chocolate Chunks'],
    tastingNotes: ['Molten Chocolate', 'Dark Cacao Nibs', 'Fudge Sponge'],
    roastLevel: 'Freshly Baked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to initialize realistic historical orders for analytics and visualization
function generateHistoricalOrders(): DbOrder[] {
  const seedCustomers = [
    { name: 'Maria Elena Santos', phone: '0917 554 1289' },
    { name: 'Juan Carlos Dela Cruz', phone: '0928 312 9081' },
    { name: 'Bea Patricia Clarin', phone: '0919 887 2341' },
    { name: 'Mark Anthony Amores', phone: '0922 411 7654' },
    { name: 'Ana Melissa Reyes', phone: '0915 620 9133' },
    { name: 'Carlo Miguel Tan', phone: '0939 123 4567' },
    { name: 'Princess Joy Garcia', phone: '0908 901 2345' },
    { name: 'Dave Gabriel Evangelista', phone: '0917 890 1234' },
    { name: 'Kristine Mae Alcantara', phone: '0920 789 0123' },
    { name: 'Jorji Boholano', phone: '0918 234 5678' },
  ];

  const popularProductCombinations = [
    [{ id: 'prod-4', name: 'Spanish Latte', price: 155, qty: 2 }],
    [{ id: 'prod-5', name: 'Caramel Macchiato', price: 165, qty: 1 }, { id: 'prod-10', name: 'Fresh Butter Croissant', price: 85, qty: 2 }],
    [{ id: 'prod-1', name: 'Espresso', price: 95, qty: 1 }, { id: 'prod-11', name: 'Pain au Chocolat', price: 95, qty: 1 }],
    [{ id: 'prod-8', name: 'Matcha Latte', price: 160, qty: 2 }],
    [{ id: 'prod-2', name: 'Americano', price: 110, qty: 2 }, { id: 'prod-10', name: 'Fresh Butter Croissant', price: 85, qty: 1 }],
    [{ id: 'prod-7', name: 'Dark Mocha', price: 165, qty: 1 }, { id: 'prod-4', name: 'Spanish Latte', price: 155, qty: 1 }],
    [{ id: 'prod-6', name: 'Iced Vanilla Latte', price: 150, qty: 3 }],
    [{ id: 'prod-9', name: 'Chocolate Frappe', price: 175, qty: 2 }, { id: 'prod-12', name: 'Chocolate Fudge Brownie', price: 110, qty: 1 }],
    [{ id: 'prod-3', name: 'Cappuccino', price: 135, qty: 2 }],
  ];

  const orders: DbOrder[] = [];
  const now = Date.now();

  // Generate orders spread across the last 14 days
  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    // 3 to 6 orders per day, ramping up on recent days
    const ordersTodayCount = Math.floor(3 + Math.random() * 4 + (13 - daysAgo) * 0.2);
    
    for (let j = 0; j < ordersTodayCount; j++) {
      const customer = seedCustomers[Math.floor(Math.random() * seedCustomers.length)];
      const combo = popularProductCombinations[Math.floor(Math.random() * popularProductCombinations.length)];
      
      // Hours distributed mostly between 8am and 7pm
      const hour = Math.floor(8 + Math.random() * 11);
      const minute = Math.floor(Math.random() * 60);
      const orderDate = new Date(now - daysAgo * 86400000);
      orderDate.setHours(hour, minute, Math.floor(Math.random() * 60));

      let orderTotal = 0;
      const orderItems: DbOrderItem[] = [];
      const orderId = `seed-ord-${daysAgo}-${j}-${Math.floor(Math.random() * 1000)}`;

      combo.forEach((c) => {
        const itemSubtotal = c.price * c.qty;
        orderTotal += itemSubtotal;
        orderItems.push({
          id: `item-${orderId}-${c.id}`,
          orderId,
          productId: c.id,
          productName: c.name,
          quantity: c.qty,
          unitPrice: c.price,
          subtotal: itemSubtotal,
        });
      });

      const refCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      let status: DbOrder['status'] = 'Completed';
      if (daysAgo === 0) {
        // Today's orders have a realistic live mix
        const statusMix: DbOrder['status'][] = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed'];
        status = statusMix[Math.floor(Math.random() * statusMix.length)];
      }

      orders.push({
        id: orderId,
        reference: `CM-${refCode}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        status,
        total: orderTotal,
        items: orderItems,
        notes: Math.random() > 0.6 ? 'Less sweet please, extra napkin' : undefined,
        createdAt: orderDate.toISOString(),
        updatedAt: orderDate.toISOString(),
      });
    }
  }

  // Sort descending by creation date (newest first)
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const ORDERS: DbOrder[] = generateHistoricalOrders();
const CONTACT_MESSAGES: DbContactMessage[] = [];

// Rate limiter helper for public endpoints
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count++;
  return true;
}

// 1. GET /api/products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...PRODUCTS];

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

// 2. GET /api/products/:id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found', message: `No product exists with ID: ${req.params.id}` });
    return;
  }
  res.json(product);
});

// 3. POST /api/orders
app.post('/api/orders', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 15, 60000)) {
    res.status(429).json({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please wait a moment before placing another order.' });
    return;
  }

  const { customerName, customerPhone, customerEmail, notes, items } = req.body;

  // Validation
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    res.status(400).json({ error: 'Invalid name', message: 'Full customer name is required (minimum 2 characters).' });
    return;
  }

  // Philippine phone number validation: (e.g. 09171234567 or +639171234567 or 9171234567)
  const phoneClean = (customerPhone || '').replace(/[\s-]/g, '');
  const phPhoneRegex = /^(09|\+639|9)\d{9}$/;
  if (!phoneClean || !phPhoneRegex.test(phoneClean)) {
    res.status(400).json({
      error: 'Invalid phone',
      message: 'Please provide a valid Philippine mobile number (e.g., 0917 123 4567 or +63 917 123 4567).',
    });
    return;
  }

  if (customerEmail && typeof customerEmail === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      res.status(400).json({ error: 'Invalid email', message: 'Please provide a valid email address.' });
      return;
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Empty cart', message: 'Order must contain at least one product.' });
    return;
  }

  // Server-side calculation & stock/availability verification
  let totalInPhp = 0;
  const orderItems: DbOrderItem[] = [];
  const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  for (const item of items) {
    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      res.status(400).json({ error: 'Invalid quantity', message: 'Product quantity must be 1 or greater.' });
      return;
    }

    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) {
      res.status(400).json({ error: 'Product unavailable', message: `Product ID "${item.productId}" is not recognized.` });
      return;
    }

    if (!product.available) {
      res.status(400).json({ error: 'Product out of stock', message: `Product "${product.name}" is currently unavailable.` });
      return;
    }

    const itemSubtotal = product.price * qty;
    totalInPhp += itemSubtotal;

    orderItems.push({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      orderId,
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: product.price,
      subtotal: itemSubtotal,
    });
  }

  // Generate unique human-readable order reference: CM- followed by 6 random alphanumeric characters
  const refCode = Math.floor(100000 + Math.random() * 900000).toString();
  const reference = `CM-${refCode}`;

  const newOrder: DbOrder = {
    id: orderId,
    reference,
    customerName: customerName.trim(),
    customerPhone: phoneClean,
    customerEmail: customerEmail ? customerEmail.trim() : undefined,
    notes: notes ? notes.trim() : undefined,
    status: 'Pending',
    total: totalInPhp,
    items: orderItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ORDERS.unshift(newOrder);

  res.status(201).json(newOrder);
});

// 4. GET /api/orders/:reference
app.get('/api/orders/:reference', (req: Request, res: Response) => {
  const ref = req.params.reference.toUpperCase().trim();
  const order = ORDERS.find((o) => o.reference.toUpperCase() === ref);
  if (!order) {
    res.status(404).json({ error: 'Order not found', message: `No order found with reference "${req.params.reference}".` });
    return;
  }
  res.json(order);
});

// 5. GET /api/admin/orders
app.get('/api/admin/orders', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', message: 'Valid admin authentication token required.' });
    return;
  }
  res.json(ORDERS);
});

// 6. PATCH /api/admin/orders/:id/status
app.patch('/api/admin/orders/:id/status', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', message: 'Valid admin authentication token required.' });
    return;
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status', message: `Status must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  const order = ORDERS.find((o) => o.id === req.params.id || o.reference.toUpperCase() === req.params.id.toUpperCase());
  if (!order) {
    res.status(404).json({ error: 'Order not found', message: 'Order could not be located.' });
    return;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json(order);
});

// 6b. POST /api/admin/orders/simulate - Inject real-time order for live dashboard testing
app.post('/api/admin/orders/simulate', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', message: 'Valid admin authentication token required.' });
    return;
  }

  const sampleCustomers = [
    { name: 'Chloe Lim', phone: '0917 443 2190' },
    { name: 'Gabriel Mendoza', phone: '0928 991 3412' },
    { name: 'Danielle Yap', phone: '0915 221 8843' },
    { name: 'Raphael Suan', phone: '0939 678 1234' },
    { name: 'Samantha Bohol', phone: '0919 556 7812' },
  ];
  
  // Pick 1 to 2 random products from PRODUCTS
  const numItems = Math.random() > 0.5 ? 2 : 1;
  const pickedProducts = [...PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, numItems);
  const customer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
  const orderId = `live-ord-${Date.now()}`;
  
  let total = 0;
  const items: DbOrderItem[] = pickedProducts.map((p) => {
    const qty = Math.floor(1 + Math.random() * 2);
    const subtotal = p.price * qty;
    total += subtotal;
    return {
      id: `item-${Date.now()}-${p.id}`,
      orderId,
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unitPrice: p.price,
      subtotal,
    };
  });

  const refCode = Math.floor(100000 + Math.random() * 900000).toString();
  const simulatedOrder: DbOrder = {
    id: orderId,
    reference: `CM-${refCode}`,
    customerName: customer.name,
    customerPhone: customer.phone,
    status: 'Pending',
    total,
    items,
    notes: 'Live order simulated via Admin Real-Time Hub',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ORDERS.unshift(simulatedOrder);
  res.status(201).json(simulatedOrder);
});

// 7. POST /api/contact
app.post('/api/contact', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 10, 60000)) {
    res.status(429).json({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please wait before submitting another message.' });
    return;
  }

  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Invalid name', message: 'Please provide your name.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Invalid email', message: 'Please provide a valid email address.' });
    return;
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
    res.status(400).json({ error: 'Invalid subject', message: 'Please provide a subject line.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ error: 'Invalid message', message: 'Message should be at least 5 characters long.' });
    return;
  }

  const contactRecord: DbContactMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  CONTACT_MESSAGES.push(contactRecord);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to Coffee Mellenia. Our team will get back to you shortly.',
    id: contactRecord.id,
  });
});

// Setup Vite development server middleware or serve dist in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Coffee Mellenia Full-Stack Server active on port ${PORT}`);
  });
}

startServer();
