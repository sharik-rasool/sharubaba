import type { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Briefcase, MapPin, Mail, PenTool, Calendar, Users, Target, Building, Link2, Shield, TrendingUp, Flag, Handshake, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

// Images
import sharikPortrait from "@/assets/sharik-portrait-2.jpeg";
import sharikWorking from "@/assets/sharik-working-1.jpeg";
import redstaglabsLogo from "@/assets/logos/redstaglabs.png";
import marketingladLogo from "@/assets/logos/marketinglad.png";
import codemitesLogo from "@/assets/logos/codemites.png";
import uplersLogo from "@/assets/logos/uplers.png";
import jainUniversityLogo from "@/assets/logos/jain-university.jpeg";

export const metadata: Metadata = {
    title: "About Sharik Rasool | Expert SEO Strategist & SaaS Link Builder",
    description:
        "Learn about Sharik Rasool's 7+ years of experience in SEO strategy and link building. MBA in Digital Marketing with proven results for SaaS and tech companies.",
    alternates: { canonical: "https://www.sharikrasool.com/about" },
    openGraph: {
        title: "About Sharik Rasool | Expert SEO Strategist & SaaS Link Builder",
        description:
            "Learn about Sharik Rasool's 7+ years of experience in SEO strategy and link building. MBA in Digital Marketing with proven results for SaaS and tech companies.",
        url: "https://www.sharikrasool.com/about",
        type: "profile",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Sharik Rasool | Expert SEO Strategist & SaaS Link Builder",
        description:
            "Learn about Sharik Rasool's 7+ years of experience in SEO strategy and link building. MBA in Digital Marketing with proven results for SaaS and tech companies.",
    },
};

const careerTimeline = [
    {
        company: "Marketing Lad",
        role: "Partnerships Manager",
        period: "April 2022 - Present",
        description: "Leading partnership initiatives and SEO strategy for enterprise SaaS clients. Managed teams and delivered 300%+ traffic growth.",
        logo: marketingladLogo,
    },
    {
        company: "Red Stag Labs",
        role: "Senior SEO Specialist",
        period: "June 2020 - April 2022",
        description: "Developed and executed link acquisition strategies for e-commerce and tech clients. Built 200+ high-authority backlinks monthly.",
        logo: redstaglabsLogo,
    },
    {
        company: "Uplers",
        role: "Lead Generation Specialist",
        period: "December 2019 - June 2020",
        description: "Managed lead generation campaigns and SEO optimization for diverse clients.",
        logo: uplersLogo,
    },
    {
        company: "CodeMites",
        role: "SEO Executive",
        period: "January 2019 - December 2019",
        description: "Started career in SEO, learning fundamentals of search optimization and digital marketing.",
        logo: codemitesLogo,
    },
];

const authorPublications = [
    { name: "Leadgenapp.io", url: "https://leadgenapp.io" },
    { name: "Countercurrents.org", url: "https://countercurrents.org" },
    { name: "Googlerankcheck.com", url: "https://googlerankcheck.com" },
    { name: "Codeless.io", url: "https://codeless.io" },
    { name: "Wordable.io", url: "https://wordable.io" },
    { name: "IED.eu", url: "https://ied.eu" },
    { name: "Codemites.com", url: "https://codemites.com" },
    { name: "Raybittechnologies.com", url: "https://raybittechnologies.com" },
    { name: "Userp.io", url: "https://userp.io" },
];

const skills = [
    "Link Building & Outreach",
    "Technical SEO Audits",
    "Keyword Research & Strategy",
    "Content Optimization",
    "Competitor Analysis",
    "Google Analytics & Search Console",
    "Ahrefs & SEMrush",
    "On-Page SEO",
    "Local SEO",
    "E-commerce SEO",
    "SaaS SEO",
    "Reporting & Analytics",
];

const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
        "@type": "Person",
        "name": "Sharik Rasool",
        "jobTitle": "SEO Strategist & Link Builder",
        "description": "Expert SEO strategist with 7+ years of experience in link building and organic growth",
        "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "MBA in Digital Marketing",
        },
        "knowsAbout": skills,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Srinagar",
            "addressRegion": "Jammu & Kashmir",
            "addressCountry": "India",
        },
    },
};

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />
            <section className="section">
                <div className="container-wide">
                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center mb-12 lg:mb-16">
                        {/* Image */}
                        <FadeIn className="order-2 lg:order-1 lg:col-span-2 relative">
                            <div className="relative max-w-[340px] lg:max-w-none mx-auto w-full aspect-[5/6]">
                                {/* Main Image Frame */}
                                <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-background group bg-muted">
                                    <Image
                                        src={sharikPortrait}
                                        alt="Sharik Rasool - SEO Expert & Link Builder"
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
                                        priority
                                    />
                                    {/* Bottom fade overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />
                                </div>

                            </div>
                        </FadeIn>

                        {/* Content */}
                        <FadeIn delay={0.1} className="order-1 lg:order-2 lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start">
                            
                            {/* Top Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-primary font-extrabold uppercase tracking-widest text-xs">About Me</span>
                                <div className="w-12 h-[2px] bg-primary" />
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-[1.12]">
                                Helping SaaS Companies <br className="hidden sm:inline" />
                                Turn Authority Into <br />
                                <span className="text-primary">
                                    Organic Growth.
                                </span>
                            </h1>

                            {/* Bio Paragraph */}
                            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl">
                                SEO Strategist and Link Builder passionate about helping SaaS and tech companies acquire authoritative backlinks, rank higher, and drive sustainable organic growth.
                            </p>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full mb-8 border-t border-b border-border/40 py-6 text-left">
                                {/* Metric 1: Experience */}
                                <div className="flex flex-col">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-2.5 mb-1">7+</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Years of Experience</span>
                                </div>

                                {/* Metric 2: Backlinks */}
                                <div className="flex flex-col">
                                    <Link2 className="h-5 w-5 text-primary" />
                                    <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-2.5 mb-1">500+</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Backlinks Built</span>
                                </div>

                                {/* Metric 3: Clients */}
                                <div className="flex flex-col">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-2.5 mb-1">50+</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">SaaS & Tech Clients</span>
                                </div>

                                {/* Metric 4: White-hat */}
                                <div className="flex flex-col">
                                    <Target className="h-5 w-5 text-primary" />
                                    <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-2.5 mb-1">100%</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">White-Hat Link Building</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
                                <a href="https://calendly.com/sharikkashmiri" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-12 px-6 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg shadow-primary/15 hover:scale-102 active:scale-98 transition-all duration-300 gap-2 w-full sm:w-auto">
                                        Book a free consultation
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </a>
                                <Link href="/projects" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="h-12 px-6 rounded-xl text-sm font-bold border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-102 active:scale-98 transition-all duration-300 w-full sm:w-auto">
                                        View Case Studies
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>

                    {/* My Journey Section */}
                    <div className="mt-20 lg:mt-24 border-t border-border/40 pt-16 lg:pt-20 mb-16 lg:mb-20">
                        <FadeIn>
                            <div className="text-center mb-12">
                                <span className="text-primary font-extrabold uppercase tracking-widest text-xs">My Journey</span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-2">
                                    The Path That Got Me Here
                                </h2>
                            </div>

                            <div className="relative max-w-5xl mx-auto px-4">
                                {/* Dotted Line (Desktop only) */}
                                <div className="absolute left-[10%] right-[10%] top-[24px] h-[2px] border-t-2 border-dashed border-primary/30 dark:border-primary/20 -z-10 hidden md:block" />

                                {/* Timeline Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
                                    
                                    {/* Item 1: 2019 */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-background dark:bg-background text-primary border border-primary/20 flex items-center justify-center shadow-md shrink-0 relative z-10">
                                            <Flag className="h-5 w-5" />
                                        </div>
                                        <span className="text-primary font-extrabold text-base sm:text-lg mt-4 mb-1">2019</span>
                                        <h3 className="text-base font-bold text-foreground mb-2">Started My Journey</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                                            Began as an SEO enthusiast and worked on local projects to understand the basics.
                                        </p>
                                    </div>

                                    {/* Item 2: 2021 */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-background dark:bg-background text-primary border border-primary/20 flex items-center justify-center shadow-md shrink-0 relative z-10">
                                            <Link2 className="h-5 w-5" />
                                        </div>
                                        <span className="text-primary font-extrabold text-base sm:text-lg mt-4 mb-1">2021</span>
                                        <h3 className="text-base font-bold text-foreground mb-2">Specialized in Link Building</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                                            Focused on building high-quality links that move the needle and drive real results.
                                        </p>
                                    </div>

                                    {/* Item 3: 2023 */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-background dark:bg-background text-primary border border-primary/20 flex items-center justify-center shadow-md shrink-0 relative z-10">
                                            <Handshake className="h-5 w-5" />
                                        </div>
                                        <span className="text-primary font-extrabold text-base sm:text-lg mt-4 mb-1">2023</span>
                                        <h3 className="text-base font-bold text-foreground mb-2">Partnership Manager</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                                            Managed partnerships and outreach at scale for SaaS brands globally.
                                        </p>
                                    </div>

                                    {/* Item 4: Today */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-background dark:bg-background text-primary border border-primary/20 flex items-center justify-center shadow-md shrink-0 relative z-10">
                                            <Rocket className="h-5 w-5" />
                                        </div>
                                        <span className="text-primary font-extrabold text-base sm:text-lg mt-4 mb-1">Today</span>
                                        <h3 className="text-base font-bold text-foreground mb-2">Helping Brands Scale</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                                            Now I help SaaS companies grow organic traffic, authority, and revenue through strategic link building.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Bio Card with Working Image */}
                        <FadeIn delay={0.2}>

                            <Card className="mb-8 md:mb-12 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-5 gap-0">
                                        {/* Working Image */}
                                        <div className="md:col-span-2 relative min-h-[256px]">
                                            <Image
                                                src={sharikWorking}
                                                alt="Sharik Rasool working on SEO strategies"
                                                className="object-cover"
                                                fill
                                            />
                                        </div>
                                        {/* Bio Content */}
                                        <div className="md:col-span-3 p-6 md:p-8">
                                            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Hello! I'm Sharik</h2>
                                            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground">
                                                <p>
                                                    With over 7 years of hands-on experience in SEO and link building, I've helped dozens of SaaS
                                                    and tech companies achieve remarkable organic growth. My journey in digital marketing started
                                                    with a curiosity about how search engines work, and it's evolved into a deep expertise in
                                                    building sustainable organic traffic strategies.
                                                </p>
                                                <p>
                                                    I specialize in high-authority link building and strategic SEO that moves the needle.
                                                    No fluff, no shortcuts—just proven methods that deliver measurable rankings and revenue growth.
                                                </p>
                                                <p>
                                                    My approach is data-driven and results-focused. I believe in building long-term value through
                                                    ethical, white-hat strategies that stand the test of time and algorithm updates.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>

                        {/* Education */}
                        <FadeIn delay={0.2}>
                            <div className="mb-8 md:mb-12">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    <h2 className="text-xl md:text-2xl font-semibold">Education</h2>
                                </div>
                                <Card>
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <Image
                                                src={jainUniversityLogo}
                                                alt="Jain University logo"
                                                className="w-12 h-12 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                                                width={48}
                                                height={48}
                                            />
                                            <div>
                                                <h3 className="text-base md:text-lg font-semibold">MBA in Digital Marketing</h3>
                                                <p className="text-sm text-primary font-medium mb-1">Jain University</p>
                                                <p className="text-sm md:text-base text-muted-foreground">
                                                    Specialized in digital strategy, analytics, and marketing management.
                                                    This foundation helps me approach SEO from a holistic business perspective.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </FadeIn>

                        {/* Career Timeline */}
                        <FadeIn delay={0.3}>
                            <div className="mb-8 md:mb-12">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    <h2 className="text-xl md:text-2xl font-semibold">Career Journey</h2>
                                </div>
                                <StaggerContainer staggerDelay={0.1} className="space-y-3 md:space-y-4">
                                    {careerTimeline.map((job, index) => (
                                        <StaggerItem key={index}>
                                            <Card className="card-hover">
                                                <CardContent className="p-4 md:p-6">
                                                    <div className="flex items-start gap-4">
                                                        {job.logo && (
                                                            <Image
                                                                src={job.logo}
                                                                alt={`${job.company} logo`}
                                                                className="w-12 h-12 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                                                                width={48}
                                                                height={48}
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-2 mb-2">
                                                                <h3 className="text-base md:text-lg font-semibold">{job.role}</h3>
                                                                <span className="text-xs md:text-sm text-primary font-medium">{job.period}</span>
                                                            </div>
                                                            <p className="text-muted-foreground font-medium mb-1 md:mb-2 text-sm md:text-base">{job.company}</p>
                                                            <p className="text-xs md:text-sm text-muted-foreground">{job.description}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </FadeIn>

                        {/* Author Publications */}
                        <FadeIn delay={0.4}>
                            <div className="mb-8 md:mb-12">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <PenTool className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    <h2 className="text-xl md:text-2xl font-semibold">Author At</h2>
                                </div>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {authorPublications.map((pub, index) => (
                                        <a
                                            key={index}
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-muted hover:bg-primary/10 border border-border hover:border-primary/30 text-foreground text-xs md:text-sm font-medium transition-colors"
                                        >
                                            {pub.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Skills */}
                        <FadeIn delay={0.45}>
                            <div className="mb-8 md:mb-12">
                                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Core Expertise</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* CTA */}
                        <FadeIn delay={0.5}>
                            <div className="text-center">
                                <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
                                    Interested in working together? Let's discuss how I can help grow your organic presence.
                                </p>
                                <Link href="/contact">
                                    <Button size="lg" className="gap-2">
                                        Get in Touch
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </>
    );
};
