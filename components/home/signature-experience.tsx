import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { experiences } from "@/lib/contants";
import Image from "next/image";

const SignatureExperience = () => {
  return (
    <section className="py-20 bg-linear-to-br from-amber-50 to-green-50 dark:bg-linear-to-br dark:from-gray-900 dark:to-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Signature Experiences
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Immersive journeys that honor tradition, educate minds, and create
            lasting connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp) => {
            return (
              <Card
                key={exp.title}
                className="border-none shadow-lg hover:shadow-xl transition-shadow py-0"
              >
                <CardContent className=" space-y-4 p-0">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    width={500}
                    height={500}
                    loading="eager"
                    className="w-auto h-auto object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignatureExperience;
