import { Search, FileSearch, Link2, BarChart3 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery & Audit",
    description: "Deep dive into your current SEO landscape, competitor analysis, and identifying quick wins alongside long-term opportunities.",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Strategy Development",
    description: "Create a data-driven roadmap with clear KPIs, target keywords, and a link building strategy tailored to your industry.",
  },
  {
    number: "03",
    icon: Link2,
    title: "Execution & Outreach",
    description: "Implement on-page optimizations and execute targeted link building campaigns through personalized outreach and relationship building.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Monitor & Optimize",
    description: "Continuous tracking, reporting, and refinement to maximize ROI and adapt to algorithm changes and market shifts.",
  },
];

export function ProcessSection() {
  return (
    <section className="section" aria-labelledby="process-heading">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-8 md:mb-12">
            <h2 id="process-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              My Proven Process
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              A systematic approach to SEO and link building that delivers consistent, measurable results.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2 z-0" />
                )}
                
                <div className="relative z-10 text-center lg:text-left">
                  {/* Number badge */}
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground font-bold text-base md:text-lg mb-4 group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-card border border-border mb-4 ml-2">
                    <step.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
