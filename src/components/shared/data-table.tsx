"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];
const SKELETON_ROW_COUNT = 5;

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Column ids searched by the global filter (text search). */
  searchableColumnIds?: string[];
  /** Controlled global filter value, driven by the page-level search input. */
  globalFilter?: string;
  isLoading?: boolean;
  /** Rendered in place of the rows when there is no data to display. */
  emptyState?: ReactNode;
  pageSizeOptions?: number[];
  /** Noun used in the result count, e.g. "rôle" / "rôles". */
  itemLabel?: [singular: string, plural: string];
  /** Stable row id, required when highlighting a selected row. */
  getRowId?: (row: TData) => string;
  selectedRowId?: string | null;
  /** Makes rows clickable (mouse + Enter/Space) to open a details view. */
  onRowClick?: (row: TData) => void;
};

export default function DataTable<TData>({
  columns,
  data,
  searchableColumnIds = [],
  globalFilter = "",
  isLoading = false,
  emptyState,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemLabel = ["résultat", "résultats"],
  getRowId,
  selectedRowId = null,
  onRowClick,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const globalFilterFn = useMemo<FilterFn<TData>>(
    () => (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();
      if (!query) return true;

      return searchableColumnIds.some((columnId) => {
        const value = row.getValue(columnId);
        return (
          typeof value === "string" && value.toLowerCase().includes(query)
        );
      });
    },
    [searchableColumnIds],
  );

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: pageSizeOptions[0] } },
  });

  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
      <Table>
        <TableHeader className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-gray-50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-12 px-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {columns.map((_column, columnIndex) => (
                  <TableCell key={columnIndex} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full max-w-40" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const isSelected = selectedRowId === row.id;
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={cn(
                    "border-gray-100 transition-colors",
                    onRowClick &&
                      "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none",
                    isSelected
                      ? "bg-navy-light hover:bg-navy-light"
                      : "hover:bg-gray-50",
                  )}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {totalRows === 0
            ? "Aucun résultat"
            : `${firstRow}–${lastRow} sur ${totalRows} ${totalRows > 1 ? itemLabel[1] : itemLabel[0]}`}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Lignes par page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
              items={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
            >
              <SelectTrigger
                size="sm"
                className="w-[72px]"
                aria-label="Nombre de lignes par page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft aria-hidden="true" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
