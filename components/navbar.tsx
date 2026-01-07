import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Moon, Sun, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SignInButton from "./sign-in-button";
import MobileSidebar from "./mobile-sidebar";
import LogoutButton from "./logout-button";
import NavList from "./nav-list";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // const pathname = usePathname();
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  // const [user, setUser] = useState<User | null>(null);
  // const router = useRouter();

  // const toggleTheme = (currentTheme: "light" | "dark") => {
  //   document.documentElement.classList.toggle("dark");
  //   setCookie("theme", currentTheme, { maxAge: 60 * 60 * 24 * 30 });
  //   setTheme(currentTheme);
  // };

  // useEffect(() => {
  //   const getSavedTheme = async () => {
  //     const savedTheme = (await getCookie("theme")) as "light" | "dark";
  //     if (savedTheme) {
  //       setTheme(savedTheme);
  //       document.documentElement.classList.toggle(savedTheme);
  //     }
  //   };

  //   const getUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       setUser(user);
  //     }
  //   };

  //   // getSavedTheme();
  //   getUser();
  // }, []);

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

      <NavList />

      <div className="flex items-center gap-2">
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
              {profile?.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* <Button
          variant="outline"
          onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Sun /> : <Moon />}
        </Button> */}

        <MobileSidebar user={user} />
        <div className="hidden lg:flex justify-center items-center gap-2">
          {!user && <SignInButton />}
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/dashboard/bookings">Book Experience</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
