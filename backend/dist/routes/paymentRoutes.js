"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
console.log("Payment routes loaded");
const router = (0, express_1.Router)();
router.post("/create-order", paymentController_1.createOrder);
router.post("/verify", paymentController_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map