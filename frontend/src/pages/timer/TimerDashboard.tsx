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
      <div className="flex-1 overflow-hidden pt-8 pr-8 pb-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 h-full">
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
