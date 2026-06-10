"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CtaSection = () => {
  const { toast } = useToast();
  
  return (
    <section id="contact" className="py-20 bg-white text-black">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 font-headline">
          Ready to Transform Your Conference Management?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join hundreds of academic institutions and research organizations
          using AICON to streamline their conference workflows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-6 text-lg bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-black text-black hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => {
              toast({
                title: "Let's Talk!",
                description: "Our team will reach out to you to schedule a demo.",
              });
            }}
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
