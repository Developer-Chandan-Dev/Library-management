import { HeroSection } from "@/components/user/HeroSection";
import Footer from "../../components/user/Footer";
import Contact from "../../components/user/Contact";
import { LiveSeatAvailability } from "@/components/user/LiveSeatAvailability";
import { getCurrentUser } from "@/lib/actions/user.actions";
import FeatureGrid from "@/components/user/FeatureGrid";
import { HowItWorks } from "@/components/user/HowItWorks";
import { StatsSection } from "@/components/user/StatsSection";
import Link from "next/link";
import { FAQSection } from "@/components/user/FAQSection";

const Home = async () => {
  const user = await getCurrentUser();

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <HeroSection />
      <section className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 justify-start bg-gradient-to-br from-gray-100 to-white md:my-40 md:grid-cols-3 dark:from-neutral-900 dark:to-neutral-950">
        <div className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"></div>
        <div className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"></div>
        <div className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"></div>
        <div className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"></div>
        <div className="p-8 md:col-span-2 md:p-14">
          <h2 className="text-left text-xl font-medium tracking-tight text-neutral-500 md:text-3xl dark:text-neutral-200">
            Smart Seat Management Solutions for
            <span className="font-bold text-black dark:text-white">
              &nbsp;Modern Libraries
            </span>
          </h2>
          <p className="mt-4 text-base text-neutral-700 dark:text-neutral-200">
            Optimize your library space with real-time seat tracking, instant
            reservations, and smart occupancy monitoring. Trusted by academic
            institutions to enhance student experience and facility utilization.
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4">
            <Link
              className="bg-slate-900 dark:bg-white dark:text-black no-underline flex space-x-2 group cursor-pointer relative hover:shadow-2xl transition duration-200 shadow-zinc-900 p-px font-semibold text-white px-4 py-2 h-14 w-full items-center justify-center rounded-2xl text-center text-sm sm:w-52"
              href="/register"
            >
              Resigter Now
            </Link>
            <button
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-transparent bg-white text-sm text-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 hover:shadow-lg sm:w-52 dark:border-neutral-600 dark:bg-black dark:text-white"
            >
              View Availability
            </button>
          </div>
        </div>
        <div className="border-t border-dashed p-8 md:border-t-0 md:border-l md:p-14">
          <div className="text-base text-neutral-700 dark:text-neutral-200">
            Implementing this system reduced overcrowding by 60% while
            increasing seat utilization efficiency. Students appreciate the
            real-time updates and hassle-free reservation process.
          </div>
          <div className="mt-4 flex flex-col items-start gap-1 text-sm">
            <p className="font-bold text-neutral-800 dark:text-neutral-200">
              Dr. Priya Sharma
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Library Director at Delhi Technical University
            </p>
          </div>
        </div>
      </section>

      <FeatureGrid />
      <HowItWorks />
      <StatsSection />

      <section
        id="live-availability"
        className="relative z-20 mx-auto py-20 px-5 flex w-full max-w-7xl items-center gap-5 justify-center flex-col"
      >
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
        <LiveSeatAvailability />
      </section>
      <FAQSection />
      <Contact />

      <Footer />
    </div>
  );
};

export default Home;
