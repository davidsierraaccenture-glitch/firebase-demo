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
  console.log(`  ${reviews.length} reviews`);
  console.log(`  1 config document`);
}

seed().catch(console.error);
