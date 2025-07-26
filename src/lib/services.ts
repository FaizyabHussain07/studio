import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, documentId, orderBy, limit } from 'firebase/firestore';

// User Management
export const createUser = async (userData) => {
  // Use uid as the document ID
  await addDoc(collection(db, 'users'), userData);
};

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStudentUsers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export const getUser = async (id) => {
  const q = query(collection(db, 'users'), where('uid', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };
};

// Course Management
export const createCourse = async (courseData) => {
  const newCourse = await addDoc(collection(db, 'courses'), courseData);
  return newCourse.id;
};

export const getCourses = async () => {
  const snapshot = await getDocs(collection(db, 'courses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCourse = async (id) => {
  const courseDoc = await getDoc(doc(db, 'courses', id));
  return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;
};

export const getStudentCourses = async (studentId) => {
  const user = await getUser(studentId);
  if (!user || !user.courses || user.courses.length === 0) {
    return [];
  }
  const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', user.courses));
  const snapshot = await getDocs(coursesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStudentCoursesWithProgress = async (studentId) => {
  const courses = await getStudentCourses(studentId);
  if (courses.length === 0) return [];
  
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const assignments = await getAssignmentsByCourse(course.id);
      if(assignments.length === 0) return {...course, progress: 0};

      const submissions = await getSubmissionsByStudent(studentId, assignments.map(a => a.id));
      const completedCount = submissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
      const progress = Math.round((completedCount / assignments.length) * 100);
      return { ...course, progress };
    })
  );
  return coursesWithProgress;
}

export const getStudentCountForCourse = async (courseId) => {
    const q = query(collection(db, 'users'), where('courses', 'array-contains', courseId));
    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Assignment Management
export const createAssignment = async (assignmentData) => {
  const newAssignment = await addDoc(collection(db, 'assignments'), assignmentData);
  return newAssignment.id;
};

export const getAssignments = async () => {
  const snapshot = await getDocs(collection(db, 'assignments'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAssignmentsByCourse = async (courseId) => {
    const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentAssignmentsWithStatus = async (studentId) => {
    const courses = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const courseIds = courses.map(c => c.id);
    const q = query(collection(db, "assignments"), where("courseId", "in", courseIds));
    const snapshot = await getDocs(q);
    const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const assignmentsWithStatus = await Promise.all(
        assignments.map(async (assignment) => {
            const status = await getStudentAssignmentStatus(studentId, assignment.id);
            const course = courses.find(c => c.id === assignment.courseId);
            return {...assignment, status, courseName: course?.name || 'Unknown' };
        })
    );
    return assignmentsWithStatus;
}


export const getAssignment = async (id) => {
  const assignmentDoc = await getDoc(doc(db, 'assignments', id));
  return assignmentDoc.exists() ? { id: assignmentDoc.id, ...assignmentDoc.data() } : null;
};


// Submissions
export const createSubmission = async (submissionData) => {
    const newSubmission = await addDoc(collection(db, 'submissions'), submissionData);
    return newSubmission.id;
}

export const getSubmissions = async (count = 0) => {
    const submissionsRef = collection(db, "submissions");
    const q = count > 0 
        ? query(submissionsRef, orderBy("submissionDate", "desc"), limit(count))
        : query(submissionsRef, orderBy("submissionDate", "desc"));

    const snapshot = await getDocs(q);
    const submissions = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const [student, assignment] = await Promise.all([
            getUser(data.studentId),
            getAssignment(data.assignmentId),
        ]);
        const course = assignment ? await getCourse(assignment.courseId) : null;
        return {
            id: doc.id,
            ...data,
            studentName: student?.name || 'Unknown Student',
            assignmentTitle: assignment?.title || 'Unknown Assignment',
            courseName: course?.name || 'Unknown Course'
        }
    }));
    return submissions;
}


export const getSubmissionsByAssignment = async (assignmentId) => {
    const q = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getSubmissionsByStudent = async (studentId, assignmentIds) => {
  if (!assignmentIds || assignmentIds.length === 0) return [];
  const q = query(
    collection(db, "submissions"), 
    where("studentId", "==", studentId),
    where("assignmentId", "in", assignmentIds)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentAssignmentStatus = async (studentId, assignmentId) => {
  const q = query(
    collection(db, 'submissions'), 
    where('studentId', '==', studentId), 
    where('assignmentId', '==', assignmentId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return 'Pending';
  }
  const submission = snapshot.docs[0].data();
  return submission.status || 'Submitted';
}
