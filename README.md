# Faizyab Al-Quran - Modern Learning Platform

**Version: 1.0.2**

For many educational institutions, managing both Quranic and academic studies means juggling multiple, disconnected tools, leading to confusion for students and heavy administrative work. Faizyab Al-Quran was built to solve this problem. We provide a single, unified, and powerful Learning Management System (LMS) that seamlessly integrates both streams of education.

Our platform provides intuitive, role-based dashboards for Students and Admins, creating an organized, engaging, and streamlined educational experience from day one.

## ✨ Key Features

### For Students:
- **Personalized Dashboard**: View assigned courses, upcoming assignments, and quizzes at a glance.
- **Course Enrollment**: Browse available courses and send enrollment requests directly to the admin.
- **Interactive Assignments**: Submit work via file uploads or text input and track submission status.
- **Real-time Updates**: Stay informed with live updates on course progress and assignment statuses.

### For Admins:
- **Full CMS Control**: Perform complete CRUD (Create, Read, Update, Delete) operations on courses, assignments, quizzes, and students.
- **Enrollment Management**: Review and approve pending student enrollment requests with a simple workflow.
- **Submission Review**: View and grade student submissions, provide feedback, and update assignment statuses.
- **Real-time Overview**: Monitor platform activity, including total students, courses, and recent submissions from a central dashboard.

## 🚀 Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS with ShadCN UI components
- **Authentication**: Firebase Authentication
- **Database**: Firestore (for real-time data)
- **Deployment**: Firebase App Hosting

## ⚙️ Getting Started

### Prerequisites

- Node.js
- An active Firebase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd faizyab-al-quran
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up Firebase:**
    - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
    - Add a new Web App to your Firebase project.
    - Copy your Firebase configuration object and paste it into `src/lib/firebase.ts`.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## 🔑 Admin Access

For demonstration purposes, the user with the following email is automatically assigned admin privileges upon signing up:

All other users who sign up will be assigned the "student" role.
