"use client";
import { navlinks } from "@/lib/contants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import LogoutButton from "./logout-button";
import SignInButton from "./sign-in-button";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

const MobileSidebar = ({ user }: { user: User | null }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    const menuClose = () => closeMenu();
    menuClose();
  }, [pathname]);
  return (
    <div>
      {isMenuOpen ? (
        <Button className="lg:hidden" variant={"outline"} onClick={closeMenu}>
          <X />
        </Button>
      ) : (
        <Button className="lg:hidden" variant={"outline"} onClick={openMenu}>
          <Menu />
        </Button>
      )}
      <div
        className={`lg:hidden fixed left-0 transition-all duration-300 space-y-5 ${
          isMenuOpen ? "top-full" : "-top-[700px]"
        } h-[calc(100vh-56px)] overflow-auto w-full bg-white dark:bg-gray-900 p-10 z-50`}
      >
        <ul className="flex flex-col gap-5">
          {navlinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`hover:text-amber-600 hover:bg-amber-600/10 block font-semibold p-2 transition-all duration-300 ${
                  pathname === link.href
                    ? "text-amber-600 border-b border-amber-600"
                    : "text-gray-500"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          {user ? <LogoutButton /> : <SignInButton />}
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/dashboard/bookings">Book Experience</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
