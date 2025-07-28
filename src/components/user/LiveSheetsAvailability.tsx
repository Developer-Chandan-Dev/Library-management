"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function LiveSheetsAvailability() {
  return (
    <ul className="flex items-center justify-center gap-5 flex-wrap">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        bgColor="green-800"
        title="Total Sheets"
        description="60"
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        bgColor="green-400"
        title="Free Sheets"
        description="15"
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        bgColor="yellow-500"
        title="Half-Time Occupied"
        description="10"
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        bgColor="red-500"
        title="Fully Occupied"
        description="30"
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  bgColor: string;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, bgColor, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[10rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3 w-40">
            <div className={`w-fit rounded-lg border border-${bgColor} p-3 bg-${bgColor}`}/>
            <div className="space-y-3">
              <h3 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {title}
              </h3>
              <h2 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
