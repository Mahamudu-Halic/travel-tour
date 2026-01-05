import AboutSummary from "@/components/home/about-summary";
import FeaturedTours from "@/components/home/featured-tours";
import GetInTouch from "@/components/get-in-touch";
import Introduction from "@/components/home/introduction";
import SignatureExperience from "@/components/home/signature-experience";
import WhyChooseUs from "@/components/home/why-choose-us";
import Work from "@/components/home/work";

export default async function Home() {
  return (
    <div className="space-y-10">
      <Introduction />
      <AboutSummary />
      <SignatureExperience />
      <FeaturedTours />
      <WhyChooseUs />
      <Work />
      <GetInTouch />
    </div>
  );
}
