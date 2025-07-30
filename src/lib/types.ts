

export type Assignment = {
    id: string;
    courseId: string;
    title: string;
    dueDate: string;
    instructions: string;
    attachments?: { name: string; url: string }[];
};

export type Course = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    dataAiHint?: string;
    enrolledStudentIds?: string[];
    completedStudentIds?: string[];
    pendingStudentIds?: string[];
};

export type User = {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    courses: { courseId: string, status: 'enrolled' | 'pending' | 'completed' }[];
    joined?: string;
    photoURL?: string;
}
