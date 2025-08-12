
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, BookOpen, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentSchedules } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { format, isFuture, isPast, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";

type Schedule = {
    id: string;
    title?: string;
    courseName: string;
    classDate: string;
    classTime: string;
    teacherName: string;
    platform: 'Google Meet' | 'Zoom';
    meetingLink: string;
};

export default function StudentSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
        setSchedules([]);
        return;
    };
    
    setLoading(true);
    const q = query(collection(db, "schedules"), where('studentId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, async () => {
        try {
            const studentSchedules = await getStudentSchedules(user.uid);
            setSchedules(studentSchedules as Schedule[]);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        } finally {
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [user]);


  if (loading) {
    return <div className="text-center p-8">Loading your schedule...</div>;
  }
  
  const upcomingSchedules = schedules
    .filter(s => isFuture(parseISO(s.classDate)) || format(parseISO(s.classDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .sort((a,b) => new Date(a.classDate).getTime() - new Date(b.classDate).getTime());

  const pastSchedules = schedules
    .filter(s => isPast(parseISO(s.classDate)) && format(parseISO(s.classDate), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd'))
    .sort((a,b) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime());


  const ScheduleCard = ({ schedule }: { schedule: Schedule }) => {
    const isUpcoming = isFuture(parseISO(schedule.classDate)) || format(parseISO(schedule.classDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl">{schedule.title || 'Class'}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                            <BookOpen className="h-4 w-4"/> {schedule.courseName}
                        </CardDescription>
                    </div>
                     <Badge variant={isUpcoming ? 'default' : 'secondary'}>{isUpcoming ? 'Upcoming' : 'Completed'}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                    <span>{format(parseISO(schedule.classDate), 'EEEE, MMMM do, yyyy')}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground"/>
                    <span>{schedule.classTime}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground"/>
                    <span>Teacher: {schedule.teacherName}</span>
                 </div>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full" disabled={!isUpcoming}>
                    <a href={schedule.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Join on {schedule.platform}
                    </a>
                 </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Class Schedule</h1>
        <p className="text-muted-foreground">Here are all of your upcoming and past scheduled classes.</p>
      </div>
      
      {schedules.length === 0 ? (
         <Card className="text-center p-12 bg-card mt-6">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No Classes Scheduled</CardTitle>
            <CardDescription className="mt-2">Your instructor has not scheduled any classes for you yet.</CardDescription>
        </Card>
      ) : (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Upcoming Classes ({upcomingSchedules.length})</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingSchedules.length > 0 ? (
                        upcomingSchedules.map(schedule => <ScheduleCard key={schedule.id} schedule={schedule}/>)
                    ) : (
                        <p className="col-span-full text-muted-foreground">No upcoming classes. Check back later!</p>
                    )}
                </div>
            </section>
             <section>
                <h2 className="text-2xl font-bold font-headline mb-4">Past Classes ({pastSchedules.length})</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {pastSchedules.length > 0 ? (
                        pastSchedules.map(schedule => <ScheduleCard key={schedule.id} schedule={schedule}/>)
                    ) : (
                        <p className="col-span-full text-muted-foreground">No past classes to show.</p>
                    )}
                </div>
            </section>
        </div>
      )}
    </div>
  );
}
