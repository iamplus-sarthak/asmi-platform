"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Megaphone, Calendar, Bell, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";

export function AnnouncementsSection() {
    const [activeTab, setActiveTab] = useState("all");
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [type, setType] = useState("quick");
    const [audience, setAudience] = useState("all");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getDocsAction({ collection: "announcements", limit: 100 });
            if (res.success && res.data) {
                setAnnouncements(res.data.docs);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async (status: string) => {
        if (!title.trim() || !message.trim()) {
            alert("Title and Message are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title,
                message,
                announcement_type: type,
                target_audience: audience,
                status
            };

            const res = await createDocAction({ collection: "announcements", data: payload });
            if (res.success) {
                setTitle("");
                setMessage("");
                setType("quick");
                setAudience("all");
                await fetchData();
            } else {
                alert(res.error || "Failed to create announcement");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsLoading(true);
        const res = await updateDocAction({ collection: "announcements", id, data: { status: newStatus } });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to update status");
            setIsLoading(false);
        }
    };

    const quickUpdates = announcements.filter(a => a.announcement_type === 'quick');
    const eventNotices = announcements.filter(a => a.announcement_type === 'event');
    const publishedCount = announcements.filter(a => a.status === 'published').length;

    const renderList = (items: any[]) => {
        if (items.length === 0 && !isLoading) {
            return <div className="p-4 text-center text-slate-500">No announcements found.</div>;
        }
        if (isLoading) {
            return <div className="p-4 text-center text-slate-500 flex justify-center"><Loader2 className="w-5 h-5 animate-spin mr-2"/> Loading...</div>;
        }
        
        return items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    {item.status === 'draft' && (
                        <button 
                            onClick={() => handleUpdateStatus(item.id, 'published')} 
                            className="text-xs text-blue-600 hover:underline font-medium"
                        >
                            Publish Now
                        </button>
                    )}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === 'published' ? 'bg-green-100 text-green-600' :
                        item.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                </div>
            </div>
        ));
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
                    <p className="text-slate-500 mt-1">Create and manage student announcements</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                    // Just scroll to form since it's inline in this design
                    document.getElementById('create-form')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <Megaphone className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{quickUpdates.length}</p>
                            <p className="text-sm text-slate-500">Quick Updates</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{eventNotices.length}</p>
                            <p className="text-sm text-slate-500">Event Notices</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Bell className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{publishedCount}</p>
                            <p className="text-sm text-slate-500">Total Published</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Create Form */}
            <Card id="create-form" className="p-6 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Announcement</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Announcement Type</Label>
                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                            >
                                <option value="quick">Quick Update</option>
                                <option value="event">Event Notice</option>
                                <option value="general">General Announcement</option>
                            </select>
                        </div>
                        <div>
                            <Label>Target Audience</Label>
                            <select 
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                className="w-full mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                            >
                                <option value="all">All Students</option>
                                <option value="neet">NEET Students</option>
                                <option value="jee">JEE Students</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label>Title</Label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter announcement title" 
                            className="mt-1" 
                        />
                    </div>

                    <div>
                        <Label>Message</Label>
                        <Textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your announcement message..." 
                            className="mt-1 min-h-[120px]" 
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            onClick={() => handleCreate('published')} 
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Publish Now
                        </Button>
                        <Button 
                            onClick={() => handleCreate('scheduled')} 
                            disabled={isSubmitting}
                            variant="outline"
                        >
                            Schedule for Later
                        </Button>
                        <Button 
                            onClick={() => handleCreate('draft')} 
                            disabled={isSubmitting}
                            variant="ghost"
                        >
                            Save as Draft
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Announcements List */}
            <Card className="p-6 border-slate-200">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Announcements</TabsTrigger>
                        <TabsTrigger value="quick">Quick Updates</TabsTrigger>
                        <TabsTrigger value="events">Event Notices</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                        <div className="space-y-3">
                            {renderList(announcements)}
                        </div>
                    </TabsContent>

                    <TabsContent value="quick" className="mt-4">
                        <div className="space-y-3">
                            {renderList(quickUpdates)}
                        </div>
                    </TabsContent>

                    <TabsContent value="events" className="mt-4">
                        <div className="space-y-3">
                            {renderList(eventNotices)}
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
