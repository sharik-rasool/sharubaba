import { FadeIn } from "@/components/animations";

// Partner logos - new versions with white backgrounds
import g2Logo from "@/assets/logos/g2-new.png";
import activecampaignLogo from "@/assets/logos/activecampaign-new.png";
import canvaLogo from "@/assets/logos/canva-new.png";
import hubspotLogo from "@/assets/logos/hubspot-new.png";
import msnLogo from "@/assets/logos/msn-new.png";
import marketingladLogo from "@/assets/logos/marketinglad-new.png";
import quoleadyLogo from "@/assets/logos/quoleady-new.png";
import saynineLogo from "@/assets/logos/saynine-new.png";
import amexLogo from "@/assets/logos/amex.png";
import dominionLogo from "@/assets/logos/dominion-new.png";

const partners = [
  { name: "G2", logo: g2Logo },
  { name: "ActiveCampaign", logo: activecampaignLogo },
  { name: "Canva", logo: canvaLogo },
  { name: "HubSpot", logo: hubspotLogo },
  { name: "MSN", logo: msnLogo },
  { name: "Marketing Lad", logo: marketingladLogo },
  { name: "Quoleady", logo: quoleadyLogo },
  { name: "Saynine", logo: saynineLogo },
  { name: "American Express", logo: amexLogo },
  { name: "Dominion", logo: dominionLogo },
];

export function PartnersSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary/50 overflow-hidden" aria-labelledby="partners-heading">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 id="partners-heading" className="text-xl md:text-2xl font-semibold text-muted-foreground">
              Trusted by Leading Brands & Partners
            </h2>
          </div>
        </FadeIn>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-secondary/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-secondary/50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos container */}
        <div className="flex animate-scroll-left">
          {/* First set of logos */}
          <div className="flex items-center gap-12 md:gap-16 px-6">
            {partners.map((partner, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 h-10 md:h-14 flex items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-full flex items-center">
                  <div
                    className="absolute inset-0 -inset-x-4 rounded-xl"
                    style={{
                      background: 'radial-gradient(ellipse 80% 100% at center, hsl(var(--background) / 0.9) 30%, transparent 70%)'
                    }}
                  />
                  <img
                    src={partner.logo.src}
                    alt={`${partner.name} logo`}
                    className="relative h-full w-auto max-w-[100px] md:max-w-[140px] object-contain rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 md:gap-16 px-6">
            {partners.map((partner, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 h-10 md:h-14 flex items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-full flex items-center">
                  <div
                    className="absolute inset-0 -inset-x-4 rounded-xl"
                    style={{
                      background: 'radial-gradient(ellipse 80% 100% at center, hsl(var(--background) / 0.9) 30%, transparent 70%)'
                    }}
                  />
                  <img
                    src={partner.logo.src}
                    alt={`${partner.name} logo`}
                    className="relative h-full w-auto max-w-[100px] md:max-w-[140px] object-contain rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
