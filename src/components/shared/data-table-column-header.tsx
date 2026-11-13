"use client";

import type { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

/**
 * Sortable table header. Falls back to plain text when the column cannot be
 * sorted, so every header can use the same component.
 */
export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="text-sm font-medium text-gray-600">{title}</span>;
  }

  const sorted = column.getIsSorted();
  const SortIcon =
    sorted === "asc"
      ? ChevronUp
      : sorted === "desc"
        ? ChevronDown
        : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 gap-1.5 px-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      <SortIcon
        className={sorted ? "size-3.5" : "size-3.5 text-gray-400"}
        aria-hidden="true"
      />
    </Button>
  );
}
