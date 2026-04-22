const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");
const {initializeApp} = require("firebase-admin/app");

initializeApp();
setGlobalOptions({maxInstances: 10});

const db = getFirestore();

// Helper: verify Firebase Auth token from Authorization header
async function getUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    return await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
  } catch {
    return null;
  }
}

// --- REST API ---
exports.api = onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const segments = req.path.split("/").filter(Boolean);
  // segments after /api: e.g. ["products"] or ["products", "prod1"] or ["products", "prod1", "reviews"]
  const route = segments.join("/");

  try {
    // GET /api/config
    if (req.method === "GET" && route === "config") {
      const doc = await db.collection("config").doc("general").get();
      res.json(doc.exists ? {id: doc.id, ...doc.data()} : {});
      return;
    }

    // GET /api/products
    if (req.method === "GET" && route === "products") {
      const snapshot = await db.collection("products").where("active", "==", true).get();
      const products = snapshot.docs.map((d) => ({id: d.id, ...d.data()}));
      res.json({total: products.length, data: products});
      return;
    }

    // GET /api/products/:id
    if (req.method === "GET" && segments[0] === "products" && segments.length === 2) {
      const doc = await db.collection("products").doc(segments[1]).get();
      if (!doc.exists) {
        res.status(404).json({error: "Product not found"});
        return;
      }
      // Also fetch reviews
      const reviewSnap = await doc.ref.collection("reviews").orderBy("createdAt", "desc").get();
      const reviews = reviewSnap.docs.map((d) => ({id: d.id, ...d.data()}));
      res.json({id: doc.id, ...doc.data(), reviews});
      return;
    }

    // GET /api/products/:id/reviews
    if (req.method === "GET" && segments[0] === "products" && segments[2] === "reviews" && segments.length === 3) {
      const reviewSnap = await db.collection("products").doc(segments[1]).collection("reviews").orderBy("createdAt", "desc").get();
      const reviews = reviewSnap.docs.map((d) => ({id: d.id, ...d.data()}));
      res.json({total: reviews.length, data: reviews});
      return;
    }

    // POST /api/reviews (requires auth)
    if (req.method === "POST" && route === "reviews") {
      const user = await getUser(req);
      if (!user) {
        res.status(401).json({error: "Sign in required to submit a review"});
        return;
      }
      const {productId, userName, rating, comment} = req.body;
      if (!productId || !userName || !rating || !comment) {
        res.status(400).json({error: "Missing required fields: productId, userName, rating, comment"});
        return;
      }
      if (rating < 1 || rating > 5) {
        res.status(400).json({error: "Rating must be between 1 and 5"});
        return;
      }

      const productRef = db.collection("products").doc(productId);

      // Use a transaction to add review and update product rating
      const result = await db.runTransaction(async (t) => {
        const productDoc = await t.get(productRef);
        if (!productDoc.exists) throw new Error("Product not found");

        const product = productDoc.data();
        const oldCount = product.reviewCount || 0;
        const oldRating = product.rating || 0;
        const newCount = oldCount + 1;
        const newRating = ((oldRating * oldCount) + rating) / newCount;

        const reviewRef = productRef.collection("reviews").doc();
        t.set(reviewRef, {
          userName,
          rating,
          comment,
          createdAt: new Date(),
        });
        t.update(productRef, {
          rating: Math.round(newRating * 10) / 10,
          reviewCount: newCount,
        });

        return {reviewId: reviewRef.id, newRating: Math.round(newRating * 10) / 10, newCount};
      });

      res.status(201).json({message: "Review added", ...result});
      return;
    }

    // POST /api/orders (requires auth)
    if (req.method === "POST" && route === "orders") {
      const user = await getUser(req);
      if (!user) {
        res.status(401).json({error: "Sign in required to place an order"});
        return;
      }
      const {items, customer, uid} = req.body;
      if (!items || !items.length || !customer) {
        res.status(400).json({error: "Missing required fields: items, customer"});
        return;
      }
      if (!customer.name || !customer.email) {
        res.status(400).json({error: "Customer must have name and email"});
        return;
      }

      // Look up product prices server-side
      const orderItems = [];
      let subtotal = 0;
      for (const item of items) {
        const productDoc = await db.collection("products").doc(item.productId).get();
        if (!productDoc.exists) {
          res.status(400).json({error: `Product not found: ${item.productId}`});
          return;
        }
        const product = productDoc.data();
        const lineTotal = product.price * item.quantity;
        orderItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        });
        subtotal += lineTotal;
      }

      // Get tax rate from config
      const configDoc = await db.collection("config").doc("general").get();
      const taxRate = configDoc.exists ? configDoc.data().taxRate : 0.08;
      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = Math.round((subtotal + tax) * 100) / 100;

      const order = {
        items: orderItems,
        customer: {
          name: customer.name,
          email: customer.email,
          address: customer.address || null,
        },
        uid: uid || null,
        subtotal,
        tax,
        total,
        status: "processing",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const ref = await db.collection("orders").add(order);

      // Update user's order count if uid is provided
      if (uid) {
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          await userRef.update({
            orderCount: FieldValue.increment(1),
          });
        }
      }

      logger.info(`Order created: ${ref.id}, total: $${total}, user: ${uid || "anonymous"}`);
      res.status(201).json({message: "Order placed", orderId: ref.id, ...order});
      return;
    }

    res.status(404).json({error: "Not found"});
  } catch (err) {
    logger.error("API error", err);
    res.status(500).json({error: err.message});
  }
});

// Health check
exports.healthCheck = onRequest((req, res) => {
  res.json({status: "ok", store: "Acme Shop", timestamp: new Date().toISOString()});
});

// Trigger: new order created
exports.onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data.data();
  const orderId = event.params.orderId;
  logger.info(`New order ${orderId}: $${order.total} (${order.items.length} items)`);

  await db.collection("notifications").add({
    type: "new_order",
    orderId,
    message: `New order from ${order.customer.name} — ${order.items.length} item(s), $${order.total}`,
    read: false,
    createdAt: new Date(),
  });
});

// Trigger: order updated
exports.onOrderUpdated = onDocumentUpdated("orders/{orderId}", async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.status !== after.status) {
    logger.info(`Order ${event.params.orderId}: ${before.status} → ${after.status}`);
  }
});
