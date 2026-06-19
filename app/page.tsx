import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SpotlightConnectsBanner from "@/components/site/SpotlightConnectsBanner";
import Hero from "@/components/home/Hero";
import OpportunitiesGrid from "@/components/home/OpportunitiesGrid";

export default function Home() {
  return (
    <>
      <Header />
      <SpotlightConnectsBanner />
      <main className="flex-1">
        <Hero />
        <OpportunitiesGrid />
      </main>
      <Footer />
    </>
  );
}
