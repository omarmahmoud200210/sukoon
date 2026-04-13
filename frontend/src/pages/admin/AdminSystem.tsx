import { useAdmin } from "@/hooks/useAdmin";

export default function AdminSystem() {
  const { useHealth } = useAdmin();
  const { data: health, isLoading, isError } = useHealth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
      </div>
    );
  }

  if (isError || !health) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4 text-error">
        <span className="material-symbols-outlined text-5xl">error</span>
        <h2 className="text-xl font-bold">Failed to load system health</h2>
      </div>
    );
  }

  const uptimeHours = (health.server.uptimeSeconds / 3600).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-on-surface to-on-surface/60 bg-clip-text text-transparent">
          System Diagnostics
        </h1>
        <p className="text-on-surface-variant mt-2 text-sm md:text-base">
          Detailed metrics about backend performance and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API / Server Card */}
        <div className="bg-surface-container rounded-[2rem] p-6 md:p-8 border border-outline-variant/20 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">dns</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Server Engine</h2>
              <p className="text-sm text-on-surface-variant">Node.js Express App</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-medium">Uptime</span>
              <span className="font-bold">{uptimeHours} hours</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-medium">RSS Memory</span>
              <span className="font-bold">{health.server.memoryUsage.rssMB} MB</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-medium">Heap Total</span>
              <span className="font-bold">{health.server.memoryUsage.heapTotalMB} MB</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-on-surface-variant font-medium">Heap Used</span>
              <span className="font-bold">{health.server.memoryUsage.heapUsedMB} MB</span>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className="bg-surface-container rounded-[2rem] p-6 md:p-8 border border-outline-variant/20 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${health.database.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              <span className="material-symbols-outlined">database</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Database</h2>
              <p className="text-sm text-on-surface-variant">PostgreSQL via Prisma</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-medium">Status</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health.database.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${health.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="font-bold capitalize">{health.database.status}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-on-surface-variant font-medium">Query Latency</span>
              <span className="font-bold">{health.database.latencyMs} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
