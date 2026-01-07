import { Button } from "./ui/button";
import Link from "next/link";

const GetInTouch = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Let us craft an authentic cultural experience tailored to your
          interests
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/book">Book an Experience</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
