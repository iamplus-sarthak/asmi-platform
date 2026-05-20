"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText, Check, X, Link as LinkIcon, Image, FileOutput } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { ResourceForm } from "@/components/admin/forms/ResourceForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";

export function ResourcesSection() {
    const [resources, setResources] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { title: { like: search } } : {};
            const res = await getDocsAction({ collection: "resources", limit: 100, query });
            
            if (res.success && res.data) {
                setResources(res.data.docs);
            }
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingResource(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (resource: any) => {
        setEditingResource(resource);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (resource: any) => {
        if (!confirm(`Are you sure you want to delete ${resource.title}?`)) return;
        
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "resources", id: resource.id });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to delete");
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            let res;
            
            if (editingResource) {
                res = await updateDocAction({
                    collection: "resources",
                    id: editingResource.id,
                    data,
                });
            } else {
                res = await createDocAction({
                    collection: "resources",
                    data,
                });
            }

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save resource");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
            case 'image': return <Image className="h-5 w-5 text-blue-500" />;
            case 'link': return <LinkIcon className="h-5 w-5 text-indigo-500" />;
            default: return <FileOutput className="h-5 w-5 text-slate-500" />;
        }
    };

    const formatType = (type: string) => {
        const types: Record<string, string> = {
            pdf: "PDF Document",
            image: "Image",
            link: "External Link",
            other: "Other",
        };
        return types[type] || type;
    };

    const columns: Column<any>[] = [
        {
            header: "Resource Title",
            cell: (r) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center">
                        {getTypeIcon(r.resource_type)}
                    </div>
                    <span className="font-medium text-slate-900">{r.title}</span>
                </div>
            )
        },
        {
            header: "Type",
            cell: (r) => (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {formatType(r.resource_type)}
                </span>
            )
        },
        {
            header: "Attachment/URL",
            cell: (r) => {
                if (r.resource_type === 'link') {
                    return <a href={r.external_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] inline-block">{r.external_url}</a>;
                }
                if (r.file?.url) {
                    return <a href={r.file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] inline-block">View File</a>;
                }
                return <span className="text-slate-400">No file</span>;
            }
        },
        {
            header: "Published",
            cell: (r) => (
                r.is_published ? 
                <span className="flex items-center text-green-600"><Check className="h-4 w-4 mr-1" /> Yes</span> :
                <span className="flex items-center text-slate-400"><X className="h-4 w-4 mr-1" /> No</span>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Resources"
                description="Manage downloadable materials, PDFs, and links"
                columns={columns}
                data={resources}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search resources..."
            />

            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingResource ? "Edit Resource" : "Add Resource"}
                description={editingResource ? "Update resource details below." : "Fill in the details to add a new resource."}
            >
                <ResourceForm
                    initialData={editingResource}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </>
    );
}
