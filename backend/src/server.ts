import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import charityRoutes from './routes/charities';
import paymentRoutes from "./routes/paymentRoutes";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

console.log("KEY:", process.env.RAZORPAY_KEY_ID); // debug

console.log("🚀 THIS SERVER FILE IS RUNNING");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charities', charityRoutes);

// ✅ FIXED HERE
app.use("/api/payment", paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get("/test", (req, res) => {
  res.send("✅ Backend working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});