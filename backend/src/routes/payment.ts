import { Router, Request, Response } from "express";
import { razorpay } from "../config/razorpay";

const router = Router();

router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { amount } = req.body as { amount: number };

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
});

export default router;