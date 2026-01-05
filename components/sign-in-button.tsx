"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { login } from "@/apis/auth";


const SignInButton = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  return (
    <Button onClick={() => login(pathname)} className={className}>
      Sign In with Google
    </Button>
  );
};

export default SignInButton;
