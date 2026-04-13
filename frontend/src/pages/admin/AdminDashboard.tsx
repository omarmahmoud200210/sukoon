import { useAdmin } from "@/hooks/useAdmin";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { useStats, useHealth } = useAdmin();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: health, isLoading: healthLoading } = useHealth();
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-on-surface to-on-surface/60 bg-clip-text text-transparent">
            Admin Overview
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base">
            System statistics and health metrics at a glance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats?.totalUsers, icon: "group", color: "text-blue-500", bg: "bg-blue-500/10", link: "/admin/users" },
          { label: "Total Tasks", value: stats?.totalTasks, icon: "task_alt", color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Comments", value: stats?.totalComments, icon: "chat", color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Focus Sessions", value: stats?.totalPomodoroSessions, icon: "timer", color: "text-tertiary", bg: "bg-tertiary/10" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 hover:border-outline-variant/30 transition-all flex flex-col justify-between relative group overflow-hidden">
            <div className="flex items-start justify-between mb-4 relative z-10">
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider font-label">{stat.label}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            
            <div className="relative z-10">
              {statsLoading ? (
                <div className="w-16 h-8 bg-surface-container-high rounded animate-pulse"></div>
              ) : (
                <span className="text-3xl font-bold text-on-surface">{stat.value?.toLocaleString() || 0}</span>
              )}
            </div>
            
            {stat.link && (
               <Link to={stat.link} className="absolute inset-0 z-20"></Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container rounded-[2rem] p-6 md:p-8 border border-outline-variant/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">speed</span>
              System Health
            </h2>
            <Link to="/admin/system" className="text-sm text-primary hover:underline">View details</Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">database</span>
                <span className="font-medium">Database Status</span>
              </div>
              {healthLoading ? (
                <div className="w-20 h-6 bg-surface-container-high rounded animate-pulse"></div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${health?.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="capitalize text-sm font-medium">{health?.database.status || 'Unknown'}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">memory</span>
                <span className="font-medium">Memory Usage</span>
              </div>
              {healthLoading ? (
                <div className="w-20 h-6 bg-surface-container-high rounded animate-pulse"></div>
              ) : (
                <span className="text-sm font-medium">{health?.server.memoryUsage.heapUsedMB} MB</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
