"use client";

import React, { useState } from "react";
import { Plus, Megaphone, Calendar, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function AnnouncementsSection() {
    const [activeTab, setActiveTab] = useState("all");

    const announcements = {
        quick: [
            { id: 1, title: "NEET 2025 Round 2 Results Delayed", date: "2 hours ago", status: "Published" },
            { id: 2, title: "Server Maintenance Tonight", date: "5 hours ago", status: "Published" },
        ],
        events: [
            { id: 3, title: "JEE Main Counselling Webinar", date: "Tomorrow, 3:00 PM", status: "Scheduled" },
            { id: 4, title: "NEET PG Round 1 Choice Filling", date: "Dec 25, 2025", status: "Scheduled" },
        ],
        all: [
            { id: 5, title: "Updated Fee Structure for 2025", date: "Yesterday", status: "Published" },
            { id: 6, title: "New Video Series on Counselling", date: "2 days ago", status: "Published" },
        ]
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
                    <p className="text-slate-500 mt-1">Create and manage student announcements</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
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
                            <p className="text-2xl font-bold text-slate-900">8</p>
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
                            <p className="text-2xl font-bold text-slate-900">12</p>
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
                            <p className="text-2xl font-bold text-slate-900">45</p>
                            <p className="text-sm text-slate-500">Total Published</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Create Form */}
            <Card className="p-6 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Announcement</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Announcement Type</Label>
                            <select className="w-full mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
                                <option>Quick Update</option>
                                <option>Event Notice</option>
                                <option>General Announcement</option>
                            </select>
                        </div>
                        <div>
                            <Label>Target Audience</Label>
                            <select className="w-full mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
                                <option>All Students</option>
                                <option>NEET Students</option>
                                <option>JEE Students</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label>Title</Label>
                        <Input placeholder="Enter announcement title" className="mt-1" />
                    </div>

                    <div>
                        <Label>Message</Label>
                        <Textarea placeholder="Write your announcement message..." className="mt-1 min-h-[120px]" />
                    </div>

                    <div className="flex gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Publish Now</Button>
                        <Button variant="outline">Schedule for Later</Button>
                        <Button variant="ghost">Save as Draft</Button>
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
                            {announcements.all.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    <div>
                                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.date}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="quick" className="mt-4">
                        <div className="space-y-3">
                            {announcements.quick.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    <div>
                                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.date}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="events" className="mt-4">
                        <div className="space-y-3">
                            {announcements.events.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    <div>
                                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.date}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
