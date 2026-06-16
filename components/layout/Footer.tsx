import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Classes', href: '/classes' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

const classLinks = [
  { label: 'Salsa', href: '/classes#salsa' },
  { label: 'Bachata', href: '/classes#bachata' },
  { label: 'Kizomba', href: '/classes#kizomba' },
  { label: 'Hip-Hop', href: '/classes#hip-hop' },
  { label: 'Contemporary', href: '/classes#contemporary' },
  { label: 'Bollywood', href: '/classes#bollywood' },
]

const socials = [
  { icon: Instagram, href: 'https://www.instagram.com/salsawalastudios/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/salsawalastudios/', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@salsawalastudios', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-bold text-ink">SALSAWALA</span>
              <span className="font-body text-[9px] tracking-[0.3em] text-gold-dark uppercase">Studios • Kolkata</span>
            </div>
            <p className="text-ink/50 text-sm leading-relaxed mb-6 font-body">
              Kolkata&apos;s premier dance studio near Park Street. 15+ dance styles, expert instructors, and a community that moves together.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white border border-dark-border flex items-center justify-center text-ink/50 hover:text-primary-dark hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-ink font-semibold mb-5 text-sm tracking-widest uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/50 hover:text-primary-dark text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Classes */}
          <div>
            <h3 className="font-display text-ink font-semibold mb-5 text-sm tracking-widest uppercase">
              Dance Styles
            </h3>
            <ul className="space-y-3">
              {classLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/50 hover:text-primary-dark text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-ink font-semibold mb-5 text-sm tracking-widest uppercase">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary-dark mt-0.5 shrink-0" />
                <span className="text-ink/50 text-sm font-body">
                  Near Park Street, Kolkata, West Bengal — 700016
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-dark shrink-0" />
                <a href="tel:+919830158223" className="text-ink/50 hover:text-primary-dark text-sm font-body transition-colors">
                  +91 98301 58223
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-dark shrink-0" />
                <a href="mailto:salsawalastudios@gmail.com" className="text-ink/50 hover:text-primary-dark text-sm font-body transition-colors">
                  salsawalastudios@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-white border border-dark-border rounded-xl">
              <p className="text-xs text-ink/40 font-body">Studio Hours</p>
              <p className="text-sm text-ink/70 font-body mt-1">Mon–Fri: 5:30 PM – 10:00 PM</p>
              <p className="text-sm text-ink/70 font-body">Sat–Sun: 9:00 AM – 10:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink/30 text-xs font-body">
            © {new Date().getFullYear()} Salsawala Studios. All rights reserved.
          </p>
          <p className="text-ink/30 text-xs font-body flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-gold-dark fill-gold-dark" /> by Shuvendu
          </p>
        </div>
      </div>
    </footer>
  )
}
