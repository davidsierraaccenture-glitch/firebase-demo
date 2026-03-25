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
