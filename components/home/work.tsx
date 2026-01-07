import { adinkraValues } from "@/lib/contants";
import Image from "next/image";

const Work = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Guided by Adinkra Philosophy
          </h2>
          <p className="text-xl text-gray-300">
            Our work is rooted in timeless wisdom and cultural values
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adinkraValues.map((value) => (
            <div key={value.symbol} className="text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Image
                  src={value.image}
                  alt={value.symbol}
                  fill
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-amber-500 mb-2">
                {value.symbol}
              </h3>
              <p className="text-lg font-semibold mb-2">{value.meaning}</p>
              <p className="text-gray-400 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
