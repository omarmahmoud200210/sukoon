import { useState, useMemo } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useTranslation } from "react-i18next";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { ExistingUser, UserRole } from "@/types/auth";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function AdminUsers() {
  const { t } = useTranslation();
  const { useUsers, useUpdateUserRole, useUpdateUserStatus } = useAdmin();
  const { data: users = [], isLoading } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();

  const [globalFilter, setGlobalFilter] = useState("");
  
  const [roleConfirm, setRoleConfirm] = useState<{ isOpen: boolean; user: ExistingUser | null; newRole: UserRole | string } | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{ isOpen: boolean; user: ExistingUser | null } | null>(null);

  const columns = useMemo<ColumnDef<ExistingUser>[]>(() => [
    {
      accessorKey: "firstName",
      header: t("admin.users.columns.name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          {row.original.avatarUrl ? (
            <img src={row.original.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-outline-variant/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {row.original.firstName[0]}{row.original.lastName[0]}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface">{row.original.firstName} {row.original.lastName}</span>
            <span className="text-xs text-on-surface-variant max-w-[120px] truncate">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("admin.users.columns.role"),
      cell: ({ row }) => (
        <select
          value={row.original.role}
          onChange={(e) => {
            setRoleConfirm({ isOpen: true, user: row.original, newRole: e.target.value });
          }}
          disabled={updateUserRole.isPending}
          className="bg-surface border border-outline-variant/30 rounded-lg text-xs py-1 px-2 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="USER">{t("admin.users.roles.user")}</option>
          <option value="ADMIN">{t("admin.users.roles.admin")}</option>
        </select>
      ),
    },
    {
      accessorKey: "isActive",
      header: t("admin.users.columns.status"),
      cell: ({ row }) => (
        <button
          onClick={() => {
            setStatusConfirm({ isOpen: true, user: row.original });
          }}
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            row.original.isActive
              ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
          }`}
        >
          {row.original.isActive ? t("admin.users.status.active") : t("admin.users.status.banned")}
        </button>
      ),
    },
    {
      accessorKey: "oauth",
      header: t("admin.users.columns.loginType"),
      cell: ({ row }) => (
        <span className="text-xs text-on-surface-variant bg-surface-container py-1 px-2 rounded-md">
          {row.original.oauth ? t("admin.users.oauth.google") : t("admin.users.oauth.email")}
        </span>
      ),
    },
  ], [t, updateUserRole.isPending]);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleConfirmRole = () => {
    if (roleConfirm?.user && roleConfirm?.newRole) {
       updateUserRole.mutate({ id: parseInt(roleConfirm.user.id), role: roleConfirm.newRole as UserRole });
    }
    setRoleConfirm(null);
  };

  const handleConfirmStatus = () => {
    if (statusConfirm?.user) {
       updateUserStatus.mutate({ id: parseInt(statusConfirm.user.id), isActive: !statusConfirm.user.isActive });
    }
    setStatusConfirm(null);
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-on-surface to-on-surface/60 bg-clip-text text-transparent">
            {t("admin.users.title")}
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base">
            {t("admin.users.description")}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
            search
          </span>
          <input
            type="text"
            placeholder={t("admin.users.search")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full bg-surface border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
          />
        </div>
      </div>

      <div className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <div className="h-10 w-full animate-pulse bg-on-surface-variant/10 rounded-lg"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse pt-2 border-t border-outline-variant/10">
                <div className="h-10 w-10 bg-on-surface-variant/10 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-on-surface-variant/10 rounded w-[200px]"></div>
                  <div className="h-3 bg-on-surface-variant/10 rounded w-[150px]"></div>
                </div>
                <div className="h-8 bg-on-surface-variant/10 rounded-lg w-[100px]"></div>
                <div className="h-8 bg-on-surface-variant/10 rounded-full w-[80px]"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-outline-variant/20 bg-surface/50">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-outline-variant/10 hover:bg-surface/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                 <div className="p-8 text-center text-on-surface-variant text-sm">
                   {t("admin.users.noUsers")}
                 </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface/30 mt-auto shrink-0">
              <span className="text-xs text-on-surface-variant">
                Showing {table.getRowModel().rows.length} row(s)
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                </button>
                <span className="text-sm font-medium">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                   <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!roleConfirm?.isOpen}
        onClose={() => setRoleConfirm(null)}
        onConfirm={handleConfirmRole}
        title={t("admin.users.dialogs.roleTitle")}
        description={t("admin.users.dialogs.roleDesc", { 
          name: roleConfirm?.user?.firstName, 
          newRole: roleConfirm?.newRole === "ADMIN" ? t("admin.users.roles.admin") : t("admin.users.roles.user") 
        })}
        confirmText={t("admin.users.dialogs.confirm")}
        cancelText={t("admin.users.dialogs.cancel")}
      />

      <ConfirmDialog
        isOpen={!!statusConfirm?.isOpen}
        onClose={() => setStatusConfirm(null)}
        onConfirm={handleConfirmStatus}
        title={t("admin.users.dialogs.statusTitle")}
        description={
          statusConfirm?.user?.isActive
            ? t("admin.users.dialogs.statusDescDeactivate", { name: statusConfirm.user.firstName })
            : t("admin.users.dialogs.statusDescActivate", { name: statusConfirm?.user?.firstName })
        }
        confirmText={t("admin.users.dialogs.confirm")}
        cancelText={t("admin.users.dialogs.cancel")}
      />
    </div>
  );
}
