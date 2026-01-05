import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/contants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <section className="relative py-24 bg-linear-to-br from-amber-50 to-green-50">
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent z-1" /> */}
        <Image
          src={"assets/images/home-bg.svg"}
          alt="home"
          priority
          quality={100}
          loading="eager"
          fill
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              What We Do
            </h1>
            <p className="text-xl text-gray-900">
              Curated cultural, educational, and eco-tourism experiences
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className={`border-none shadow-lg overflow-hidden ${
                    index % 2 === 0
                      ? ""
                      : "bg-linear-to-br from-amber-50 to-green-50"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-8 p-8">
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex flex-col md:flex-row items-start space-x-4">
                          <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {service.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          What&apos;s Included:
                        </h4>
                        <ul className="space-y-2">
                          {service.details.map((detail) => (
                            <li
                              key={detail}
                              className="flex items-start space-x-2 text-sm text-gray-700"
                            >
                              <span className="text-amber-600 mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Asanteman Differently?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let us design a transformative cultural journey tailored to your
            interests
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-amber-700 hover:bg-gray-100"
          >
            <Link href="/tours">
              Book a Tour
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default page;
