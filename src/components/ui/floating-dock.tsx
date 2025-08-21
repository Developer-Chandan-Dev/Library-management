// src/components/ui/floating-dock.tsx
"use client";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; href: string; icon: React.ReactNode }[];
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex items-center justify-center gap-4 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-white/10 px-4 py-3",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className="flex size-10 items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
        >
          <div className="text-white">{item.icon}</div>
        </Link>
      ))}
    </motion.div>
  );
};