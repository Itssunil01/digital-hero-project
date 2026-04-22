import { Router } from "express";
import { createOrder, verifyPayment } from "../controller/paymentController"

console.log("Payment routes loaded")

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;