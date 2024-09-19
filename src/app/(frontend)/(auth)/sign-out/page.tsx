'use client'
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/sign-up' })}>
      Sign out
    </button>
  );
}
