"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razorpay_1 = require("../config/razorpay");
const router = (0, express_1.Router)();
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay_1.razorpay.orders.create({
            amount: amount * 100, // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
        res.json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
});
exports.default = router;
//# sourceMappingURL=payment.js.map