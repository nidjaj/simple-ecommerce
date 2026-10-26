const cartService = require('./cart.service');

class CheckoutService {
  async processOrder({ cartId, customerEmail }) {
    const cart = cartService.getCart(cartId);
    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = {
      orderId: "ord_" + Math.random().toString(36).substring(2, 9),
      customerEmail,
      items: cart.items,
      subtotalInCents: cart.subtotalInCents,
      discountInCents: cart.discountInCents,
      totalInCents: cart.totalInCents,
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };

    return order;
  }
}

module.exports = new CheckoutService();