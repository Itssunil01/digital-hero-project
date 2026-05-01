import { Request, Response } from "express";

// 🔥 TEMP DATA (replace later with DB)
let payments: any[] = [
  {
    userId: 1,
    amount: 999,
    date: "2026-04-20",
    status: "success",
    paymentId: "pay_123ABC",
  },
];

let donations: any[] = [
  {
    userId: 1,
    charity: "Ocean Rescue",
    amount: 12400,
    progress: 65,
  },
];

export const getDashboard = (req: any, res: Response) => {
  const userId = req.user.id;

  const userPayments = payments.filter((p) => p.userId === userId);
  const userDonation = donations.find((d) => d.userId === userId);

  res.json({
    subscription: {
      plan: "Premium",
      status: "active",
    },
    donations: userDonation || null,
    payments: userPayments,
  });
};