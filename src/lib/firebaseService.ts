import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order } from "../types";

// Products
export const getProducts = async () => {
  const q = query(collection(db, "products"), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const getProductById = async (id: string) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as any;
  }
  return null;
};

export const addProduct = async (product: any) => {
  return await addDoc(collection(db, "products"), {
    ...product,
    created_at: serverTimestamp()
  });
};

export const updateProduct = async (id: string, product: any) => {
  const docRef = doc(db, "products", id);
  return await updateDoc(docRef, product);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  return await deleteDoc(docRef);
};

// Categories
export const getCategories = async () => {
  const q = query(collection(db, "categories"), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const addCategory = async (name: string) => {
  return await addDoc(collection(db, "categories"), {
    name,
    created_at: serverTimestamp()
  });
};

export const updateCategory = async (id: string, name: string) => {
  const docRef = doc(db, "categories", id);
  return await updateDoc(docRef, { name });
};

export const deleteCategory = async (id: string) => {
  const docRef = doc(db, "categories", id);
  return await deleteDoc(docRef);
};

// Orders
export const createOrder = async (orderData: any) => {
  const batch = writeBatch(db);
  
  // 1. Create Order
  const orderRef = doc(collection(db, "orders"));
  batch.set(orderRef, {
    ...orderData,
    status: 'pending',
    created_at: serverTimestamp()
  });

  // 2. Update Stock for each item
  for (const item of orderData.items) {
    const productRef = doc(db, "products", item.id);
    batch.update(productRef, {
      stock: increment(-item.quantity)
    });
  }

  await batch.commit();
  return orderRef.id;
};

export const getOrders = async () => {
  const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const updateOrderStatus = async (id: string, status: string) => {
  const docRef = doc(db, "orders", id);
  return await updateDoc(docRef, { status });
};

// Stats
export const getAdminStats = async () => {
  const products = await getProducts();
  const orders = await getOrders();
  
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => {
    const date = o.created_at?.seconds ? new Date(o.created_at.seconds * 1000) : new Date(o.created_at);
    return date.toDateString() === today && o.status !== 'cancelled';
  });

  const todaySales = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Unique customers by email
  const customerEmails = new Set(orders.map(o => o.customer_email).filter(Boolean));

  // Inventory alerts (stock < 5)
  const lowStockProducts = products.filter(p => (p.stock || 0) < 5);

  // Pending orders alert (pending for more than 24 hours)
  const now = new Date();
  const oldPendingOrders = orders.filter(o => {
    if (o.status !== 'pending') return false;
    const date = o.created_at?.seconds ? new Date(o.created_at.seconds * 1000) : new Date(o.created_at);
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  });

  return {
    totalSales,
    todaySales,
    todayOrderCount: todayOrders.length,
    orderCount: orders.length,
    productCount: products.length,
    customerCount: customerEmails.size,
    recentOrders: orders.slice(0, 5),
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 3),
    oldPendingCount: oldPendingOrders.length
  };
};

// Seeding
export const seedDatabase = async () => {
  const products = await getProducts();
  if (products.length > 0) return;

  const categories = ["ตุ๊กตาผ้า", "ตุ๊กตาแฟนซี", "ตุ๊กตาอนิเมะ", "ตุ๊กตาสั่งทำพิเศษ", "เซตของขวัญ"];
  for (const name of categories) {
    await addCategory(name);
  }

  const initialProducts = [
    { name: "น้องหมีนุ่มนิ่ม", description: "ตุ๊กตาหมีสีน้ำตาล ขนนุ่มพิเศษ กอดอุ่น", price: 450, category: "ตุ๊กตาผ้า", theme: "สัตว์", size: "M", stock: 20, image_url: "https://picsum.photos/seed/bear/400/400", is_featured: 1 },
    { name: "กระต่ายหูยาว", description: "ตุ๊กตากระต่ายสีชมพู หูยาวน่ารัก", price: 390, category: "ตุ๊กตาผ้า", theme: "สัตว์", size: "S", stock: 15, image_url: "https://picsum.photos/seed/rabbit/400/400", is_featured: 1 },
    { name: "ยูนิคอร์นสายรุ้ง", description: "ตุ๊กตายูนิคอร์นสีพาสเทล มีเขาประกาย", price: 590, category: "ตุ๊กตาแฟนซี", theme: "แฟนตาซี", size: "L", stock: 10, image_url: "https://picsum.photos/seed/unicorn/400/400", is_featured: 1 },
    { name: "แมวน้อยจอมซน", description: "ตุ๊กตาแมวสีเทา หน้าตากวนๆ", price: 320, category: "ตุ๊กตาผ้า", theme: "สัตว์", size: "S", stock: 25, image_url: "https://picsum.photos/seed/cat/400/400", is_featured: 0 },
    { name: "ไดโนเสาร์เขียว", description: "ตุ๊กตาไดโนเสาร์ ทีเร็กซ์ แต่ใจดี", price: 480, category: "ตุ๊กตาแฟนซี", theme: "สัตว์ดึกดำบรรพ์", size: "M", stock: 12, image_url: "https://picsum.photos/seed/dino/400/400", is_featured: 0 },
    { name: "ตุ๊กตาเด็กผู้หญิง (Custom)", description: "ตุ๊กตาผ้าสั่งทำพิเศษ ปักชื่อได้", price: 750, category: "ตุ๊กตาสั่งทำพิเศษ", theme: "ของขวัญ", size: "L", stock: 5, image_url: "https://picsum.photos/seed/doll/400/400", is_featured: 1 }
  ];

  for (const p of initialProducts) {
    await addProduct(p);
  }
};
