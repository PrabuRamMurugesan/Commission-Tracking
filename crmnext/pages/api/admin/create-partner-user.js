import { sendCredentialEmail } from "../../../lib/emailService";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const { partnerId, email, role, platform, name } = req.body;

        if (!partnerId || !email) {
            return res.status(400).json({
                success: false,
                message: "partnerId and email required",
            });
        }

        // 🔹 TEMP LOGIC (we will upgrade later)
        console.log("Creating partner user:", {
            partnerId,
            email,
            role,
            platform,
            name,
        });

        // 🔹 Generate login link
        const loginLink = `${process.env.FRONTEND_URL}/set-password?email=${encodeURIComponent(email)}`;

        // return res.status(200).json({
        //   success: true,
        //   message: "Credentials created successfully",
        //   loginLink,
        //   emailSent: false,
        // });

        console.log("CALLING EMAIL FUNCTION...");

        const emailSent = await sendCredentialEmail(email, loginLink);

        console.log("EMAIL RESULT:", emailSent);

        return res.status(200).json({
            success: true,
            message: "Credentials created successfully",
            loginLink,
            emailSent,
        });
    } catch (err) {
        console.error("[create-partner-user ERROR]", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}