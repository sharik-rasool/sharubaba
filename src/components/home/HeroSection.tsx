import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Link2, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import sharikPortrait from "@/assets/sharik-portrait-1.jpeg";

export function HeroSection() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-6">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                <span>6+ Years of Proven SEO Results</span>
              </div>
            </FadeIn>

            {/* Main Heading - Single H1 */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
                SEO Strategist & Link Builder
                <span className="block text-primary mt-2">Driving Organic Growth</span>
              </h1>
            </FadeIn>

            {/* Subheading */}
            <FadeIn delay={0.2}>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-6 md:mb-8 px-4 md:px-0">
                I help SaaS and tech companies increase their domain authority, organic traffic,
                and search rankings through strategic link building and data-driven SEO.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 mb-8 md:mb-12">
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button size="lg" className="font-medium gap-2 w-full sm:w-auto">
                    View My Work
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="font-medium w-full sm:w-auto">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Trust Indicators */}
            <FadeIn delay={0.4}>
              <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-border">
                <StaggerItem>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">
                      <Link2 className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      <span>500+</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">High-Quality Backlinks</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      <span>85+</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">Average DR Achieved</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">
                      <BarChart3 className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      <span>300%</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">Avg Traffic Growth</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1 md:gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">
                      <Search className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      <span>50+</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">Clients Worldwide</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </FadeIn>
          </div>

          {/* Right: Image */}
          <FadeIn delay={0.2} className="order-1 lg:order-2">
            <div className="relative mx-auto lg:mx-0 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-none">
              <div className="relative z-10">
                <Image
                  src={sharikPortrait}
                  alt="Sharik Rasool - SEO Strategist & Link Builder"
                  className="w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/20 rounded-2xl -z-0" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
