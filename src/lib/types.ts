

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

export type Schedule = {
    id: string;
    studentId: string;
    courseId: string;
    classDate: string; // ISO string
    classTime: string; // HH:mm format
    teacherName: string;
    classNumber: number;
    title?: string;
    platform: 'Google Meet' | 'Zoom';
    meetingLink: string;
    meetingId?: string;
    meetingPassword?: string;
    createdAt: any;
};

export type Resource = {
    id: string;
    title: string;
    description: string;
    coverImageUrl?: string;
    dataAiHint?: string;
    pdfDataUrl?: string;
    pdfFileName?: string;
    pages: { pageNumber: number, imageUrl: string }[];
}
