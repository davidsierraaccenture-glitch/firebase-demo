const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp({projectId: "fir-demo-69c51"});
const db = getFirestore();

const users = [
  {id: "user1", name: "Alice Johnson", email: "alice@acmeshop.com", role: "admin", active: true, orderCount: 2, phone: "+1 212-555-0101", address: {street: "350 Fifth Ave", city: "New York", state: "NY", zip: "10118"}, createdAt: new Date("2025-01-15")},
  {id: "user2", name: "Bob Martinez", email: "bob@acmeshop.com", role: "customer", active: true, orderCount: 1, phone: "+1 310-555-0102", address: {street: "100 Universal City Plaza", city: "Los Angeles", state: "CA", zip: "91608"}, createdAt: new Date("2025-02-20")},
  {id: "user3", name: "Carol Chen", email: "carol@acmeshop.com", role: "customer", active: true, orderCount: 0, phone: "+1 312-555-0103", address: {street: "233 S Wacker Dr", city: "Chicago", state: "IL", zip: "60606"}, createdAt: new Date("2025-03-10")},
  {id: "user4", name: "Dan Rivera", email: "dan@acmeshop.com", role: "editor", active: true, orderCount: 3, phone: "+1 512-555-0104", address: {street: "1100 Congress Ave", city: "Austin", state: "TX", zip: "78701"}, createdAt: new Date("2025-04-05")},
  {id: "user5", name: "Eve Park", email: "eve@acmeshop.com", role: "customer", active: false, orderCount: 1, phone: "+1 206-555-0105", address: {street: "400 Broad St", city: "Seattle", state: "WA", zip: "98109"}, createdAt: new Date("2025-05-18")},
];

const products = [
  {id: "prod1", name: "Wireless Headphones", price: 59.99, category: "electronics", stock: 150, active: true, description: "Premium Bluetooth over-ear headphones with active noise cancellation and 30-hour battery life.", tags: ["bluetooth", "audio", "wireless"], rating: 4.5, reviewCount: 2, imageUrl: ""},
  {id: "prod2", name: "Ceramic Coffee Mug", price: 14.99, category: "kitchen", stock: 300, active: true, description: "Handcrafted 12oz ceramic mug. Microwave and dishwasher safe.", tags: ["ceramic", "coffee", "kitchen"], rating: 4.8, reviewCount: 2, imageUrl: ""},
  {id: "prod3", name: "Running Shoes", price: 89.99, category: "sports", stock: 75, active: true, description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.", tags: ["running", "shoes", "fitness"], rating: 4.3, reviewCount: 1, imageUrl: ""},
  {id: "prod4", name: "Notebook Set", price: 18.99, category: "office", stock: 500, active: true, description: "Set of 3 premium lined notebooks. A5 size, 80gsm acid-free paper.", tags: ["stationery", "office", "writing"], rating: 4.6, reviewCount: 0, imageUrl: ""},
  {id: "prod5", name: "LED Desk Lamp", price: 34.99, category: "office", stock: 200, active: true, description: "Adjustable LED desk lamp with 5 brightness levels and USB charging port.", tags: ["lighting", "LED", "office"], rating: 4.7, reviewCount: 1, imageUrl: ""},
  {id: "prod6", name: "Laptop Backpack", price: 49.99, category: "accessories", stock: 0, active: false, description: "Water-resistant backpack with padded compartment for laptops up to 15 inches.", tags: ["backpack", "laptop", "travel"], rating: 4.1, reviewCount: 0, imageUrl: ""},
  // Electronics
  {id: "prod7", name: "Bluetooth Speaker", price: 39.99, category: "electronics", stock: 120, active: true, description: "Portable waterproof Bluetooth speaker with 12-hour battery and deep bass.", tags: ["bluetooth", "audio", "portable"], rating: 4.4, reviewCount: 3, imageUrl: ""},
  {id: "prod8", name: "USB-C Hub", price: 29.99, category: "electronics", stock: 250, active: true, description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.", tags: ["usb", "hub", "adapter"], rating: 4.6, reviewCount: 5, imageUrl: ""},
  {id: "prod9", name: "Wireless Mouse", price: 24.99, category: "electronics", stock: 400, active: true, description: "Ergonomic wireless mouse with silent clicks and adjustable DPI.", tags: ["mouse", "wireless", "ergonomic"], rating: 4.2, reviewCount: 2, imageUrl: ""},
  {id: "prod10", name: "Mechanical Keyboard", price: 79.99, category: "electronics", stock: 60, active: true, description: "Compact mechanical keyboard with RGB backlighting and hot-swappable switches.", tags: ["keyboard", "mechanical", "RGB"], rating: 4.8, reviewCount: 7, imageUrl: ""},
  // Kitchen
  {id: "prod11", name: "French Press", price: 22.99, category: "kitchen", stock: 180, active: true, description: "Stainless steel French press coffee maker. Brews 4 cups in 4 minutes.", tags: ["coffee", "french press", "stainless steel"], rating: 4.5, reviewCount: 4, imageUrl: ""},
  {id: "prod12", name: "Cutting Board Set", price: 28.99, category: "kitchen", stock: 90, active: true, description: "Set of 3 bamboo cutting boards in small, medium, and large sizes.", tags: ["bamboo", "cutting board", "cooking"], rating: 4.7, reviewCount: 2, imageUrl: ""},
  {id: "prod13", name: "Water Bottle", price: 19.99, category: "kitchen", stock: 350, active: true, description: "Insulated stainless steel water bottle. Keeps drinks cold 24hrs or hot 12hrs.", tags: ["water bottle", "insulated", "stainless steel"], rating: 4.6, reviewCount: 6, imageUrl: ""},
  // Sports
  {id: "prod14", name: "Yoga Mat", price: 34.99, category: "sports", stock: 200, active: true, description: "Non-slip yoga mat with alignment lines. 6mm thick, eco-friendly TPE.", tags: ["yoga", "fitness", "mat"], rating: 4.4, reviewCount: 3, imageUrl: ""},
  {id: "prod15", name: "Resistance Bands", price: 16.99, category: "sports", stock: 500, active: true, description: "Set of 5 resistance bands with different tension levels. Includes carry bag.", tags: ["resistance", "fitness", "bands"], rating: 4.3, reviewCount: 4, imageUrl: ""},
  {id: "prod16", name: "Jump Rope", price: 12.99, category: "sports", stock: 300, active: true, description: "Adjustable speed jump rope with ball bearings and foam grip handles.", tags: ["cardio", "jump rope", "fitness"], rating: 4.1, reviewCount: 1, imageUrl: ""},
  {id: "prod17", name: "Dumbbell Set", price: 64.99, category: "sports", stock: 0, active: false, description: "Adjustable dumbbell set from 5 to 25 lbs with storage tray.", tags: ["weights", "dumbbell", "strength"], rating: 4.5, reviewCount: 2, imageUrl: ""},
  // Office
  {id: "prod18", name: "Monitor Stand", price: 44.99, category: "office", stock: 130, active: true, description: "Bamboo monitor riser with storage drawer and phone holder.", tags: ["monitor", "desk", "organization"], rating: 4.7, reviewCount: 3, imageUrl: ""},
  {id: "prod19", name: "Desk Organizer", price: 21.99, category: "office", stock: 220, active: true, description: "Mesh desk organizer with 6 compartments for pens, supplies, and files.", tags: ["organizer", "desk", "storage"], rating: 4.3, reviewCount: 1, imageUrl: ""},
  {id: "prod20", name: "Whiteboard", price: 32.99, category: "office", stock: 85, active: true, description: "Magnetic dry-erase whiteboard 24x36 inches. Includes markers and eraser.", tags: ["whiteboard", "office", "planning"], rating: 4.4, reviewCount: 2, imageUrl: ""},
  // Accessories
  {id: "prod21", name: "Sunglasses", price: 27.99, category: "accessories", stock: 175, active: true, description: "Polarized UV400 sunglasses with lightweight metal frame.", tags: ["sunglasses", "UV protection", "polarized"], rating: 4.2, reviewCount: 3, imageUrl: ""},
  {id: "prod22", name: "Leather Wallet", price: 35.99, category: "accessories", stock: 140, active: true, description: "Slim RFID-blocking leather wallet with 8 card slots and ID window.", tags: ["wallet", "leather", "RFID"], rating: 4.6, reviewCount: 4, imageUrl: ""},
  {id: "prod23", name: "Phone Case", price: 15.99, category: "accessories", stock: 600, active: true, description: "Shockproof clear phone case with raised edges for camera protection.", tags: ["phone", "case", "protection"], rating: 4.0, reviewCount: 2, imageUrl: ""},
  {id: "prod24", name: "Travel Mug", price: 18.99, category: "accessories", stock: 0, active: false, description: "Leak-proof travel mug with one-hand open lid. Fits most cup holders.", tags: ["travel", "mug", "insulated"], rating: 4.3, reviewCount: 1, imageUrl: ""},
];

const orders = [
  {id: "order1", userId: "user1", items: [{productId: "prod1", name: "Wireless Headphones", quantity: 1, unitPrice: 59.99}, {productId: "prod2", name: "Ceramic Coffee Mug", quantity: 2, unitPrice: 14.99}], subtotal: 89.97, tax: 7.20, total: 97.17, status: "delivered", customer: {name: "Alice Johnson", email: "alice@acmeshop.com", address: {street: "350 Fifth Ave", city: "New York", state: "NY", zip: "10118"}}, createdAt: new Date("2025-06-01"), updatedAt: new Date("2025-06-05")},
  {id: "order2", userId: "user1", items: [{productId: "prod4", name: "Notebook Set", quantity: 3, unitPrice: 18.99}], subtotal: 56.97, tax: 4.56, total: 61.53, status: "shipped", customer: {name: "Alice Johnson", email: "alice@acmeshop.com", address: {street: "350 Fifth Ave", city: "New York", state: "NY", zip: "10118"}}, createdAt: new Date("2025-06-15"), updatedAt: new Date("2025-06-17")},
  {id: "order3", userId: "user2", items: [{productId: "prod3", name: "Running Shoes", quantity: 1, unitPrice: 89.99}], subtotal: 89.99, tax: 7.20, total: 97.19, status: "processing", customer: {name: "Bob Martinez", email: "bob@acmeshop.com", address: {street: "100 Universal City Plaza", city: "Los Angeles", state: "CA", zip: "91608"}}, createdAt: new Date("2025-07-02"), updatedAt: new Date("2025-07-02")},
  {id: "order4", userId: "user4", items: [{productId: "prod5", name: "LED Desk Lamp", quantity: 2, unitPrice: 34.99}, {productId: "prod2", name: "Ceramic Coffee Mug", quantity: 1, unitPrice: 14.99}], subtotal: 84.97, tax: 6.80, total: 91.77, status: "delivered", customer: {name: "Dan Rivera", email: "dan@acmeshop.com", address: {street: "1100 Congress Ave", city: "Austin", state: "TX", zip: "78701"}}, createdAt: new Date("2025-07-10"), updatedAt: new Date("2025-07-14")},
  {id: "order5", userId: "user4", items: [{productId: "prod1", name: "Wireless Headphones", quantity: 1, unitPrice: 59.99}], subtotal: 59.99, tax: 4.80, total: 64.79, status: "delivered", customer: {name: "Dan Rivera", email: "dan@acmeshop.com", address: {street: "1100 Congress Ave", city: "Austin", state: "TX", zip: "78701"}}, createdAt: new Date("2025-07-20"), updatedAt: new Date("2025-07-24")},
];

const reviews = [
  {productId: "prod1", id: "rev1", userName: "Alice Johnson", rating: 5, comment: "Incredible sound quality and the noise cancellation is top-notch. Best headphones I've owned.", createdAt: new Date("2025-06-10")},
  {productId: "prod1", id: "rev2", userName: "Dan Rivera", rating: 4, comment: "Great headphones overall. Battery lasts forever. Slightly tight fit at first.", createdAt: new Date("2025-07-25")},
  {productId: "prod2", id: "rev3", userName: "Alice Johnson", rating: 5, comment: "Beautiful mug, perfect size for my morning coffee. Keeps it warm too!", createdAt: new Date("2025-06-08")},
  {productId: "prod2", id: "rev4", userName: "Dan Rivera", rating: 5, comment: "Bought this as a gift and they loved it. Very well made.", createdAt: new Date("2025-07-18")},
  {productId: "prod3", id: "rev5", userName: "Bob Martinez", rating: 4, comment: "Light and comfortable. Ran a half marathon in these no problem.", createdAt: new Date("2025-07-10")},
  {productId: "prod5", id: "rev6", userName: "Dan Rivera", rating: 5, comment: "The USB port is a game changer. Great lamp for late night work.", createdAt: new Date("2025-07-20")},
  {productId: "prod7", id: "rev7", userName: "Bob Martinez", rating: 5, comment: "Took this to the beach and the sound was amazing. Waterproof too!", createdAt: new Date("2025-08-01")},
  {productId: "prod7", id: "rev8", userName: "Carol Chen", rating: 4, comment: "Good bass for the size. Battery lasts all day.", createdAt: new Date("2025-08-05")},
  {productId: "prod7", id: "rev9", userName: "Eve Park", rating: 4, comment: "Pairs easily with my phone. Great value.", createdAt: new Date("2025-08-10")},
  {productId: "prod8", id: "rev10", userName: "Alice Johnson", rating: 5, comment: "Finally one hub that does everything. HDMI works perfectly.", createdAt: new Date("2025-08-02")},
  {productId: "prod8", id: "rev11", userName: "Dan Rivera", rating: 5, comment: "Essential for my MacBook. SD card reader is fast.", createdAt: new Date("2025-08-08")},
  {productId: "prod10", id: "rev12", userName: "Carol Chen", rating: 5, comment: "The typing feel is incredible. RGB looks great.", createdAt: new Date("2025-08-12")},
  {productId: "prod10", id: "rev13", userName: "Alice Johnson", rating: 5, comment: "Hot-swap switches are a game changer. Love customizing it.", createdAt: new Date("2025-08-15")},
  {productId: "prod11", id: "rev14", userName: "Bob Martinez", rating: 4, comment: "Makes great coffee. Cleanup is a breeze.", createdAt: new Date("2025-08-03")},
  {productId: "prod11", id: "rev15", userName: "Eve Park", rating: 5, comment: "Best French press I've used. Sturdy stainless steel.", createdAt: new Date("2025-08-11")},
  {productId: "prod13", id: "rev16", userName: "Carol Chen", rating: 5, comment: "Keeps water ice cold all day at the gym.", createdAt: new Date("2025-08-04")},
  {productId: "prod13", id: "rev17", userName: "Dan Rivera", rating: 4, comment: "Great bottle but a bit heavy when full.", createdAt: new Date("2025-08-09")},
  {productId: "prod14", id: "rev18", userName: "Alice Johnson", rating: 5, comment: "Non-slip grip is excellent. Alignment lines help with poses.", createdAt: new Date("2025-08-06")},
  {productId: "prod14", id: "rev19", userName: "Eve Park", rating: 4, comment: "Good thickness, comfortable on hardwood floors.", createdAt: new Date("2025-08-14")},
  {productId: "prod15", id: "rev20", userName: "Bob Martinez", rating: 4, comment: "Great variety of resistance levels. Perfect for travel workouts.", createdAt: new Date("2025-08-07")},
  {productId: "prod18", id: "rev21", userName: "Dan Rivera", rating: 5, comment: "Looks great on my desk. Drawer is super handy.", createdAt: new Date("2025-08-13")},
  {productId: "prod22", id: "rev22", userName: "Alice Johnson", rating: 5, comment: "Slim but holds everything. RFID blocking is a nice touch.", createdAt: new Date("2025-08-16")},
  {productId: "prod22", id: "rev23", userName: "Bob Martinez", rating: 4, comment: "Quality leather, smells great. Cards slide in easily.", createdAt: new Date("2025-08-18")},
];

const config = {
  storeName: "Acme Shop",
  currency: "USD",
  taxRate: 0.08,
  freeShippingThreshold: 50,
  shippingMethods: ["standard", "express", "next_day"],
  paymentMethods: ["credit_card", "debit_card", "paypal"],
  maintenance: false,
  version: "1.0.0",
  updatedAt: new Date("2025-08-01"),
};

async function seed() {
  console.log("Seeding Firestore for Acme Shop...\n");

  console.log("--- Users ---");
  for (const user of users) {
    const {id, ...data} = user;
    await db.collection("users").doc(id).set(data);
    console.log(`  ${data.name} (${data.role})`);
  }

  console.log("\n--- Products ---");
  for (const product of products) {
    const {id, ...data} = product;
    await db.collection("products").doc(id).set(data);
    console.log(`  ${data.name} — $${data.price}`);
  }

  console.log("\n--- Orders ---");
  for (const order of orders) {
    const {id, ...data} = order;
    await db.collection("orders").doc(id).set(data);
    console.log(`  ${id}: $${data.total} (${data.status})`);
  }

  console.log("\n--- Reviews ---");
  for (const review of reviews) {
    const {productId, id, ...data} = review;
    await db.collection("products").doc(productId).collection("reviews").doc(id).set(data);
    console.log(`  ${data.userName} → ${productId} (${data.rating}/5)`);
  }

  console.log("\n--- Config ---");
  await db.collection("config").doc("general").set(config);
  console.log(`  ${config.storeName} (${config.currency})`);

  console.log("\nDone! Seeded:");
  console.log(`  ${users.length} users`);
  console.log(`  ${products.length} products`);
  console.log(`  ${orders.length} orders`);
  console.log(`  ${reviews.length} reviews (across multiple products)`);
  console.log(`  1 config document`);
}

seed().catch(console.error);
