'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, BellOff, CheckCheck, ExternalLink, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGlobalContextHook } from '@/hooks/useGlobalContextHook';
import ToastComponent from '@/components/popup/toast';
import LoadingSmallComponent from '@/components/status/loading-small.component';
import { getValueFromLocalStorage } from '@/utils/local-storage.util';
import { deleteRequest, getRequest } from '@/utils/api-calls.util';
import { showConfirmationModal } from '@/utils/show-alert-dialog';

interface Note {
    id: number | string;
    title: string;
    description?: string;
    isRead: boolean;
    redirectUrl?: string;
    group?: string;
    state_redirect_url?: string;
    for_id?: number | string;
    userName?: string;
    formattedCreatedAt?: string;
}

type Filter = 'all' | 'unread';

const SUB_VIEW_GROUPS = ['procurement', 'finance', 'sales', 'inventory', 'workshop'];

const getInitials = (name?: string) => {
    const parts = (name || '?').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
};

const NotificationComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');
    const [expandedId, setExpandedId] = useState<Note['id'] | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const token = getValueFromLocalStorage('token');
    const { state, dispatch } = useGlobalContextHook();
    const { refreshNotification, currentUser } = state;

    // Fetch notifications (loading state only affects the panel, not the whole component)
    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                const res = await getRequest('notifications');
                if (active && res.status === 200) {
                    setNotes((res.data as any)?.data ?? res.data ?? []);
                }
            } catch (error: any) {
                if (error?.code === 'ERR_NETWORK') console.log('error');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => {
            active = false;
        };
    }, [refreshNotification, token, currentUser]);

    // Close on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const unreadCount = useMemo(() => notes.filter((n) => !n.isRead).length, [notes]);
    const visibleNotes = useMemo(
        () => (filter === 'unread' ? notes.filter((n) => !n.isRead) : notes),
        [notes, filter]
    );

    const toggleExpand = async (note: Note) => {
        setExpandedId((prev) => (prev === note.id ? null : note.id));

        if (!note.isRead) {
            try {
                const res = await getRequest(`notifications/${note.id}/read`);
                if (res.status === 200) {
                    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, isRead: true } : n)));
                }
            } catch (error) {
                console.error('Error updating notification:', error);
            }
        }
    };

    const handleDelete = async (note: Note) => {
        try {
            const res = await deleteRequest(`notifications/${note.id}`);
            if (res.status === 200) {
                setNotes((prev) => prev.filter((n) => n.id !== note.id));
                ToastComponent({ text: 'Deleted Successfully' });
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleDeleteAll = () => {
        if (notes.length === 0) {
            return ToastComponent({ type: 'info', text: 'No notifications to delete' });
        }

        showConfirmationModal({
            title: 'Are you sure?',
            text: 'This will permanently delete all notifications. Do you want to continue?',
            onConfirm: async () => {
                try {
                    const res = await getRequest('notifications/delete-all');
                    if (res.status === 200) {
                        setNotes([]);
                        ToastComponent({ text: 'All notifications deleted successfully' });
                    }
                } catch (error) {
                    console.error('Error deleting all notifications:', error);
                }
            },
            onCancel: () => console.log('User canceled delete-all'),
        });
    };

    const handleReadAll = async () => {
        if (unreadCount === 0) return;
        try {
            const res = await getRequest('notifications/read-all');
            if (res.status === 200) {
                setNotes((prev) => prev.map((n) => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleViewClick = (note: Note) => {
        const { redirectUrl, group, state_redirect_url, for_id } = note;

        if (!redirectUrl) {
            return ToastComponent({
                type: 'error',
                text: 'Something went Wrong. Data not Available',
            });
        }

        const payload = { id: for_id, from: state_redirect_url };
        if (group === 'plan') {
            dispatch({ type: 'SET_PLANNING_ITEM', payload });
        } else if (group && SUB_VIEW_GROUPS.includes(group)) {
            dispatch({ type: 'SET_SUB_VIEW_ITEM', payload });
        }

        router.push(redirectUrl);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell trigger (same size as the profile avatar) */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-header-text/15 text-header-text ring-2 ring-transparent transition hover:ring-header-text/40 focus:outline-none focus-visible:ring-header-text/60 md:h-8 md:w-8"
            >
                <Bell className="h-[18px] w-[18px] md:h-4 md:w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold leading-none text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Notifications"
                    className="fixed inset-x-3 top-16 z-30 overflow-hidden rounded-xl border border-card-border-light bg-card-bg text-foreground shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-card-border-light px-4 py-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[11px] font-medium">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReadAll}
                                disabled={unreadCount === 0}
                                title="Mark all as read"
                                aria-label="Mark all as read"
                                className="rounded-md p-1.5 transition hover:bg-muted-bg disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <CheckCheck size={16} />
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={notes.length === 0}
                                title="Delete all"
                                aria-label="Delete all notifications"
                                className="rounded-md p-1.5 text-error transition hover:bg-muted-bg disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 border-b border-card-border-light px-3 py-2">
                        {(['all', 'unread'] as Filter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                                    filter === f ? 'bg-muted-bg text-foreground' : 'text-muted hover:bg-muted-bg'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="max-h-[60vh] overflow-y-auto sm:max-h-96">
                        {loading && notes.length === 0 ? (
                            <div className="flex justify-center py-10">
                                <LoadingSmallComponent />
                            </div>
                        ) : visibleNotes.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                                <BellOff size={28} className="text-muted" />
                                <p className="text-sm font-medium">
                                    {filter === 'unread' ? 'No unread notifications' : "You're all caught up"}
                                </p>
                                <p className="text-xs text-muted">New notifications will show up here.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-card-border-light">
                                {visibleNotes.map((note) => {
                                    const isExpanded = expandedId === note.id;
                                    return (
                                        <li key={note.id}>
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => toggleExpand(note)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        toggleExpand(note);
                                                    }
                                                }}
                                                className={`flex cursor-pointer gap-3 border-l-2 px-4 py-3 transition hover:bg-muted-bg focus:outline-none focus-visible:bg-muted-bg ${
                                                    note.isRead ? 'border-transparent' : 'border-primary'
                                                }`}
                                            >
                                                {/* Sender avatar */}
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-bg text-[11px] font-semibold">
                                                    {getInitials(note.userName)}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p
                                                            className={`text-sm leading-snug ${
                                                                note.isRead ? 'font-medium' : 'font-semibold'
                                                            } ${isExpanded ? '' : 'line-clamp-1'}`}
                                                        >
                                                            {note.title}
                                                        </p>
                                                        {!note.isRead && (
                                                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-error" />
                                                        )}
                                                    </div>

                                                    <p
                                                        className={`mt-0.5 text-xs text-muted ${
                                                            isExpanded ? '' : 'line-clamp-1'
                                                        }`}
                                                    >
                                                        {note.description}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-muted">
                                                        {note.userName || 'Unknown'} · {note.formattedCreatedAt || 'Unknown'}
                                                    </p>

                                                    {isExpanded && (
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewClick(note);
                                                                }}
                                                                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                                                            >
                                                                View <ExternalLink size={12} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(note);
                                                                }}
                                                                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-error transition hover:bg-muted-bg"
                                                            >
                                                                <Trash2 size={12} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;