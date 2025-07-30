
export type Assignment = {
    id: string;
    courseId: string;
    title: string;
    dueDate: string;
    instructions: string;
    attachments?: { name: string; url: string }[];
};
