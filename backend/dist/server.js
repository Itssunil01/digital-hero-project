"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const charities_1 = __importDefault(require("./routes/charities"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(process.cwd(), ".env"),
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
console.log("KEY:", process.env.RAZORPAY_KEY_ID); // debug
console.log("🚀 THIS SERVER FILE IS RUNNING");
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/charities', charities_1.default);
// ✅ FIXED HERE
app.use("/api/payment", paymentRoutes_1.default);
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
//# sourceMappingURL=server.js.map