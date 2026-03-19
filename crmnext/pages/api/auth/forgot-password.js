// crmnext/pages/api/auth/forgot-password.js
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import Cbv from "../../../models/Cbv/Cbv";
import dbConnect from "../../../lib/mongodb";
import allowCors from "../../../middleware/cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../../../utils/emailService.js";

async function handler(req, res) {
 if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await dbConnect();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user across all collections
    let user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
    let userModel = User;
    let userCollection = "User";

    if (!user) {
      user = await Vendor.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (user) {
        userModel = Vendor;
        userCollection = "Vendor";
      }
    }

    if (!user) {
      user = await Agent.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (user) {
        userModel = Agent;
        userCollection = "Agent";
      }
    }

    if (!user) {
      user = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (user) {
        userModel = FranchiseHead;
        userCollection = "FranchiseHead";
      }
    }

    if (!user) {
      user = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (user) {
        userModel = TerritoryHead;
        userCollection = "TerritoryHead";
      }
    }

    if (!user) {
      user = await Cbv.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (user) {
        userModel = Cbv;
        userCollection = "Cbv";
      }
    }

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Store reset token in user document (if fields exist, otherwise store in a separate way)
    // Try to save reset token - if schema doesn't support it, we'll use JWT only
    try {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();
    } catch (saveError) {
      // If schema doesn't have these fields, that's okay - we'll use JWT token only
      console.warn("Could not save reset token to user document:", saveError.message);
    }

    // Generate JWT token with reset token and user info
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        resetToken: resetToken,
        collection: userCollection,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5174"}/reset-password?token=${token}`;

    // Send email with reset link
    try {
      const userName = user.name || user.vendor_fname || user.vendor_lname || "User";
      await sendPasswordResetEmail(user.email, resetLink, userName);
      console.log(`✅ Password reset email sent successfully to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Failed to send password reset email:", emailError.message || emailError);
      
      // Check if it's a configuration error
      if (emailError.code === "EAUTH" || emailError.message?.includes("Invalid login")) {
        console.error("⚠️ Email configuration error. Please check SMTP credentials in .env.local");
        console.error("Required environment variables: SMTP_USER, SMTP_PASS (or EMAIL_USER, EMAIL_PASSWORD)");
      }
      
      // Still return success to user for security (don't reveal if email failed)
      // But log the error for debugging
      // In development, you can check the console for the reset link
    }

    // Log reset link in development mode only
    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset link for ${user.email}: ${resetLink}`);
    }

    res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
      // Only include resetLink in development for testing
      resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error processing password reset request" });
  }
}

export default allowCors(handler);