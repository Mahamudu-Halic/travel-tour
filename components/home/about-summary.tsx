import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const AboutSummary = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to Besepa Eco-Culture & Tourism Hub
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Besepa Eco-Culture and Tourism Hub curates ethical, immersive, and
              educational cultural and nature-based tourism experiences across
              Asanteman.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Guided by Adinkra philosophy, we connect people to history, living
              culture, and sacred landscapes—while supporting community
              livelihoods.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/6775268/pexels-photo-6775268.jpeg"
              alt="Cultural experience"
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSummary;
