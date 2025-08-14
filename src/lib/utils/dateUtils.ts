// utils/dateUtils.ts

/**
 * Converts an ISO 8601 timestamp string to various readable date formats
 */
export class DateConverter {
  private date: Date;

  constructor(isoString: string) {
    this.date = new Date(isoString);
    
    // Validate the date
    if (isNaN(this.date.getTime())) {
      throw new Error(`Invalid date string: ${isoString}`);
    }
  }

  /**
   * Returns a formatted date string based on locale
   * @param locale - BCP 47 language tag (default: 'en-US')
   * @param options - Intl.DateTimeFormatOptions
   */
  toLocaleString(
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions
  ): string {
    return this.date.toLocaleString(locale, options);
  }

  /**
   * Returns date in MM/DD/YYYY format
   */
  toShortDate(): string {
    return this.date.toLocaleDateString('en-US');
  }

  /**
   * Returns date in "Month DD, YYYY" format
   */
  toLongDate(): string {
    return this.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Returns date and time in readable format
   * Example: "August 5, 2025 at 11:44 AM"
   */
  toDateTime(): string {
    return this.date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Returns relative time (e.g., "2 hours ago", "3 days ago")
   */
  toRelativeTime(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return this.toLongDate();
    }
  }

  /**
   * Returns time only in 12-hour format
   * Example: "11:44 AM"
   */
  toTimeString(): string {
    return this.date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Returns time only in 24-hour format
   * Example: "11:44"
   */
  toTime24(): string {
    return this.date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Returns ISO date string (YYYY-MM-DD)
   */
  toISODate(): string {
    return this.date.toISOString().split('T')[0];
  }

  /**
   * Returns the original Date object
   */
  toDate(): Date {
    return new Date(this.date);
  }

  /**
   * Custom format using tokens
   * Tokens: YYYY, MM, DD, HH, mm, ss
   */
  format(template: string): string {
    const year = this.date.getFullYear().toString();
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
    const day = this.date.getDate().toString().padStart(2, '0');
    const hours = this.date.getHours().toString().padStart(2, '0');
    const minutes = this.date.getMinutes().toString().padStart(2, '0');
    const seconds = this.date.getSeconds().toString().padStart(2, '0');

    return template
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}

// Convenience functions for quick usage
export const formatDate = (isoString: string) => {
  return new DateConverter(isoString);
};

/**
 * Quick conversion functions
 */
export const dateUtils = {
  toShort: (isoString: string) => new DateConverter(isoString).toShortDate(),
  toLong: (isoString: string) => new DateConverter(isoString).toLongDate(),
  toDateTime: (isoString: string) => new DateConverter(isoString).toDateTime(),
  toRelative: (isoString: string) => new DateConverter(isoString).toRelativeTime(),
  toTime: (isoString: string) => new DateConverter(isoString).toTimeString(),
};

// Example usage:
/*
const timestamp = "2025-08-05T11:44:25.853+00:00";

// Using the class
const dateConverter = new DateConverter(timestamp);
console.log(dateConverter.toLongDate()); // "August 5, 2025"
console.log(dateConverter.toDateTime()); // "August 5, 2025 at 11:44 AM"
console.log(dateConverter.toRelativeTime()); // "2 hours ago" (example)

// Using convenience functions
console.log(formatDate(timestamp).toLongDate()); // "August 5, 2025"
console.log(dateUtils.toShort(timestamp)); // "8/5/2025"

// Custom formatting
console.log(dateConverter.format('YYYY-MM-DD HH:mm')); // "2025-08-05 11:44"
*/