"use client";

import { MonitorCheck, Clock, Bell, Shield } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      icon: <MonitorCheck className="w-8 h-8" />,
      title: "Real-time Seat Tracking",
      desc: "Live updates of seat availability across all campus libraries"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Reservations",
      desc: "Book seats in advance or find available spots instantly"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      desc: "Get reminders before your reservation time starts"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Access",
      desc: "QR code validation and student ID verification"
    }
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-white dark:bg-neutral-800 shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}