import { BackgroundBeamsWithCollisionDemo } from "@/components/user/BackgroundBeamsWithCollisionDemo";
import { HeroSection } from "@/components/user/HeroSection";
import React from "react";
import Footer from "../../components/user/Footer";
import Contact from "../../components/user/Contact";
import { LiveSheetsAvailability } from "@/components/user/LiveSheetsAvailability";
import { getCurrentUser } from "@/lib/actions/user.actions";

const Home = async() => {
    const user = await getCurrentUser();
    console.log(user);

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <HeroSection />
      <section className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 justify-start bg-gradient-to-br from-gray-100 to-white md:my-40 md:grid-cols-3 dark:from-neutral-900 dark:to-neutral-950">
        <div
          className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
          //   style={"--background: #ffffff; --color: rgba(0, 0, 0, 0.2); --height: 1px; --width: 5px; --fade-stop: 90%; --offset: 200px; --color-dark: rgba(255, 255, 255, 0.2); mask-composite: exclude;"}
        ></div>
        <div
          className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"
          //   style="--background: #ffffff; --color: rgba(0, 0, 0, 0.2); --height: 1px; --width: 5px; --fade-stop: 90%; --offset: 200px; --color-dark: rgba(255, 255, 255, 0.2); mask-composite: exclude;"
        ></div>
        <div
          className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
          //   style="--background: #ffffff; --color: rgba(0, 0, 0, 0.2); --height: 5px; --width: 1px; --fade-stop: 90%; --offset: 80px; --color-dark: rgba(255, 255, 255, 0.2); mask-composite: exclude;"
        ></div>
        <div
          className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"
          //   style="--background: #ffffff; --color: rgba(0, 0, 0, 0.2); --height: 5px; --width: 1px; --fade-stop: 90%; --offset: 80px; --color-dark: rgba(255, 255, 255, 0.2); mask-composite: exclude;"
        ></div>
        <div className="p-8 md:col-span-2 md:p-14">
          <h2 className="text-left text-xl font-medium tracking-tight text-neutral-500 md:text-3xl dark:text-neutral-200">
            Build websites faster and 10x better than your competitors with
            <span className="font-bold text-black dark:text-white">
              &nbsp;Aceternity UI Pro
            </span>
          </h2>
          <p className="mt-4 text-base text-neutral-700 dark:text-neutral-200">
            With the best in class components and templates, stand out from the
            crowd and get more attention to your website. Trusted by founders
            and entrepreneurs from all over the world.
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4">
            <a
              className="bg-slate-900 dark:bg-white dark:text-black no-underline flex space-x-2 group cursor-pointer relative hover:shadow-2xl transition duration-200 shadow-zinc-900 p-px font-semibold text-white px-4 py-2 h-14 w-full items-center justify-center rounded-2xl text-center text-sm sm:w-52"
              target="_blank"
              href="https://pro.aceternity.com"
            >
              Go Pro
            </a>
            <button className="flex h-14 w-full items-center justify-center rounded-2xl border border-transparent bg-white text-sm text-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 hover:shadow-lg sm:w-52 dark:border-neutral-600 dark:bg-black dark:text-white">
              Talk to us
            </button>
          </div>
        </div>
        <div className="border-t border-dashed p-8 md:border-t-0 md:border-l md:p-14">
          <div className="text-base text-neutral-700 dark:text-neutral-200">
            Manu is the man! He is the best front-end developer I have worked
            with. He took the requirements and quite literally ran with them. We
            are super happy with the result and product we go...
          </div>
          <div className="mt-4 flex flex-col items-start gap-1 text-sm">
            <p className="font-bold text-neutral-800 dark:text-neutral-200">
              John Shahawy
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Founder at Rogue and Moonbeam
            </p>
          </div>
        </div>
      </section>

      <BackgroundBeamsWithCollisionDemo />

      <section className="relative z-20 mx-auto py-20 px-5 flex w-full max-w-7xl items-center gap-5 justify-center dark:from-neutral-900 dark:to-neutral-950 flex-col">
        <div className="pb-10 text-center w-full sm:w-3/4 md:w-1/2">
          <h2 className="text-black dark:text-white text-xl font-medium tracking-tight md:text-3xl">
            Live Sheet Availability
          </h2>
          <p className="mt-4 text-base text-neutral-700 dark:text-neutral-200">
            With the best in class components and templates, stand out from the
            crowd and get more attention to your website. Trusted by founders
            and entrepreneurs from all over the world.
          </p>
        </div>
        <LiveSheetsAvailability />
      </section>

      <Contact />

      <Footer />
    </div>
  );
};

export default Home;
