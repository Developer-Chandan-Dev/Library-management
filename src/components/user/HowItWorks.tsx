"use client";

import { Search, CalendarCheck, UserCheck, Clock } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Find Available Seats",
      desc: "Check real-time availability by library or time slot"
    },
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Book Your Spot",
      desc: "Reserve for immediate use or schedule future sessions"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Check In",
      desc: "Validate your reservation with student ID at entry"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Track Time",
      desc: "Monitor your remaining time with automatic alerts"
    }
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6">
              <div className="mx-auto mb-4 text-blue-600 dark:text-blue-400 flex items-center justify-center ">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}