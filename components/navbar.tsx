"use client";
import Image from "next/image";
import Link from "next/link";
import { navlinks } from "@/lib/contants";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, Moon, Sun, User as UserIcon, X } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SignInButton from "./sign-in-button";

const Navbar = () => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const toggleTheme = (currentTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark");
    setCookie("theme", currentTheme, { maxAge: 60 * 60 * 24 * 30 });
    setTheme(currentTheme);
  };

  const logout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  useEffect(() => {
    const getSavedTheme = async () => {
      const savedTheme = (await getCookie("theme")) as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle(savedTheme);
      }
    };

    const getUser = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    // getSavedTheme();
    getUser();
  }, []);

  useEffect(() => {
    const menuClose = () => closeMenu();
    menuClose();
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center w-full sticky top-0 z-1000 bg-white dark:bg-gray-900 backdrop-blur-3xl py-3 px-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/assets/images/logo-md.jpg"
          alt="BESEPA"
          width={120}
          height={48}
          className="h-10 w-auto"
        />
      </Link>

      <ul className="hidden lg:flex justify-center items-center gap-5">
        {navlinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`hover:text-amber-600 font-semibold ${
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

      <div className="flex items-center gap-2">
        {/* <Button
          variant="outline"
          onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Sun /> : <Moon />}
        </Button> */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border"
              >
                <UserIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/bookings">My Bookings</Link>
              </DropdownMenuItem>
              {(user.email?.endsWith("@besepa.com") || user.email === "mahamuduhalic2@gmail.com") && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="destructive"
                  className="w-full hover:bg-red-500/90!"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="hidden lg:flex justify-center items-center gap-2">
          {!user && <SignInButton />}
          <Button className="bg-amber-600 hover:bg-amber-700">
            Book Experience
          </Button>
        </div>

        {isMenuOpen ? (
          <Button className="lg:hidden" variant={"outline"} onClick={closeMenu}>
            <X />
          </Button>
        ) : (
          <Button className="lg:hidden" variant={"outline"} onClick={openMenu}>
            <Menu />
          </Button>
        )}
      </div>

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
          {user ? <Button onClick={logout}>Sign Out</Button> : <SignInButton />}
          <Button className="bg-amber-600 hover:bg-amber-700">
            Book Experience
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
