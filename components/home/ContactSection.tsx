import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ContactSection() {
  return (
    <section className="py-24 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left info */}
          <div>
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
              Find Us
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Come Dance
              <br />
              <span className="bg-crimson-gradient bg-clip-text text-transparent">With Us</span>
            </h2>
            <p className="font-body text-white/60 mb-8 leading-relaxed">
              Located in the heart of Kolkata near Park Street — one of the city&apos;s most vibrant cultural hubs. Drop by anytime during studio hours or book a class online.
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white">Studio Address</p>
                  <p className="font-body text-sm text-white/50 mt-0.5">Near Park Street, Kolkata, West Bengal — 700016</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white">Phone</p>
                  <a href="tel:+919830158223" className="font-body text-sm text-white/50 hover:text-primary transition-colors">
                    +91 98301 58223
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white">Email</p>
                  <a href="mailto:salsawalastudios@gmail.com" className="font-body text-sm text-white/50 hover:text-primary transition-colors">
                    salsawalastudios@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white">Studio Hours</p>
                  <p className="font-body text-sm text-white/50 mt-0.5">Mon–Fri: 5:30 PM – 10:00 PM</p>
                  <p className="font-body text-sm text-white/50">Sat–Sun: 9:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a href="https://www.instagram.com/salsawalastudios/" target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/salsawalastudios/" target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/@salsawalastudios" target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: Map placeholder + contact CTA */}
          <div className="space-y-4">
            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-dark-border aspect-[4/3] bg-dark-card relative">
              <div className="absolute inset-0 bg-gradient-to-br from-dark-surface to-dark-card flex flex-col items-center justify-center">
                <MapPin className="h-12 w-12 text-primary mb-3 opacity-60" />
                <p className="font-display text-white font-semibold">Salsawala Studios</p>
                <p className="font-body text-sm text-white/40 mt-1">Near Park Street, Kolkata</p>
                <a
                  href="https://maps.google.com/?q=Salsawala+Studios+Kolkata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm text-primary hover:text-primary-light font-body transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Quick contact CTA */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-white mb-2">Have Questions?</h3>
              <p className="font-body text-sm text-white/50 mb-4">
                Want to know which class is right for you? Our team is happy to help!
              </p>
              <div className="flex gap-3">
                <Link href="/contact" className="flex-1">
                  <Button variant="primary" className="w-full">Send a Message</Button>
                </Link>
                <a href="tel:+919830158223" className="flex-1">
                  <Button variant="secondary" className="w-full">Call Us</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
