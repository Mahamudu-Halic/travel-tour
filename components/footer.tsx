import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src={"/assets/images/emblem.png"}
                alt="logo"
                width={100}
                height={100}
                className="w-auto h-auto object-cover relative z-10"
              />
              <div>
                <div className="text-white font-bold">Besepa</div>
                <div className="text-xs">Eco-Culture & Tourism</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Authentic eco-cultural experiences rooted in the heritage of
              Asanteman.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-500 transition-colors"
                >
                  Who We Are
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-amber-500 transition-colors"
                >
                  What We Do
                </Link>
              </li>
              <li>
                <Link
                  href="/tours"
                  className="hover:text-amber-500 transition-colors"
                >
                  Our Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-amber-500 transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-amber-500 transition-colors"
                >
                  Besepa Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-amber-500 transition-colors"
                >
                  Book an Experience
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Kumasi, Ashanti Region, Ghana</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:info@besepaecoculture.com"
                  className="hover:text-amber-500 transition-colors"
                >
                  info@besepaecoculture.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+233 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p className="mb-2">
            Guided by{" "}
            <span className="text-amber-500 font-semibold">SANKOFA</span>.
            Grounded in Culture. Committed to the Future.
          </p>
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Besepa Eco-Culture & Tourism Hub.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
