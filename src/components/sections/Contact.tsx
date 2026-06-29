'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { CONTACT } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { Starfield, ConcentricRings } from '@/components/ui/Decorations';
import { useQuoteForm, type QuoteFormValues } from '@/hooks/useQuoteForm';
import { useTranslation } from '@/i18n';

const METHODS = [
  { icon: Phone, label: 'Call Us', value: CONTACT.phone, href: `tel:${CONTACT.phone}`, color: '#3B5BFF' },
  { icon: Mail, label: 'Primary Email', value: CONTACT.email1, href: `mailto:${CONTACT.email1}`, color: '#FF5A38' },
  { icon: Mail, label: 'Secondary Email', value: CONTACT.email2, href: `mailto:${CONTACT.email2}`, color: '#7E54E9' },
  { icon: MapPin, label: 'Office', value: CONTACT.address, href: '#', color: '#16A35C' },
];

export default function Contact() {
  const { form, onSubmit, isSubmitting, isSuccess, errorMessage, errors } =
    useQuoteForm();
  const { register } = form;
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative section-pad overflow-hidden bg-soft">
      {/* CREATIVE BG 1: Aurora orbit */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg, #3B5BFF40, #7E54E940, #FF5A3840, #16A35C40, #3B5BFF40)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />

      {/* CREATIVE BG 2: Starfield */}
      <div className="absolute inset-0 text-cobalt-500/40 pointer-events-none">
        <Starfield color="currentColor" count={50} className="w-full h-full" />
      </div>

      {/* CREATIVE BG 3: Concentric rings */}
      <div className="absolute top-0 right-0 text-cobalt-500/10">
        <ConcentricRings color="currentColor" className="w-[600px] h-[600px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-soft opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
                <Sparkles className="w-4 h-4 text-cobalt-500" />
                <span className="eyebrow text-cobalt-500">{t('contact.badge')}</span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg leading-tight">
                {t('contact.title1')}
                <br />
                <span className="editorial-italic text-cobalt-500">
                  {t('contact.title2')}
                </span>
                <br />
                {t('contact.title3')}
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="mt-8 text-lg text-muted max-w-lg leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </Reveal>

            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {METHODS.map((m, i) => (
                <motion.a
                  key={i}
                  href={m.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-elev border border-soft hover:border-strong transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${m.color}15`,
                      border: `1px solid ${m.color}30`,
                    }}
                  >
                    <m.icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="eyebrow text-soft">
                      {m.label}
                    </div>
                    <div className="text-fg font-medium truncate mt-1">
                      {m.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <Reveal direction="up" delay={0.7}>
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm text-fg font-medium">
                    {t('contact.response')}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-10 md:p-12 rounded-3xl bg-elev border border-strong glow-cobalt"
          >
            <h3 className="font-display text-3xl text-fg mb-3">
              Get a Free Consultation
            </h3>
            <p className="text-muted text-sm mb-10">
              Tell us a bit about your project. No commitment.
            </p>

            <div className="space-y-6">
              {([
                { key: 'name', type: 'text', placeholder: 'John Doe' },
                { key: 'email', type: 'email', placeholder: 'john@cinema.com' },
                { key: 'company', type: 'text', placeholder: 'Royal Cinemas' },
              ] as const).map((field, idx) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <label htmlFor={field.key} className="block eyebrow text-soft mb-2">
                    {t(`contact.${field.key}`)}
                  </label>
                  <input
                    id={field.key}
                    type={field.type}
                    {...register(field.key)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-cobalt-500 focus:bg-elev focus:outline-none text-fg placeholder-soft transition-all"
                  />
                  {errors[field.key as keyof QuoteFormValues] && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors[field.key as keyof QuoteFormValues]?.message}
                    </p>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="message" className="block eyebrow text-soft mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  placeholder="Tell us about your theatre, what you'd like to upgrade, timeline..."
                  className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-cobalt-500 focus:bg-elev focus:outline-none text-fg placeholder-soft transition-all resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message?.message}</p>
                )}
              </motion.div>

              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="beam group relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-fg font-semibold transition-all disabled:opacity-70"
                style={{ color: 'var(--bg)' }}
              >
                {isSuccess ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t('contact.success')}
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {t('contact.submit')}
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
