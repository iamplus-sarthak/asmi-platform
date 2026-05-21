"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getDocsAction, updateDocAction } from "@/actions/admin-crud";

export function SupportSection() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getDocsAction({ collection: "support_tickets", limit: 100, depth: 2 });
            if (res.success && res.data?.docs) {
                // Sort by newest first
                const sorted = res.data.docs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTickets(sorted);
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

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const handleUpdateTicket = async (updates: any) => {
        if (!selectedTicket) return;
        setIsSubmitting(true);
        try {
            const res = await updateDocAction({
                collection: "support_tickets",
                id: selectedTicket.id,
                data: updates
            });
            if (res.success) {
                await fetchData();
            } else {
                alert(res.error || "Failed to update ticket.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendReply = async (isInternal = false) => {
        if (!replyText.trim() || !selectedTicket) return;
        
        const newMessage = {
            sender_type: "admin",
            message: replyText,
            is_internal: isInternal,
            sent_at: new Date().toISOString()
        };

        const updatedMessages = [...(selectedTicket.messages || []), newMessage];
        
        // If an admin replies, it is marked as unread for the user, and read for admin.
        // Also if status is open, maybe change to in_progress.
        const updates: any = { 
            messages: updatedMessages,
            is_read_admin: true,
            is_read_user: false
        };

        if (selectedTicket.status === "open") {
            updates.status = "in_progress";
        }

        await handleUpdateTicket(updates);
        setReplyText("");
    };

    const markAsReadAdmin = async (ticket: any) => {
        if (!ticket.is_read_admin) {
            await updateDocAction({
                collection: "support_tickets",
                id: ticket.id,
                data: { is_read_admin: true }
            });
            fetchData(); // soft refresh
        }
    };

    const handleTicketSelect = (ticket: any) => {
        setSelectedTicketId(ticket.id);
        markAsReadAdmin(ticket);
    };

    // Metrics
    const openTickets = tickets.filter(t => t.status === "open").length;
    const inProgressTickets = tickets.filter(t => t.status === "in_progress").length;
    const resolvedTickets = tickets.filter(t => t.status === "resolved").length;

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
                            <h3 className="text-2xl font-bold text-slate-900">{isLoading ? "-" : openTickets}</h3>
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
                            <h3 className="text-2xl font-bold text-slate-900">{isLoading ? "-" : inProgressTickets}</h3>
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
                            <h3 className="text-2xl font-bold text-slate-900">{isLoading ? "-" : resolvedTickets}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Tickets</p>
                            <h3 className="text-2xl font-bold text-slate-900">{isLoading ? "-" : tickets.length}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <Card className="lg:col-span-1 p-6 border-slate-200 h-[600px] flex flex-col">
                    <Tabs defaultValue="open" className="flex-1 flex flex-col">
                        <TabsList className="w-full">
                            <TabsTrigger value="open" className="flex-1">Active</TabsTrigger>
                            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-2">
                            {isLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                            ) : tickets.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-4">No tickets found.</p>
                            ) : (
                                <>
                                    <TabsContent value="open" className="m-0 space-y-2">
                                        {(() => {
                                            const activeTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress");
                                            if (activeTickets.length === 0) return <p className="text-slate-500 text-sm text-center py-4">No active tickets.</p>;
                                            return activeTickets.map((ticket) => {
                                                const creatorName = typeof ticket.user_id === 'object' 
                                                    ? (ticket.user_id.entity_id?.value?.full_name || ticket.user_id.phone_number || "User") 
                                                    : "User";
                                                return (
                                                    <div
                                                        key={ticket.id}
                                                        onClick={() => handleTicketSelect(ticket)}
                                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTicketId === ticket.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-medium text-slate-900 text-sm">
                                                                {creatorName}
                                                            </h4>
                                                            {!ticket.is_read_admin && <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2 line-clamp-1">{ticket.subject}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                                ticket.priority === "urgent" ? "bg-red-100 text-red-600" :
                                                                ticket.priority === "high" ? "bg-orange-100 text-orange-600" :
                                                                ticket.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                                                                "bg-green-100 text-green-600"
                                                            }`}>
                                                                {ticket.priority.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        })()}
                                    </TabsContent>

                                    <TabsContent value="all" className="m-0 space-y-2">
                                        {tickets.map((ticket) => {
                                            const creatorName = typeof ticket.user_id === 'object' 
                                                ? (ticket.user_id.entity_id?.value?.full_name || ticket.user_id.phone_number || "User") 
                                                : "User";
                                            return (
                                                <div
                                                    key={ticket.id}
                                                    onClick={() => handleTicketSelect(ticket)}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTicketId === ticket.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-medium text-slate-900 text-sm">
                                                            {creatorName}
                                                        </h4>
                                                        {!ticket.is_read_admin && <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />}
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2 line-clamp-1">{ticket.subject}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                            ticket.status === "resolved" ? "bg-green-100 text-green-600" :
                                                            ticket.status === "closed" ? "bg-slate-100 text-slate-600" :
                                                            ticket.status === "in_progress" ? "bg-yellow-100 text-yellow-600" :
                                                            "bg-red-100 text-red-600"
                                                        }`}>
                                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        <span className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </TabsContent>
                                </>
                            )}
                        </div>
                    </Tabs>
                </Card>

                {/* Ticket Detail */}
                <Card className="lg:col-span-2 p-6 border-slate-200 h-[600px] flex flex-col">
                    {selectedTicket ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{selectedTicket.subject}</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {typeof selectedTicket.user_id === 'object' 
                                            ? `${selectedTicket.user_id.entity_id?.value?.full_name || "User"} • ${selectedTicket.user_id.phone_number}` 
                                            : "User Details"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {selectedTicket.status !== 'resolved' && (
                                        <Button variant="outline" size="sm" onClick={() => handleUpdateTicket({ status: 'resolved' })} disabled={isSubmitting}>
                                            Mark as Resolved
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                                {(selectedTicket.messages || []).map((msg: any, index: number) => {
                                    const isAdmin = msg.sender_type === "admin";
                                    const senderName = msg.is_internal ? "Internal Note (Admin)" : isAdmin ? "Support Team" : (typeof selectedTicket.user_id === 'object' ? (selectedTicket.user_id.entity_id?.value?.full_name || "User") : "User");
                                    return (
                                        <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[80%] ${
                                                msg.is_internal ? "bg-yellow-50 border-yellow-200" :
                                                isAdmin ? "bg-blue-50 border-blue-200" : 
                                                "bg-slate-50 border-slate-200"
                                            } border rounded-lg p-4`}>
                                                <div className="flex items-center justify-between gap-4 mb-2">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {senderName}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{new Date(msg.sent_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Reply */}
                            {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') ? (
                                <div className="pt-4 border-t border-slate-200 shrink-0">
                                    <Textarea 
                                        placeholder="Type your response..." 
                                        className="mb-3" 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex gap-2">
                                        <Button 
                                            className="bg-blue-600 hover:bg-blue-700" 
                                            onClick={() => handleSendReply(false)} 
                                            disabled={!replyText.trim() || isSubmitting}
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Send Reply
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                                            onClick={() => handleSendReply(true)} 
                                            disabled={!replyText.trim() || isSubmitting}
                                        >
                                            Add Internal Note
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-slate-200 shrink-0 text-center text-slate-500 text-sm">
                                    This ticket is {selectedTicket.status}. You cannot reply to it.
                                </div>
                            )}
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
