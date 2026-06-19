import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import InquiryForm from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Sponsor, vend, volunteer, shoot, or perform with Denver Spotlight.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-3 text-center font-impact text-4xl uppercase text-white md:text-5xl">
            Get Involved
          </h1>
          <p className="mb-10 text-center text-white/70">
            Sponsor, vend, volunteer, shoot, or perform — your stage is waiting.
          </p>
          <InquiryForm sourcePage="/get-involved" />
        </div>
      </main>
      <Footer />
    </>
  );
}
