import { z } from "zod";

// Email validation
const emailSchema = z.preprocess(
  (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  z.email("Email must be valid")
);

// Strong password validation for signup
const passwordSchema = z
  .string()
  .min(8, "Password must have at least 8 characters")
  .max(30, "Password must have at most 30 characters")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[0-9]/, "Password needs a number")
  .regex(
    /[~?@.,<>{}:'!^#()&+-]/,
    "Password needs a special character"
  );

// Signup schema
export const signupSchema = z
  .object({
    name: z.string().trim().min(3, "Name must have at least 3 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
const result = signupSchema.safeParse({
  name: "Pawan",
  email: "PAWAN@GMAIL.COM",
  password: "Hello@123",
  confirmPassword: "Hello@123",
});

console.log(result.success);