// ============================================================================
// E-COMMERCE DATABASE - MONGODB SCHEMA
// Tech: Node.js + Express + TypeScript + MongoDB + Mongoose
// ============================================================================

import mongoose from 'mongoose';

// ============================================================================
// CONSTANTS - Type Safety (thay thế ENUM)
// ============================================================================

export const USER_ROLES = ['user', 'seller', 'admin'];
export const USER_STATUS = ['active', 'inactive', 'suspended'];
export const PRODUCT_STATUS = ['active', 'inactive', 'out_of_stock'];
export const ORDER_STATUS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
export const PAYMENT_METHODS = ['cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay', 'credit_card'];
export const PAYMENT_STATUS = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];
export const DISCOUNT_TYPES = ['percentage', 'fixed'];
export const NOTIFICATION_TYPES = ['order', 'promotion', 'review', 'system', 'payment'];

// ============================================================================
// 1. USERS & AUTH
// ============================================================================

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    maxlength: 100 
  },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true, maxlength: 50 },
  fullName: { type: String, required: true, maxlength: 100 },
  phone: { type: String, maxlength: 15 },
  address: { type: String },
  avatar: { type: String },
  role: { 
    type: String, 
    enum: USER_ROLES, 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: USER_STATUS, 
    default: 'active' 
  },
  emailVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
  deletedAt: { type: Date, default: null }
}, { 
  timestamps: true // auto createdAt, updatedAt
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ deletedAt: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model('User', userSchema);

// ============================================================================

const resetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

resetTokenSchema.index({ token: 1 });
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// ============================================================================

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, maxlength: 100 },
  expiresAt: { type: Date, required: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

blacklistedTokenSchema.index({ token: 1 });
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

// ============================================================================
// 2. PRODUCTS
// ============================================================================

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, maxlength: 100 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

export const Category = mongoose.model('Category', categorySchema);

// ============================================================================

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, maxlength: 200 },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true, sparse: true, maxlength: 100 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: PRODUCT_STATUS, 
    default: 'active' 
  },
  viewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  images: [{
    imageUrl: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  }],
  deletedAt: { type: Date, default: null }
}, { 
  timestamps: true 
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ deletedAt: 1 });
productSchema.index({ sellerId: 1 });

// Validation: discountPrice < price
productSchema.pre('save', function(next) {
  if (this.discountPrice && this.discountPrice >= this.price) {
    return next(new Error('Discount price must be less than price'));
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);

// ============================================================================
// 3. SHOPPING
// ============================================================================

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { 
  timestamps: true 
});

// Unique constraint
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });
cartItemSchema.index({ userId: 1 });

export const CartItem = mongoose.model('CartItem', cartItemSchema);

// ============================================================================

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

// Unique constraint
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1 });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// ============================================================================
// 4. ORDERS
// ============================================================================

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, maxlength: 50 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Shipping info - embedded
  shipping: {
    name: { type: String, required: true, maxlength: 100 },
    phone: { type: String, required: true, maxlength: 15 },
    address: { type: String, required: true }
  },
  
  // Pricing
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  paymentMethod: { 
    type: String, 
    enum: PAYMENT_METHODS, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ORDER_STATUS, 
    default: 'pending' 
  },
  
  note: { type: String },
  
  // Order items - embedded
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true, maxlength: 200 },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  
  deletedAt: { type: Date, default: null }
}, { 
  timestamps: true 
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ deletedAt: 1 });

// Middleware: Update sold_count when order is delivered
orderSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'delivered') {
    // Update sold count for all products in order
    const Product = mongoose.model('Product');
    for (const item of this.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { soldCount: item.quantity } }
      );
    }
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);

// ============================================================================
// 5. PAYMENTS
// ============================================================================

const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: String, required: true, unique: true, maxlength: 50 },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  
  // Payment info
  amount: { type: Number, required: true },
  currency: { type: String, default: 'VND', maxlength: 3 },
  paymentMethod: { 
    type: String, 
    enum: PAYMENT_METHODS, 
    required: true 
  },
  paymentGateway: { type: String, maxlength: 50 },
  status: { 
    type: String, 
    enum: PAYMENT_STATUS, 
    default: 'pending' 
  },
  
  // Transaction details
  transactionId: { type: String, maxlength: 100 },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed }, // JSON object
  
  // Timestamps
  paidAt: { type: Date },
  failedAt: { type: Date },
  failureReason: { type: String }
}, { 
  timestamps: true 
});

// Indexes
paymentSchema.index({ paymentNumber: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);

// ============================================================================
// 6. REVIEWS
// ============================================================================

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  isApproved: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null }
}, { 
  timestamps: true 
});

// Unique constraint
reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });
reviewSchema.index({ productId: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ userId: 1 });

export const Review = mongoose.model('Review', reviewSchema);

// ============================================================================
// 7. COUPONS
// ============================================================================

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, maxlength: 50, uppercase: true },
  discountType: { 
    type: String, 
    enum: DISCOUNT_TYPES, 
    required: true 
  },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

// Validation: endDate > startDate
couponSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, endDate: 1 });

export const Coupon = mongoose.model('Coupon', couponSchema);

// ============================================================================
// 8. NOTIFICATIONS
// ============================================================================

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: NOTIFICATION_TYPES, 
    required: true 
  },
  isRead: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Generate order number
export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${year}${month}${day}${random}`;
};

// Generate payment number
export const generatePaymentNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PY${year}${month}${day}${random}`;
};