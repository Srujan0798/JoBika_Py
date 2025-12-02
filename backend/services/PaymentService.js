const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
        });
    }

    /**
     * Create a Razorpay Order
     * @param {number} amount - Amount in smallest currency unit (e.g., paise for INR)
     * @param {string} currency - Currency code (default: INR)
     * @param {string} receipt - Receipt ID
     */
    async createOrder(amount, currency = 'INR', receipt) {
        try {
            const options = {
                amount: amount,
                currency: currency,
                receipt: receipt
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Razorpay createOrder error:', error);
            throw new Error('Failed to create payment order');
        }
    }

    /**
     * Verify Payment Signature
     * @param {string} orderId - Razorpay Order ID
     * @param {string} paymentId - Razorpay Payment ID
     * @param {string} signature - Razorpay Signature
     */
    verifySignature(orderId, paymentId, signature) {
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    }
}

module.exports = new PaymentService();
