// Updated by Autonomous Agent to support coupon discounts and cart validation
class CartService {
  constructor() {
    this.carts = new Map();
    this.COUPONS = new Map([
      ['SAVE20', { type: 'percent', value: 20, minOrderInCents: 1000 }],
      ['FLAT10', { type: 'flat', valueInCents: 1000, minOrderInCents: 1500 }]
    ]);
  }

  getCart(cartId) {
    if (!this.carts.has(cartId)) {
      this.carts.set(cartId, {
        items: [],
        subtotalInCents: 0,
        discountInCents: 0,
        totalInCents: 0,
        appliedCoupon: null
      });
    }
    return this.carts.get(cartId);
  }

  addItem(cartId, { productId, quantity, priceInCents }) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }
    if (!Number.isInteger(priceInCents) || priceInCents <= 0) {
      throw new Error("Price must be a positive integer in cents");
    }

    const cart = this.getCart(cartId);
    cart.items.push({ productId, quantity, priceInCents });
    cart.subtotalInCents += quantity * priceInCents;
    this._recalculateTotals(cart);
    return cart;
  }

  applyDiscountCode(cartId, couponCode) {
    const cart = this.getCart(cartId);
    if (!couponCode || typeof couponCode !== 'string') {
      throw new Error("Invalid coupon code format");
    }

    const normalizedCode = couponCode.trim().toUpperCase();
    if (!this.COUPONS.has(normalizedCode)) {
      throw new Error(`Coupon code '${couponCode}' is not valid`);
    }

    const promo = this.COUPONS.get(normalizedCode);
    if (cart.subtotalInCents < promo.minOrderInCents) {
      throw new Error(`Order subtotal does not meet minimum requirement of ${promo.minOrderInCents} cents`);
    }

    cart.appliedCoupon = normalizedCode;
    if (promo.type === 'percent') {
      cart.discountInCents = Math.round((cart.subtotalInCents * promo.value) / 100);
    } else if (promo.type === 'flat') {
      cart.discountInCents = promo.valueInCents;
    }

    this._recalculateTotals(cart);
    return cart;
  }

  _recalculateTotals(cart) {
    // Strict floor guard at 0 cents
    cart.totalInCents = Math.max(0, cart.subtotalInCents - cart.discountInCents);
  }
}

module.exports = new CartService();
