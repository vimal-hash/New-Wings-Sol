'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { CONTACT, NAV_LINKS, BRANDS } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative bg-elev border-t border-soft overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, #3B5BFF, #7E54E9, #FF5A38, #16A35C, transparent)',
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cobalt-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 flex items-center justify-center font-display font-bold text-white text-xl">
                N
              </div>
              <div>
                <div className="font-display text-xl text-fg font-semibold">
                  New Wings
                </div>
                <div className="text-[12px] tracking-[0.25em] text-soft mt-0.5">
                  Solutions
                </div>
              </div>
            </div>
            <p className="text-muted leading-relaxed max-w-md mb-6">
              India&apos;s trusted cinema renovation and equipment partner since 2019. Bringing world-class screens, sound, projection, and seating to theatres worldwide.
            </p>

            <div className="flex gap-3">
              {[
                // { Icon: Instagram, color: '#FF5A38' },
                { Icon: Linkedin, color: '#3B5BFF' },
                // { Icon: Facebook, color: '#7E54E9' },
              ].map(({ Icon, color }, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-full bg-soft border border-soft flex items-center justify-center transition-colors hover:border-strong group"
                >
                  <Icon
                    className="w-4 h-4 text-muted group-hover:text-fg transition-colors"
                    style={{ color }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-fg mb-5">Navigate</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-cobalt-500 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-fg mb-5">Partners</h4>
            <ul className="space-y-3">
              {BRANDS.slice(0, 6).map((b) => (
                <li key={b.name} className="text-muted text-sm">
                  {b.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-soft border border-soft mb-8"
        >
          <a
            href={`tel:${CONTACT.phone}`}
            className="flex items-center gap-3 hover:text-cobalt-500 transition-colors group"
          >
            <Phone className="w-5 h-5 text-cobalt-500" />
            <span className="text-sm text-fg">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-3 hover:text-coral-500 transition-colors group"
          >
            <Mail className="w-5 h-5 text-coral-500" />
            <span className="text-sm text-fg truncate">{CONTACT.email}</span>
          </a>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-fg">{CONTACT.address}</span>
          </div>
        </motion.div>

        <div className="pt-8 border-t border-soft flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-soft text-sm">
            © {new Date().getFullYear()} New Wings Solutions. All Rights Reserved.
          </p>
          <p className="text-soft text-sm">
            Crafted with care for the love of cinema.
          </p>
        </div>
      </div>
    </footer>
  );
}
