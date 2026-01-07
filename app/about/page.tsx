import GetInTouch from "@/components/get-in-touch";
import { Card, CardContent } from "@/components/ui/card";
import { values } from "@/lib/contants";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <section className="relative py-24 bg-linear-to-br from-amber-50 to-green-50">
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent z-1" />
        <Image
          src={"assets/images/Section (1).svg"}
          alt="home"
          priority
          quality={100}
          loading="eager"
          fill
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
        />
        <div className="max-w-7xl relative z-2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Who We Are
            </h1>
            <p className="text-xl text-gray-700">
              A trusted curator of Asanteman heritage and eco-cultural tourism
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 flex justify-between gap-4">
          <div className="prose prose-lg lg:w-1/2">
            <h2 className="text-xl md:text-3xl font-bold mb-3">
              Connecting People to{" "}
              <span className="text-amber-700">Living Heritage</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Besepa Eco-Culture and Tourism Hub is a Ghana-based cultural
              tourism organisation operating at the intersection of culture,
              education, conservation, and tourism. We work with traditional
              authorities, historians, educators, and host communities to
              deliver authentic and respectful cultural experiences.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Our work is inspired by the Adinkra principle of{" "}
              <span className="font-bold text-amber-700">SANKOFA</span>
              —returning to retrieve what is valuable from the past to guide the
              future.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Through carefully curated tours, educational programs, and
              community partnerships, we create meaningful connections between
              visitors and the living culture of Asanteman. Our experiences go
              beyond sightseeing to offer deep immersion in history, tradition,
              philosophy, and the sacred landscapes that have shaped the Asante
              people.
            </p>
          </div>
          <div>
            <Image
              src={"/assets/images/emblem.png"}
              alt="emblem"
              width={400}
              height={400}
              className="w-auto h-auto object-cover hidden lg:block"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every experience we create
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/6775230/pexels-photo-6775230.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            To preserve, celebrate, and share the rich cultural heritage of
            Asanteman through ethical, educational, and transformative tourism
            experiences that benefit local communities and inspire global
            understanding.
          </p>
        </div>
      </section>

      <GetInTouch />
    </div>
  );
};

export default page;
