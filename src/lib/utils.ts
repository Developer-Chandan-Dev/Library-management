import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStringify(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  prefix: '@upstash/ratelimit/contact'
});

