
'use client';

import { useState, useEffect }from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, CheckCheck } from "lucide-react";
import { onSnapshot, collection, query, where, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Card, CardDescription, CardHeader, CardTitle } from './card';

type Notification = {
    id: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: any;
};

export function Notifications() {
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        };

        setLoading(true);
        const q = query(
            collection(db, 'notifications'), 
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            } as Notification));
            setNotifications(notifs);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [user]);

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        const unreadNotifs = notifications.filter(n => !n.isRead);
        if(unreadNotifs.length === 0) return;

        const batch = writeBatch(db);
        unreadNotifs.forEach(notif => {
            const notifRef = doc(db, 'notifications', notif.id);
            batch.update(notifRef, { isRead: true });
        });
        await batch.commit();
    };
    
     const handleMarkAsRead = async (id: string) => {
        const notifRef = doc(db, 'notifications', id);
        await writeBatch(db).update(notifRef, { isRead: true }).commit();
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{unreadCount}</Badge>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                 <Card className="border-none shadow-none">
                     <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                        <CardTitle className="text-lg font-headline">Notifications</CardTitle>
                        {unreadCount > 0 && (
                            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="p-0 h-auto">
                                <CheckCheck className="mr-1 h-4 w-4"/> Mark all as read
                            </Button>
                        )}
                     </CardHeader>
                     <ScrollArea className="h-96">
                        {loading ? (
                            <p className="p-4 text-center text-sm text-muted-foreground">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto h-10 w-10 text-muted-foreground"/>
                                <p className="mt-4 text-sm text-muted-foreground">You have no new notifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-4 ${!n.isRead ? 'bg-secondary/50' : ''}`}>
                                        <Link href={n.link || '#'} onClick={() => handleMarkAsRead(n.id)} className="block hover:bg-secondary/80 -m-4 p-4">
                                            <p className="font-semibold">{n.title}</p>
                                            <p className="text-sm text-muted-foreground">{n.message}</p>
                                            <p className="text-xs text-muted-foreground/80 mt-2">
                                                {n.createdAt ? formatDistanceToNow(n.createdAt, { addSuffix: true }) : ''}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                     </ScrollArea>
                 </Card>
            </PopoverContent>
        </Popover>
    );
}
