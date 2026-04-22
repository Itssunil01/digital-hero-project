import { Request, Response } from "express";
import crypto from "crypto";
import { razorpay } from "../config/razorpay";

// ✅ CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
    console.log("🔥 HIT create-order route"); 
  try {
    const { amount } = req.body as { amount: number };

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

// ✅ VERIFY PAYMENT
export const verifyPayment = (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    }

    return res.status(400).json({ success: false });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};