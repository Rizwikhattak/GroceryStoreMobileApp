import { z } from "zod";

const documentSchema = z.object({
  uri: z.string().nonempty({ message: "Document URI is required" }),
  name: z.string().nonempty({ message: "Document name is required" }),
  type: z.string().nonempty({ message: "Document type is required" }),
  // Optionally, include size if you want to validate file size
  size: z.number().optional(),
});
export const signupStep1 = z
  .object({
    first_name: z
      .string()
      .min(2, "first name must be atleast 2 characters long"),
    last_name: z.string().min(2, "last name must be atleast 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "password must be atleast 8 characters long"),
    confirm_password: z.string(),
    driver_license: documentSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords donot match",
    path: ["confirm_password"],
  });
export type signupStep1Data = z.infer<typeof signupStep1>;
