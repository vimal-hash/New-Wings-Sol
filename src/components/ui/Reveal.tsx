'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

const variantsMap: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -40 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1 },
  },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  margin = '-80px',
  as: Tag = 'div',
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  margin?: string;
  as?: 'div' | 'section' | 'article' | 'header';
}) {
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: margin as `${number}px` }}
      variants={variantsMap[direction]}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// Stagger container
export function RevealGroup({
  children,
  className,
  staggerChildren = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
