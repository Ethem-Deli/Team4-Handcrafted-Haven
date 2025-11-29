"use server";

import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function registerUser(data: any) {
  // Load existing users
  const file = await fs.readFile(filePath, "utf8");
  const json = JSON.parse(file);

  // Check if email exists might be registred before
  const exists = json.users.find((u: any) => u.email === data.email);
  if (exists) {
    return { success: false, message: "Email already registered." };
  }

  // Hash the password
  const hashed = await bcrypt.hash(data.password, 10);

  // Create new user
  const newUser = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    password: hashed,
    role: data.role,
    storeName: data.storeName || "",
    craftDescription: data.craftDescription || ""
  };

  // Save user to json file for now (we'll use a database later)
  json.users.push(newUser);
  await fs.writeFile(filePath, JSON.stringify(json, null, 2));

  return { success: true };
}
