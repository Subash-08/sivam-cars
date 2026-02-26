import { siteConfig } from '@/config/site';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export function LocationSection() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl flex flex-col lg:flex-row">

                    {/* Map Area */}
                    <div className="lg:w-3/5 bg-accent/30 relative min-h-[300px] lg:min-h-full flex items-center justify-center p-8">
                        {/* Placeholder for map - in production, this could be an iframe or static map image */}
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-foreground/80 mb-2">Visit Our Showroom</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Located conveniently in the heart of the city. Navigate easily using Google Maps.
                            </p>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex mt-6 items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-lg hover:bg-foreground/90 transition-colors"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Contact Info Area */}
                    <div className="lg:w-2/5 p-10 lg:p-14 bg-card border-l border-border flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-foreground mb-8">Contact & Location</h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg mb-1">Our Showroom</h4>
                                    <p className="text-muted-foreground leading-relaxed">{siteConfig.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg mb-1">Working Hours</h4>
                                    <p className="text-muted-foreground leading-relaxed">{siteConfig.workingHours}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg mb-1">Call Us</h4>
                                    <a href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} className="text-primary hover:underline font-medium text-lg leading-relaxed">{siteConfig.phone}</a>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg mb-1">Email Us</h4>
                                    <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline font-medium leading-relaxed">{siteConfig.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
