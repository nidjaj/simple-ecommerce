const assert = require('node:assert');
const cartService = require('../src/services/cart.service');
const checkoutService = require('../src/services/checkout.service');

describe('Ecommerce Cart & Coupon Validation', () => {
  it('should apply percentage discount correctly (SAVE20)', () => {
    const cartId = 'test_cart_1';
    cartService.addItem(cartId, { productId: 'p1', quantity: 2, priceInCents: 1000 }); // $20.00
    const cart = cartService.applyDiscountCode(cartId, 'save20');
    assert.strictEqual(cart.appliedCoupon, 'SAVE20');
    assert.strictEqual(cart.discountInCents, 400); // 20% of 2000 = 400
    assert.strictEqual(cart.totalInCents, 1600); // 2000 - 400 = 1600
  });

  it('should enforce 0 cents floor on flat discount', () => {
    const cartId = 'test_cart_2';
    cartService.addItem(cartId, { productId: 'p2', quantity: 1, priceInCents: 1500 });
    const cart = cartService.applyDiscountCode(cartId, 'FLAT10');
    assert.strictEqual(cart.discountInCents, 1000);
    assert.strictEqual(cart.totalInCents, 500);
  });

  it('should reject invalid promo codes', () => {
    const cartId = 'test_cart_3';
    cartService.addItem(cartId, { productId: 'p3', quantity: 1, priceInCents: 2000 });
    assert.throws(() => {
      cartService.applyDiscountCode(cartId, 'EXPIRED_CODE');
    }, /not valid/);
  });
});
