
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentQuizzes } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const studentQuizzes = await getStudentQuizzes(user.uid);
        setQuizzes(studentQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubQuizzes = onSnapshot(collection(db, "quizzes"), fetchQuizzes);
    const unsubUser = onSnapshot(collection(db, "users"), fetchQuizzes);

    return () => {
        unsubQuizzes();
        unsubUser();
    };
  }, [user]);


  if (loading) {
    return <div className="text-center p-8">Loading all quizzes...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">All My Quizzes</h1>
        <p className="text-muted-foreground">A complete list of all quizzes from your courses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quizzes ({quizzes.length})</CardTitle>
          <CardDescription>Click "Take Quiz" to open the quiz link in a new tab.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {quizzes.length > 0 ? quizzes.map(quiz => {
              return (
                <li key={quiz.id} className="flex flex-wrap items-center justify-between p-4 hover:bg-secondary/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Course: <span className="font-medium">{quiz.courseName}</span>
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={quiz.externalUrl} target="_blank" rel="noopener noreferrer">Take Quiz</a>
                  </Button>
                </li>
              )
            }) : (
              <p className="p-8 text-center text-muted-foreground">You don't have any quizzes yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
