const {initializeApp} = require("firebase-admin/app");
const {getStorage} = require("firebase-admin/storage");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp({
  projectId: "fir-demo-69c51",
  storageBucket: "fir-demo-69c51.firebasestorage.app",
});

const bucket = getStorage().bucket();
const db = getFirestore();

const products = [
  {id: "prod1", name: "Wireless Headphones", color: "#4A90D9", icon: "🎧"},
  {id: "prod2", name: "Ceramic Coffee Mug", color: "#D4956A", icon: "☕"},
  {id: "prod3", name: "Running Shoes", color: "#5CB85C", icon: "👟"},
  {id: "prod4", name: "Notebook Set", color: "#8E6BB0", icon: "📓"},
  {id: "prod5", name: "LED Desk Lamp", color: "#F0AD4E", icon: "💡"},
  {id: "prod6", name: "Laptop Backpack", color: "#6C757D", icon: "🎒"},
  // Electronics
  {id: "prod7", name: "Bluetooth Speaker", color: "#3B7DD8", icon: "🔊"},
  {id: "prod8", name: "USB-C Hub", color: "#5A6B7E", icon: "🔌"},
  {id: "prod9", name: "Wireless Mouse", color: "#2D9CDB", icon: "🖱️"},
  {id: "prod10", name: "Mechanical Keyboard", color: "#1A1A2E", icon: "⌨️"},
  // Kitchen
  {id: "prod11", name: "French Press", color: "#8B6914", icon: "☕"},
  {id: "prod12", name: "Cutting Board Set", color: "#A0855B", icon: "🪵"},
  {id: "prod13", name: "Water Bottle", color: "#2EAFD3", icon: "💧"},
  // Sports
  {id: "prod14", name: "Yoga Mat", color: "#7B68AE", icon: "🧘"},
  {id: "prod15", name: "Resistance Bands", color: "#E94560", icon: "💪"},
  {id: "prod16", name: "Jump Rope", color: "#E67E22", icon: "🏃"},
  {id: "prod17", name: "Dumbbell Set", color: "#34495E", icon: "🏋️"},
  // Office
  {id: "prod18", name: "Monitor Stand", color: "#C19A6B", icon: "🖥️"},
  {id: "prod19", name: "Desk Organizer", color: "#7F8C8D", icon: "📎"},
  {id: "prod20", name: "Whiteboard", color: "#ECF0F1", icon: "📝"},
  // Accessories
  {id: "prod21", name: "Sunglasses", color: "#2C3E50", icon: "🕶️"},
  {id: "prod22", name: "Leather Wallet", color: "#6D4C41", icon: "👛"},
  {id: "prod23", name: "Phone Case", color: "#95A5A6", icon: "📱"},
  {id: "prod24", name: "Travel Mug", color: "#16A085", icon: "🥤"},
];

function generateSVG(name, color, icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" rx="12" fill="${color}"/>
  <rect x="20" y="20" width="360" height="360" rx="8" fill="white" opacity="0.15"/>
  <text x="200" y="180" font-size="80" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="200" y="270" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${name}</text>
  <text x="200" y="300" font-family="Arial, sans-serif" font-size="13" fill="white" opacity="0.7" text-anchor="middle">ACME SHOP</text>
</svg>`;
}

async function seed() {
  console.log("Uploading product images to Storage...\n");

  for (const product of products) {
    const svg = generateSVG(product.name, product.color, product.icon);
    const filePath = `products/${product.id}.svg`;
    const file = bucket.file(filePath);

    await file.save(Buffer.from(svg), {
      metadata: {contentType: "image/svg+xml"},
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    console.log(`  Uploaded: ${filePath}`);

    // Update product document with image URL
    await db.collection("products").doc(product.id).update({imageUrl: publicUrl});
    console.log(`  Updated: products/${product.id} → imageUrl`);
  }

  console.log(`\nDone! Uploaded ${products.length} product images.`);
}

seed().catch(console.error);
