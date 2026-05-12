"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export function ContactPageContent() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        website: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await emailjs.send(
                'service_vyo6d5t', // Service ID
                'template_oxwiq1r', // Template ID
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    company: formData.company,
                    website: formData.website,
                    message: formData.message,
                },
                '55VneOagkBBvVQDN0' // Public Key
            );

            setIsSubmitting(false);
            setIsSubmitted(true);
            toast({
                title: "Message sent!",
                description: "Thank you for reaching out. I'll get back to you within 24 hours.",
            });
            setFormData({
                name: "",
                email: "",
                company: "",
                website: "",
                message: "",
            });
        } catch (error) {
            console.error('FAILED...', error);
            setIsSubmitting(false);
            toast({
                title: "Error sending message",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="section">
            <div className="container-wide">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <FadeIn>
                        <div className="text-center mb-8 md:mb-12">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                                Let's <span className="text-primary">Connect</span>
                            </h1>
                            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
                                Ready to grow your organic traffic? I'd love to hear about your project and discuss how I can help.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Contact Info */}
                        <StaggerContainer staggerDelay={0.1} className="lg:col-span-1 space-y-4 md:space-y-6">
                            <StaggerItem>
                                <Card>
                                    <CardContent className="p-4 md:p-6">
                                        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Information</h2>
                                        <address className="not-italic space-y-3 md:space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                                                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm md:text-base">Location</p>
                                                    <p className="text-xs md:text-sm text-muted-foreground">
                                                        Srinagar, Jammu & Kashmir<br />India
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Mail className="h-4 w-4 md:h-5 md:w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm md:text-base">Email</p>
                                                    <a
                                                        href="mailto:hi@sharikrasool.com"
                                                        className="text-xs md:text-sm text-primary hover:underline"
                                                    >
                                                        hi@sharikrasool.com
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Phone className="h-4 w-4 md:h-5 md:w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm md:text-base">Phone</p>
                                                    <a
                                                        href="tel:+917006500941"
                                                        className="text-xs md:text-sm text-primary hover:underline"
                                                    >
                                                        +91 7006500941
                                                    </a>
                                                </div>
                                            </div>
                                        </address>
                                    </CardContent>
                                </Card>
                            </StaggerItem>

                            <StaggerItem>
                                <Card>
                                    <CardContent className="p-4 md:p-6">
                                        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">What to Expect</h2>
                                        <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <span>Response within 24 hours</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <span>Free initial consultation</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <span>Custom strategy proposal</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <span>No obligation quote</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        </StaggerContainer>

                        {/* Contact Form */}
                        <FadeIn delay={0.2} className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-4 md:p-6 lg:p-8">
                                    {isSubmitted ? (
                                        <div className="text-center py-8 md:py-12">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                                                <CheckCircle className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-semibold mb-2">Message Sent!</h2>
                                            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                                                Thank you for reaching out. I'll get back to you within 24 hours.
                                            </p>
                                            <Button onClick={() => setIsSubmitted(false)} variant="outline">
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm md:text-base">Full Name *</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                        className="text-sm md:text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        required
                                                        className="text-sm md:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="company" className="text-sm md:text-base">Company Name</Label>
                                                    <Input
                                                        id="company"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        placeholder="Your Company"
                                                        className="text-sm md:text-base"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="website" className="text-sm md:text-base">Website URL</Label>
                                                    <Input
                                                        id="website"
                                                        name="website"
                                                        type="url"
                                                        value={formData.website}
                                                        onChange={handleChange}
                                                        placeholder="https://example.com"
                                                        className="text-sm md:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-sm md:text-base">Your Message *</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Tell me about your project and SEO goals..."
                                                    rows={5}
                                                    required
                                                    className="text-sm md:text-base"
                                                />
                                            </div>

                                            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>Sending...</>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
