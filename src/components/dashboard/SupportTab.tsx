"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LifeBuoy, Plus, MessageSquare, Send, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { getDocsAction, createDocAction, updateDocAction } from "@/actions/admin-crud";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";

export function SupportTab() {
    const { user, isLoading: isAuthLoading } = useAuthStore();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Ticket Form State
    const [newSubject, setNewSubject] = useState("");
    const [newPriority, setNewPriority] = useState("medium");
    const [newMessage, setNewMessage] = useState("");

    const fetchTickets = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const res = await getDocsAction({ 
                collection: "support_tickets", 
                limit: 100, 
                query: { user_id: { equals: user.id } } 
            });
            if (res.success && res.data?.docs) {
                const sorted = res.data.docs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTickets(sorted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!isAuthLoading) fetchTickets();
    }, [isAuthLoading, fetchTickets]);

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const markAsReadUser = async (ticket: any) => {
        if (!ticket.is_read_user) {
            await updateDocAction({
                collection: "support_tickets",
                id: ticket.id,
                data: { is_read_user: true }
            });
            fetchTickets();
        }
    };

    const handleSelectTicket = (ticket: any) => {
        setSelectedTicketId(ticket.id);
        markAsReadUser(ticket);
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedTicket || !user?.id) return;
        setIsSubmitting(true);
        try {
            const newMsg = {
                sender_type: "user",
                sender_id: user.id,
                message: replyText,
                is_internal: false,
                sent_at: new Date().toISOString()
            };
            const updatedMessages = [...(selectedTicket.messages || []), newMsg];
            
            const updates: any = { 
                messages: updatedMessages,
                is_read_admin: false,
                is_read_user: true
            };

            await updateDocAction({
                collection: "support_tickets",
                id: selectedTicket.id,
                data: updates
            });
            
            setReplyText("");
            await fetchTickets();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateTicket = async () => {
        if (!newSubject.trim() || !newMessage.trim() || !user?.id) return;
        setIsSubmitting(true);
        try {
            const initialMessage = {
                sender_type: "user",
                sender_id: user.id,
                message: newMessage,
                is_internal: false,
                sent_at: new Date().toISOString()
            };

            await createDocAction({
                collection: "support_tickets",
                data: {
                    user_id: user.id,
                    subject: newSubject,
                    priority: newPriority,
                    status: "open",
                    is_read_admin: false,
                    is_read_user: true,
                    messages: [initialMessage]
                }
            });

            setIsCreateModalOpen(false);
            setNewSubject("");
            setNewMessage("");
            setNewPriority("medium");
            await fetchTickets();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="flex-1 h-[calc(100vh-10.5rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-10.5rem)]">
            {/* Sidebar List */}
            <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-slate-200 bg-slate-50/50 flex flex-col">
                <div className="p-6 border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <LifeBuoy className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-900">Support</h2>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            New
                        </Button>
                    </div>
                    <div className="relative">
                        <Input placeholder="Search tickets..." className="w-full bg-slate-50 border-slate-200" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tickets.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm">No tickets found.</p>
                            <p className="text-xs mt-1">Create one to get help.</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div 
                                key={ticket.id} 
                                onClick={() => handleSelectTicket(ticket)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                    selectedTicketId === ticket.id 
                                        ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20" 
                                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 flex-1 pr-2">
                                        {ticket.subject}
                                    </h4>
                                    {!ticket.is_read_user && (
                                        <div className="h-2.5 w-2.5 bg-blue-600 rounded-full shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                        {ticket.status === "resolved" ? (
                                            <Badge variant="green">Resolved</Badge>
                                        ) : ticket.status === "in_progress" ? (
                                            <Badge variant="yellow">In Progress</Badge>
                                        ) : ticket.status === "closed" ? (
                                            <Badge variant="gray">Closed</Badge>
                                        ) : (
                                            <Badge variant="blue">Open</Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedTicket ? (
                    <>
                        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2>
                                <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500">
                                    <span>Ticket #{selectedTicket.id}</span>
                                    <span>•</span>
                                    <span className="capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedTicket.priority === 'urgent' && <Badge variant="red">Urgent</Badge>}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                            {(selectedTicket.messages || [])
                                .filter((msg: any) => !msg.is_internal) // Hide internal admin notes
                                .map((msg: any, index: number) => {
                                    const isMe = msg.sender_type === "user";
                                    return (
                                        <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                                                isMe 
                                                    ? "bg-blue-600 text-white rounded-tr-sm" 
                                                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-sm"
                                            }`}>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className={`text-xs font-semibold ${isMe ? "text-blue-100" : "text-slate-500"}`}>
                                                        {isMe ? "You" : "Asmi Support"}
                                                    </span>
                                                    <span className={`text-[10px] ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                                                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isMe ? "text-blue-50" : "text-slate-700"}`}>
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' ? (
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <div className="max-w-4xl mx-auto flex gap-3 relative">
                                    <Textarea 
                                        placeholder="Type your message here..." 
                                        className="resize-none min-h-[60px] py-3 pr-14 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                        disabled={isSubmitting}
                                    />
                                    <Button 
                                        onClick={handleSendReply} 
                                        disabled={!replyText.trim() || isSubmitting}
                                        size="icon"
                                        className="absolute right-2 bottom-2 h-10 w-10 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <div className="text-center mt-2 text-xs text-slate-400">
                                    Press Enter to send, Shift + Enter for new line
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-slate-200 bg-slate-50 text-center">
                                <p className="text-slate-500 text-sm font-medium">This ticket is marked as {selectedTicket.status}. Replies are disabled.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                            <LifeBuoy className="h-10 w-10 text-blue-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">How can we help you?</h3>
                        <p className="text-slate-500 max-w-sm text-center">
                            Select a ticket from the sidebar to view your conversation, or create a new ticket to get assistance from our team.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Create Support Ticket</SheetTitle>
                        <SheetDescription>
                            Describe your issue in detail. Our support team will get back to you as soon as possible.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subject</label>
                            <Input 
                                placeholder="E.g., Payment failed but amount deducted" 
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Priority</label>
                            <Select value={newPriority} onValueChange={setNewPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low (General Query)</SelectItem>
                                    <SelectItem value="medium">Medium (Requires Assistance)</SelectItem>
                                    <SelectItem value="high">High (Service Disruption)</SelectItem>
                                    <SelectItem value="urgent">Urgent (Payment/Access Issue)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Message</label>
                            <Textarea 
                                placeholder="Please provide all relevant details..." 
                                className="min-h-[120px]"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            onClick={handleCreateTicket}
                            disabled={!newSubject.trim() || !newMessage.trim() || isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Ticket
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function Badge({ children, variant }: { children: React.ReactNode, variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }) {
    const variants = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        green: "bg-green-50 text-green-700 border-green-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200",
        gray: "bg-slate-100 text-slate-600 border-slate-200"
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${variants[variant]}`}>
            {children}
        </span>
    );
}
