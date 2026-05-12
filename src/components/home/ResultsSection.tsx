import { TrendingUp, Link2, Target, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const results = [
  {
    icon: TrendingUp,
    metric: "DR 15 → DR 72",
    title: "Domain Rating Growth",
    description: "Increased client's domain authority from DR 15 to DR 72 in 18 months through strategic link acquisition.",
    highlight: "+380%",
  },
  {
    icon: BarChart3,
    metric: "10K → 150K",
    title: "Monthly Organic Traffic",
    description: "Grew organic traffic from 10,000 to 150,000 monthly visitors through content and link building synergy.",
    highlight: "+1400%",
  },
  {
    icon: Link2,
    metric: "200+ Links",
    title: "High-Authority Backlinks",
    description: "Secured 200+ backlinks from DR 50+ domains including industry publications and authoritative sites.",
    highlight: "DR 50+",
  },
  {
    icon: Target,
    metric: "#1 Rankings",
    title: "Keyword Positions",
    description: "Achieved #1 rankings for 15+ high-value keywords with combined monthly search volume of 50K+.",
    highlight: "15+ KWs",
  },
];

export function ResultsSection() {
  return (
    <section className="section bg-card" aria-labelledby="results-heading">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-8 md:mb-12">
            <h2 id="results-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Proven Results That Speak
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Real metrics from real campaigns. Here's what strategic SEO and link building can achieve.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {results.map((result, index) => (
            <StaggerItem key={index}>
              <Card className="card-hover border-border/50 bg-background h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                      <result.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-xl md:text-2xl font-bold">{result.metric}</span>
                        <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded self-start sm:self-auto">
                          {result.highlight}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{result.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
