"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = require("../config/razorpay");
// ✅ CREATE ORDER
const createOrder = async (req, res) => {
    console.log("🔥 HIT create-order route");
    try {
        const { amount } = req.body;
        const order = await razorpay_1.razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
};
exports.createOrder = createOrder;
// ✅ VERIFY PAYMENT
const verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        if (expectedSignature === razorpay_signature) {
            return res.json({ success: true });
        }
        return res.status(400).json({ success: false });
    }
    catch (err) {
        return res.status(500).json({ success: false });
    }
};
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=paymentController.js.map