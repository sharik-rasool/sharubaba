import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import sharikWorking from "@/assets/sharik-working-2.jpeg";

export function CTASection() {
  return (
    <section className="section" aria-labelledby="cta-heading">
      <div className="container-wide px-4 md:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content */}
              <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 id="cta-heading" className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
                  Ready to Grow Your Organic Traffic?
                </h2>
                <p className="text-sm md:text-lg text-muted-foreground max-w-xl mb-6 md:mb-8">
                  Let's discuss how strategic SEO and link building can transform your online presence
                  and drive sustainable growth for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <a href="https://calendly.com/sharikkashmiri" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button size="lg" className="font-medium gap-2 w-full sm:w-auto">
                      Book a Free Consultation
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link href="/projects" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="font-medium w-full sm:w-auto">
                      View Case Studies
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="relative hidden lg:block h-full">
                <Image
                  src={sharikWorking}
                  alt="Sharik Rasool at work"
                  className="absolute inset-0 w-full h-full object-cover"
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
