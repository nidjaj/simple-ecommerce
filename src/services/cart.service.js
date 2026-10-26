class CartService {
  constructor() {
    this.carts = new Map(); // cartId -> { items: [], discountCode: null }
  }

  getCart(cartId) {
    if (!this.carts.has(cartId)) {
      this.carts.set(cartId, { items: [], subtotalInCents: 0, discountInCents: 0, totalInCents: 0 });
    }
    return this.carts.get(cartId);
  }

  addItem(cartId, { productId, quantity, priceInCents }) {
    const cart = this.getCart(cartId);
    cart.items.push({ productId, quantity, priceInCents });
    cart.subtotalInCents += quantity * priceInCents;
    cart.totalInCents = cart.subtotalInCents - cart.discountInCents;
    return cart;
  }
}

module.exports = new CartService();