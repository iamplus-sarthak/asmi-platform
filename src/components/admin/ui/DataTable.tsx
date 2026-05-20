"use client";

import React, { useState } from "react";
import { Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    title: string;
    description?: string;
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onAdd?: () => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
}

export function DataTable<T extends { id?: string | number }>({
    title,
    description,
    columns,
    data,
    isLoading = false,
    onAdd,
    onEdit,
    onDelete,
    searchPlaceholder = "Search...",
    onSearch,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) onSearch(value);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                    {description && <p className="text-slate-500 mt-1">{description}</p>}
                </div>
                {onAdd && (
                    <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
                        Add New
                    </Button>
                )}
            </div>

            <Card className="p-6 border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 max-w-md"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {columns.map((col, i) => (
                                    <th key={i} className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                                        {col.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="py-8 text-center text-slate-500">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Loading data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="py-8 text-center text-slate-500">
                                        No results found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-slate-100 hover:bg-slate-50">
                                        {columns.map((col, i) => (
                                            <td key={i} className="py-4 px-4 text-sm text-slate-700">
                                                {col.cell ? col.cell(item) : (item as any)[col.accessorKey as string]}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {onEdit && (
                                                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button variant="ghost" size="sm" onClick={() => onDelete(item)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
