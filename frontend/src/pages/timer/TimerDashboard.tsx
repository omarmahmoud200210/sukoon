import { TimerList, Statistics } from "@/components/features/timer";
import { motion, useReducedMotion } from "framer-motion";
import { pageVariants, getReducedVariants } from "@/lib/animations";

export default function TimerDashboard() {
  const shouldReduce = useReducedMotion();
  const page = getReducedVariants(shouldReduce, pageVariants);

  return (
    <motion.main
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col bg-background min-w-[360px] transition-colors duration-500 overflow-hidden"
    >
      <div className="flex-1 overflow-hidden p-4 md:pt-8 md:pr-8 md:pb-8 md:pl-0">
        <div className="max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row gap-4 md:gap-6 lg:gap-8 h-full">
          <div className="grow lg:w-1/2 h-full overflow-hidden">
            <TimerList />
          </div>

          <div className="grow lg:w-1/2 h-full overflow-hidden">
            <Statistics />
          </div>
        </div>
      </div>
    </motion.main>
  );
}
