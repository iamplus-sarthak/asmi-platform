"use client";

import React, { useState } from "react";
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function SupportSection() {
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

    const tickets = [
        { id: 1, user: "Rahul Sharma", subject: "Cannot access allotment data", priority: "High", status: "Open", time: "2 hours ago", unread: true },
        { id: 2, user: "Priya Patel", subject: "Payment not reflecting", priority: "Urgent", status: "In Progress", time: "5 hours ago", unread: true },
        { id: 3, user: "Amit Kumar", subject: "How to download seat matrix?", priority: "Low", status: "Open", time: "1 day ago", unread: false },
        { id: 4, user: "Sneha Singh", subject: "Video not playing", priority: "Medium", status: "Resolved", time: "2 days ago", unread: false },
    ];

    const ticketDetails = {
        id: 2,
        user: "Priya Patel",
        email: "priya.patel@email.com",
        subject: "Payment not reflecting",
        priority: "Urgent",
        status: "In Progress",
        created: "5 hours ago",
        messages: [
            { from: "Priya Patel", message: "I made a payment of ₹1,999 for Pro package but it's not showing in my account.", time: "5 hours ago", isAdmin: false },
            { from: "Admin", message: "Thank you for reaching out. Can you please share your transaction ID?", time: "4 hours ago", isAdmin: true },
            { from: "Priya Patel", message: "Sure, it's TXN12345678", time: "3 hours ago", isAdmin: false },
            { from: "Admin", message: "Thank you! I'm checking with our payment team. Will update you shortly.", time: "2 hours ago", isAdmin: true },
        ]
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
                    <p className="text-slate-500 mt-1">Manage student queries and support requests</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Open</p>
                            <h3 className="text-2xl font-bold text-slate-900">12</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">In Progress</p>
                            <h3 className="text-2xl font-bold text-slate-900">8</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Resolved</p>
                            <h3 className="text-2xl font-bold text-slate-900">45</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Avg Response</p>
                            <h3 className="text-2xl font-bold text-slate-900">2.3h</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <Card className="lg:col-span-1 p-6 border-slate-200">
                    <Tabs defaultValue="open">
                        <TabsList className="w-full">
                            <TabsTrigger value="open" className="flex-1">Open</TabsTrigger>
                            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                        </TabsList>

                        <TabsContent value="open" className="mt-4 space-y-2">
                            {tickets.filter(t => t.status !== "Resolved").map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTicket === ticket.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium text-slate-900 text-sm">{ticket.user}</h4>
                                        {ticket.unread && <span className="h-2 w-2 bg-blue-600 rounded-full" />}
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2 line-clamp-1">{ticket.subject}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ticket.priority === "Urgent" ? "bg-red-100 text-red-600" :
                                                ticket.priority === "High" ? "bg-orange-100 text-orange-600" :
                                                    ticket.priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
                                                        "bg-green-100 text-green-600"
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-xs text-slate-500">{ticket.time}</span>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="all" className="mt-4 space-y-2">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTicket === ticket.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium text-slate-900 text-sm">{ticket.user}</h4>
                                        {ticket.unread && <span className="h-2 w-2 bg-blue-600 rounded-full" />}
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2 line-clamp-1">{ticket.subject}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ticket.status === "Resolved" ? "bg-green-100 text-green-600" :
                                                ticket.status === "In Progress" ? "bg-yellow-100 text-yellow-600" :
                                                    "bg-red-100 text-red-600"
                                            }`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-xs text-slate-500">{ticket.time}</span>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Ticket Detail */}
                <Card className="lg:col-span-2 p-6 border-slate-200">
                    {selectedTicket ? (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{ticketDetails.subject}</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {ticketDetails.user} • {ticketDetails.email}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Mark as Resolved</Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Close</Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {ticketDetails.messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] ${msg.isAdmin ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"} border rounded-lg p-4`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-semibold text-slate-900">{msg.from}</span>
                                                <span className="text-xs text-slate-500">{msg.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply */}
                            <div className="pt-4 border-t border-slate-200">
                                <Textarea placeholder="Type your response..." className="mb-3" />
                                <div className="flex gap-2">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Send Reply</Button>
                                    <Button variant="outline">Add Internal Note</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                <p>Select a ticket to view details</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
