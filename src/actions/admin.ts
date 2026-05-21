'use server';

import { getLocalPayload } from '@/lib/payload';

export async function testDbConnectionAction() {
    try {
        const payload = await getLocalPayload();
        
        // Count users to verify connection
        const users = await payload.find({
            collection: 'users',
            limit: 1,
        });

        return { success: true, totalDocs: users.totalDocs };
    } catch (error) {
        console.error('Test DB Connection Error:', error);
        return { error: 'Failed to connect to database' };
    }
}

export async function getAnalyticsDataAction() {
    try {
        const payload = await getLocalPayload();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // 1. User Metrics
        const totalUsers = await payload.find({ collection: 'users', limit: 1 });
        const activeToday = await payload.find({ collection: 'users', where: { last_login_at: { greater_than_equal: today } }, limit: 1 });
        const newThisWeek = await payload.find({ collection: 'users', where: { createdAt: { greater_than_equal: lastWeek } }, limit: 1 });

        // Calculate trends vs last month
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        
        const usersThisMonth = await payload.find({ collection: 'users', where: { createdAt: { greater_than_equal: startOfThisMonth } }, limit: 1 });
        const usersLastMonth = await payload.find({ collection: 'users', where: { createdAt: { greater_than_equal: startOfLastMonth, less_than: startOfThisMonth } }, limit: 1 });
        
        let totalUsersChange = 0;
        if (usersLastMonth.totalDocs === 0) {
            totalUsersChange = usersThisMonth.totalDocs > 0 ? 100 : 0;
        } else {
            totalUsersChange = Math.round(((usersThisMonth.totalDocs - usersLastMonth.totalDocs) / usersLastMonth.totalDocs) * 100);
        }

        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
        const activeYesterday = await payload.find({ collection: 'users', where: { last_login_at: { greater_than_equal: yesterday, less_than: today } }, limit: 1 });
        let activeChange = 0;
        if (activeYesterday.totalDocs === 0) {
            activeChange = activeToday.totalDocs > 0 ? 100 : 0;
        } else {
            activeChange = Math.round(((activeToday.totalDocs - activeYesterday.totalDocs) / activeYesterday.totalDocs) * 100);
        }

        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
        const newLastWeek = await payload.find({ collection: 'users', where: { createdAt: { greater_than_equal: twoWeeksAgo, less_than: lastWeek } }, limit: 1 });
        let newWeekChange = 0;
        if (newLastWeek.totalDocs === 0) {
            newWeekChange = newThisWeek.totalDocs > 0 ? 100 : 0;
        } else {
            newWeekChange = Math.round(((newThisWeek.totalDocs - newLastWeek.totalDocs) / newLastWeek.totalDocs) * 100);
        }

        // Calculate Retention Rate (Users created > 7 days ago who logged in within last 7 days)
        const oldUsers = await payload.find({ collection: 'users', where: { createdAt: { less_than: lastWeek } }, limit: 1 });
        const retainedUsers = await payload.find({ collection: 'users', where: { createdAt: { less_than: lastWeek }, last_login_at: { greater_than_equal: lastWeek } }, limit: 1 });
        let retentionRate = 0;
        if (oldUsers.totalDocs > 0) {
            retentionRate = Math.round((retainedUsers.totalDocs / oldUsers.totalDocs) * 100 * 10) / 10; // 1 decimal place
        }

        // Calculate Past Retention Rate (for comparison)
        const veryOldUsers = await payload.find({ collection: 'users', where: { createdAt: { less_than: startOfLastMonth } }, limit: 1 });
        const retainedLastMonth = await payload.find({ collection: 'users', where: { createdAt: { less_than: startOfLastMonth }, last_login_at: { greater_than_equal: startOfLastMonth, less_than: startOfThisMonth } }, limit: 1 });
        let pastRetentionRate = 0;
        if (veryOldUsers.totalDocs > 0) {
            pastRetentionRate = Math.round((retainedLastMonth.totalDocs / veryOldUsers.totalDocs) * 100 * 10) / 10;
        }
        const retentionChange = Math.round((retentionRate - pastRetentionRate) * 10) / 10;

        // 2. Content Metrics
        const topInstitute = await payload.find({ collection: 'institutes', sort: '-views', limit: 1 });
        const topCounselling = await payload.find({ collection: 'counsellings', sort: '-views', limit: 1 });
        const topVideo = await payload.find({ collection: 'videos', sort: '-views', limit: 1 });
        const topResource = await payload.find({ collection: 'resources', sort: '-downloads', limit: 1 });

        // 3. Platform Analytics (Global Fallback + Real Sessions)
        const allSessions = await payload.find({ collection: 'sessions', limit: 10000 });
        
        let avgSessionDurationStr = "0m 0s";
        let pagesPerSessionNum = 0;
        let bounceRateNum = 0;

        if (allSessions.totalDocs > 0) {
            const totalDuration = allSessions.docs.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0);
            const avgSeconds = Math.round(totalDuration / allSessions.totalDocs);
            const mins = Math.floor(avgSeconds / 60);
            const secs = avgSeconds % 60;
            avgSessionDurationStr = `${mins}m ${secs}s`;

            const totalPages = allSessions.docs.reduce((sum: number, s: any) => sum + (s.page_views || 1), 0);
            pagesPerSessionNum = Math.round((totalPages / allSessions.totalDocs) * 10) / 10;

            const bouncedSessions = allSessions.docs.filter((s: any) => s.is_bounced).length;
            bounceRateNum = Math.round((bouncedSessions / allSessions.totalDocs) * 100 * 10) / 10;
        }

        let platformAnalytics = await payload.findGlobal({ slug: 'platform_analytics' });
        if (!platformAnalytics || Object.keys(platformAnalytics).length === 0 || !platformAnalytics.avg_session_duration) {
            platformAnalytics = {
                retention_rate: 0,
                retention_rate_change: "0%",
                retention_trend: "up",
                avg_session_duration: avgSessionDurationStr,
                pages_per_session: pagesPerSessionNum,
                bounce_rate: bounceRateNum,
                tool_usage: []
            } as any;
        } else {
            // Override with real calculated values even if global exists
            platformAnalytics.avg_session_duration = avgSessionDurationStr;
            platformAnalytics.pages_per_session = pagesPerSessionNum;
            platformAnalytics.bounce_rate = bounceRateNum;
        }

        // 4. Revenue Trends
        const payments = await payload.find({ collection: 'payments', limit: 1000 });
        const revenueByMonth = payments.docs.reduce((acc: any, payment: any) => {
            const date = new Date(payment.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = { revenue: 0, subscriptions: 0 };
            acc[month].revenue += payment.amount || 0;
            acc[month].subscriptions += 1;
            return acc;
        }, {});
        
        // Format to array for frontend
        const revenueData = Object.keys(revenueByMonth).map(month => ({
            month,
            revenue: `₹${revenueByMonth[month].revenue.toLocaleString('en-IN')}`,
            subscriptions: revenueByMonth[month].subscriptions
        }));

        return {
            success: true,
            data: {
                users: {
                    total: totalUsers.totalDocs,
                    totalChange: `${totalUsersChange >= 0 ? '+' : ''}${totalUsersChange}%`,
                    totalTrend: totalUsersChange >= 0 ? 'up' : 'down',
                    
                    activeToday: activeToday.totalDocs,
                    activeChange: `${activeChange >= 0 ? '+' : ''}${activeChange}%`,
                    activeTrend: activeChange >= 0 ? 'up' : 'down',
                    
                    newThisWeek: newThisWeek.totalDocs,
                    newWeekChange: `${newWeekChange >= 0 ? '+' : ''}${newWeekChange}%`,
                    newWeekTrend: newWeekChange >= 0 ? 'up' : 'down',

                    retentionRate: retentionRate,
                    retentionChange: `${retentionChange >= 0 ? '+' : ''}${retentionChange}%`,
                    retentionTrend: retentionChange >= 0 ? 'up' : 'down',
                },
                content: {
                    topInstitute: topInstitute.docs[0],
                    topCounselling: topCounselling.docs[0],
                    topVideo: topVideo.docs[0],
                    topResource: topResource.docs[0],
                },
                platform: platformAnalytics,
                revenue: revenueData,
            }
        };
    } catch (error) {
        console.error('Analytics Data Error:', error);
        return { error: 'Failed to fetch analytics data' };
    }
}

export async function getDashboardDataAction() {
    try {
        const payload = await getLocalPayload();
        
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString();

        // Helper to calculate percentage change
        const calcChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Number((((current - previous) / previous) * 100).toFixed(1));
        };

        // 1. Total Students
        const students = await payload.find({ collection: 'students', limit: 1 });
        const studentsLastMonth = await payload.find({ 
            collection: 'students', 
            where: { createdAt: { less_than_equal: endOfLastMonth } }, 
            limit: 1 
        });
        const studentsChange = calcChange(students.totalDocs, studentsLastMonth.totalDocs);

        // 2. Active Subscriptions
        const activeSubs = await payload.find({ collection: 'user_subscriptions', where: { status: { equals: 'active' } }, limit: 1 });
        const activeSubsLastMonth = await payload.find({ 
            collection: 'user_subscriptions', 
            where: { status: { equals: 'active' }, createdAt: { less_than_equal: endOfLastMonth } }, 
            limit: 1 
        });
        const subsChange = calcChange(activeSubs.totalDocs, activeSubsLastMonth.totalDocs);

        // 3. Monthly Revenue
        const thisMonthPayments = await payload.find({ 
            collection: 'payments', 
            where: { status: { equals: 'success' }, createdAt: { greater_than_equal: startOfThisMonth } }, 
            limit: 1000 
        });
        const lastMonthPayments = await payload.find({ 
            collection: 'payments', 
            where: { status: { equals: 'success' }, createdAt: { greater_than_equal: startOfLastMonth, less_than_equal: endOfLastMonth } }, 
            limit: 1000 
        });
        const monthlyRevenue = thisMonthPayments.docs.reduce((sum, p: any) => sum + (p.amount || 0), 0);
        const lastMonthRevenue = lastMonthPayments.docs.reduce((sum, p: any) => sum + (p.amount || 0), 0);
        const revenueChange = calcChange(monthlyRevenue, lastMonthRevenue);

        // 4. Support Tickets (All)
        const openTickets = await payload.find({ 
            collection: 'support_tickets', 
            limit: 1 
        });
        // For tickets, change is often based on how many were created this month vs last month, rather than active count.
        const ticketsThisMonth = await payload.find({ 
            collection: 'support_tickets', 
            where: { createdAt: { greater_than_equal: startOfThisMonth } }, 
            limit: 1 
        });
        const ticketsLastMonth = await payload.find({ 
            collection: 'support_tickets', 
            where: { createdAt: { greater_than_equal: startOfLastMonth, less_than_equal: endOfLastMonth } }, 
            limit: 1 
        });
        const ticketsChange = calcChange(ticketsThisMonth.totalDocs, ticketsLastMonth.totalDocs);

        // 5. Recent Activity
        const recentActivity = await payload.find({
            collection: 'admin_activity_logs',
            sort: '-createdAt',
            limit: 5,
        });

        // 6. Pending Tasks
        const pendingTasks = await payload.find({
            collection: 'admin_tasks',
            where: { is_completed: { equals: false } },
            sort: '-createdAt',
            limit: 10,
        });

        // 7. Format Open Tickets as Tasks to unify the workflow
        const openTicketsTasks = await payload.find({
            collection: 'support_tickets',
            where: { or: [{ status: { equals: 'open' } }, { status: { equals: 'in_progress' } }] },
            sort: '-createdAt',
            limit: 10,
        });

        const mergedTasks = [
            ...pendingTasks.docs.map((t: any) => ({
                id: t.id,
                task: t.task,
                priority: t.priority || 'medium',
                type: 'admin_task'
            })),
            ...openTicketsTasks.docs.map((t: any) => ({
                id: t.id,
                task: `Resolve Support Ticket: ${t.subject || 'No Subject'}`,
                priority: t.priority === 'urgent' ? 'high' : t.priority || 'medium',
                type: 'support_ticket'
            }))
        ];

        // Add TimeAgo helper
        const timeAgo = (dateStr: string) => {
            const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
            if (diff < 60) return `${diff} seconds ago`;
            if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
            return `${Math.floor(diff / 86400)} days ago`;
        };

        const formattedActivity = recentActivity.docs.map((log: any) => ({
            action: log.action,
            user: log.user_name,
            time: timeAgo(log.createdAt),
        }));

        return {
            success: true,
            stats: {
                totalStudents: students.totalDocs,
                studentsChange: studentsChange,
                activeSubscriptions: activeSubs.totalDocs,
                subsChange: subsChange,
                monthlyRevenue: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
                revenueChange: revenueChange,
                supportTickets: openTickets.totalDocs,
                ticketsChange: ticketsChange,
            },
            recentActivity: formattedActivity,
            pendingTasks: mergedTasks,
        };
    } catch (error) {
        console.error('Failed to get dashboard data:', error);
        return { success: false, error: 'Failed to fetch dashboard data' };
    }
}

export async function toggleAdminTaskAction(taskId: string, isCompleted: boolean, type: string = 'admin_task') {
    try {
        const payload = await getLocalPayload();
        
        if (type === 'support_ticket') {
            await payload.update({
                collection: 'support_tickets',
                id: taskId,
                data: { status: isCompleted ? 'resolved' : 'in_progress' } as any,
            });
        } else {
            await payload.update({
                collection: 'admin_tasks',
                id: taskId,
                data: { is_completed: isCompleted } as any,
            });
        }
        
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle task:', error);
        return { success: false, error: 'Failed to toggle task' };
    }
}

export async function getAdminNotificationsAction() {
    try {
        const payload = await getLocalPayload();
        
        // 1. Unread/Open Support Tickets
        const tickets = await payload.find({
            collection: 'support_tickets',
            where: { status: { not_equals: 'closed' } },
            sort: '-createdAt',
            limit: 5,
        });

        // 2. Pending Admin Tasks
        const tasks = await payload.find({
            collection: 'admin_tasks',
            where: { is_completed: { equals: false } },
            sort: '-createdAt',
            limit: 5,
        });

        // 3. Recent Subscriptions
        const subscriptions = await payload.find({
            collection: 'user_subscriptions',
            where: { status: { equals: 'active' } },
            sort: '-createdAt',
            limit: 5,
        });

        const notifications: any[] = [];

        tickets.docs.forEach((t: any) => {
            notifications.push({
                id: `ticket-${t.id}`,
                title: `Support Ticket: ${t.subject || 'Open'}`,
                description: 'Needs your attention',
                time: new Date(t.createdAt).toISOString(),
                isRead: false,
                type: 'warning',
                link: `/admin/collections/support_tickets/${t.id}`
            });
        });

        tasks.docs.forEach((t: any) => {
            notifications.push({
                id: `task-${t.id}`,
                title: 'Pending Task',
                description: t.task,
                time: new Date(t.createdAt).toISOString(),
                isRead: false,
                type: 'info',
                link: `/admin/dashboard` // Tasks are on dashboard
            });
        });

        subscriptions.docs.forEach((s: any) => {
            notifications.push({
                id: `sub-${s.id}`,
                title: 'New Subscription Bought',
                description: `A user has purchased a subscription plan.`,
                time: new Date(s.createdAt).toISOString(),
                isRead: false,
                type: 'success',
                link: `/admin/collections/user_subscriptions/${s.id}`
            });
        });

        // Sort combined notifications by date descending
        notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        // Format time to readable string
        const formattedNotifications = notifications.slice(0, 15).map(n => ({
            ...n,
            time: new Date(n.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));

        return { success: true, data: formattedNotifications };
    } catch (error) {
        console.error('Failed to fetch admin notifications:', error);
        return { success: false, error: 'Failed to fetch admin notifications' };
    }
}
