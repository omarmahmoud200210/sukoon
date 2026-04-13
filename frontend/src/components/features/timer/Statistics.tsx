import StatisticsItems from "./StatisticsItems";
import FocusRecord from "./FocusRecord";

export default function Statistics() {
  return (
    <aside className="flex flex-col h-full space-y-4 overflow-hidden">
      <div className="shrink-0">
        <StatisticsItems />
      </div>
      <div className="flex-1 overflow-hidden">
        <FocusRecord />
      </div>
    </aside>
  );
}
