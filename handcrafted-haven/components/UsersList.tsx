"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type User = {
  id: string | number;
  name: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) console.error(error);
      else setUsers(data as User[]);
    };

    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
