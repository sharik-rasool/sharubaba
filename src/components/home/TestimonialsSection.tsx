"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import syuzanaImg from "@/assets/testimonials/syuzana.jpeg";
import iramImg from "@/assets/testimonials/iram.png";
import tanishqImg from "@/assets/testimonials/tanishq.jpeg";
import shahidImg from "@/assets/testimonials/shahid.jpeg";

const testimonials = [
  {
    quote: "Working with Sharik has been an absolute joy. He's not just amazing at digital marketing and link exchanges, but also one of the most helpful, supportive, and positive people I know. No matter the challenge, he's always ready to jump in, offer a solution, and make sure everything runs smoothly. Plus, he's an all-around fantastic person, kind, reliable, and a great friend. If you get the chance to work with Sharik, take it. You'll be glad you did!",
    author: "Syuzana Ghazarian",
    role: "Link Building Manager",
    company: "Hunter.io",
    image: syuzanaImg,
  },
  {
    quote: "It's rare that you come across standout talent like Sharik. I was impressed by his ability to handle any situation calmly and patiently. Sharik would be an asset to any team and earns my highest recommendation.",
    author: "Iram Sehar",
    role: "Proposal Manager",
    company: "iQuasar Software Solutions",
    image: iramImg,
  },
  {
    quote: "Sharik's link building strategy transformed our organic presence. We went from page 3 to top 3 for our main keywords in just 6 months.",
    author: "Tanishq Agarwal",
    role: "SEO Lead",
    company: "Quillbot",
    image: tanishqImg,
  },
  {
    quote: "I can recommend Sharik Rasool for SEO and PPC works. We worked together on many projects and he has always shown dedication to his work. All the best!",
    author: "Shahid Shahmiri",
    role: "Founder",
    company: "Marketing Lad",
    image: shahidImg,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section bg-card" aria-labelledby="testimonials-heading">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-8 md:mb-12">
            <h2 id="testimonials-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              What Clients Say
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Trusted by marketing leaders and founders at growing companies worldwide.
            </p>
          </div>
        </FadeIn>

        {/* Desktop Grid */}
        <StaggerContainer staggerDelay={0.1} className="hidden md:grid grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <Card className="card-hover border-border/50 bg-background h-full">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 md:h-8 md:w-8 text-primary/30 mb-4" />
                  <blockquote className="text-base md:text-lg mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarImage src={testimonial.image.src} alt={testimonial.author} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm md:text-base">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="not-italic font-semibold">{testimonial.author}</cite>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Mobile Carousel */}
        <FadeIn className="md:hidden">
          <Card className="border-border/50 bg-background mb-6">
            <CardContent className="p-4 md:p-6">
              <Quote className="h-6 w-6 text-primary/30 mb-4" />
              <blockquote className="text-base mb-6">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={testimonials[currentIndex].image.src} alt={testimonials[currentIndex].author} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {testimonials[currentIndex].author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <cite className="not-italic font-semibold text-sm">{testimonials[currentIndex].author}</cite>
                  <p className="text-xs text-muted-foreground">
                    {testimonials[currentIndex].role}{testimonials[currentIndex].company && `, ${testimonials[currentIndex].company}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
