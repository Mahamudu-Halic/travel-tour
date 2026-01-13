import { baseUrl, teams } from "@/lib/contants";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Team | BESEPA Eco-Culture & Tourism Hub Ghana",
  description:
    "Explore our team of professionals who bring together diverse expertise in cultural heritage, education, tourism management, and community development.",
  keywords:
    "Ghana tours, cultural experiences Ghana, eco-tourism packages, heritage tours, adventure tours Ghana, tour packages, book tours Ghana",
  metadataBase: new URL(`${baseUrl}`),
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Our Team | BESEPA",
    description: "Discover authentic Ghana tours and cultural experiences",
    type: "website",
    url: "/team",
    images: [
      {
        url: "https://i.postimg.cc/rp6pXw1q/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Our Team - BESEPA",
      },
    ],
  },
};

const page = () => {
  return (
    <div>
      <section className="relative py-24 bg-linear-to-br from-amber-50 to-green-50">
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent z-1" /> */}
        <Image
          src={"assets/images/about-bg.svg"}
          alt="home"
          priority
          quality={100}
          loading="eager"
          fill
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Team</h1>
            <p className="text-xl text-gray-700">
              Experience, integrity, and cultural stewardship
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <p className="text-lg leading-relaxed text-gray-700">
            Our team brings together diverse expertise in cultural heritage,
            education, tourism management, and community development. Every
            member is committed to the highest standards of authenticity,
            respect, and excellence in representing Asanteman to the world.
          </p>
        </div>

        <section className="">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                A <span className="text-amber-600">Collaborative</span> Approach
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team brings together diverse expertise united by a shared
                commitment to cultural preservation and authentic experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teams.map((section, index) => (
                <div
                  key={section.title}
                  className={`bg-card rounded-xl p-8 shadow-soft border border-border hover:border-secondary/30 transition-all duration-300 ${
                    index === teams.length - 1
                      ? "md:col-span-2 lg:col-span-1"
                      : ""
                  }`}
                >
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                    <section.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Working with Traditional Authorities
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We maintain close collaborative relationships with royal courts,
            palace administrators, and traditional councils across Asanteman.
            This ensures that our tours respect cultural protocols, benefit host
            communities, and provide visitors with genuine insight into living
            Asante tradition.
          </p>
        </div>
      </section>
    </div>
  );
};

export default page;
