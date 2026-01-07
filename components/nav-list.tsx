"use client";
import { navlinks } from "@/lib/contants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavList = () => {
  const pathname = usePathname();
  return (
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
  );
};

export default NavList;
