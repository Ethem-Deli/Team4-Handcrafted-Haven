"use server";

import usersData from "@/data/users.json";
import { cookies } from "next/headers";

export async function loginUser(email: string, password: string) {
  const user = usersData.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    "session",
    JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    }),
    {
      httpOnly: true,
      path: "/",
    }
  );

  return { success: true, role: user.role };
}

export async function logoutUser() {
  const cookieStore = await cookies();
}