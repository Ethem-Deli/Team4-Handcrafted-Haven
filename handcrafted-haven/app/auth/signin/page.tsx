"use client";

import { Suspense } from "react";
import SignInForm from "@/components/SignInForm";

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}