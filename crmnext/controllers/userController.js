
import User from "../models/User";
import { connectDB } from "../lib/db";

export const createUser = async (req, res) => {
  try {
    await connectDB();
    const { name, email, role } = req.body;

    const newUser = await User.create({
      name,
      email,
      role,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const getAllUsers = async (req, res) => {
  await connectDB();
  const users = await User.find({});
  res.status(200).json({ users });
};
export const deleteUserById = async (req, res) => {
  await connectDB();
  try {
    await User.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateUserById = async (req, res) => {
  await connectDB();
  try {
    const { name, role, accountStatus } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.query.id,
      { name, role, accountStatus },
      { new: true }
    );
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUserById = async (req, res) => {
  await connectDB();
  try {
    const user = await User.findById(req.query.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};