import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// TEMP in-memory storage (replace with DB later)
const users: any[] = [];

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword,
    name,
  };

  users.push(newUser);

  res.json({ message: "Signup successful" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
};