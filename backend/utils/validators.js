const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["household", "consumer", "provider", "verified_reseller", "mechanic", "admin", "volunteer_inspector"]).optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const otpRequestSchema = z.object({
  email: z.string().email("Invalid email address")
});

const otpVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits")
});

const idVerificationSchema = z.object({
  idDocUrl: z.string().refine((val) => {
    const [type, num] = val.split(": ");
    if (type === "ADHAR") {
      return /^\d{12}$/.test(num);
    } else if (type === "PAN") {
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(num.toUpperCase());
    }
    return true; // Fallback or legacy support
  }, {
    message: "Invalid document format selected"
  })
});

module.exports = {
  signupSchema,
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  idVerificationSchema
};
