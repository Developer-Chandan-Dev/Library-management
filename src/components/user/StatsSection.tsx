"use client";

export function StatsSection() {
  const stats = [
    { number: "15,000+", label: "Daily Seat Reservations" },
    { number: "24/7", label: "Access Monitoring" },
    { number: "98%", label: "User Satisfaction Rate" },
    { number: "50+", label: "Campus Locations" }
  ];

  return (
    <section className="py-12 bg-white dark:bg-neutral-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-neutral-600 dark:text-neutral-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}