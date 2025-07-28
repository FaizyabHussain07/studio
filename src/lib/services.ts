

import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, documentId, orderBy, limit, writeBatch, setDoc, onSnapshot, arrayUnion, arrayRemove, getCountFromServer } from 'firebase/firestore';

// --- Course Seed Data ---
const sampleCoursesData = [
  {
    id: "hifz-ul-quran",
    name: "Hifz-ul-Quran",
    description: "This course is for students who want to memorize the Holy Quran by heart.",
    imageUrl: "/quran img 5.jpg",
  },
  {
    id: "nazra-tul-quran",
    name: "Nazra-tul-Quran",
    description: "Learn to read the Holy Quran with proper pronunciation and articulation.",
    imageUrl: "/close-up-islamic-new-year-with-quran-book.jpg",
  },
  {
    id: "translation-of-the-quran",
    name: "Translation of the Qur'an",
    description: "Understand the meaning of the Holy Quran with our comprehensive translation course.",
    imageUrl: "/3696932.jpg",
  },
  {
    id: "tafseer-ul-quran",
    name: "Tafseer-ul-Quran",
    description: "Delve deeper into the meanings of the Quranic verses with our Tafseer course.",
    imageUrl: "/3699655.jpg",
  },
  {
    id: "basic-qaida-for-kids",
    name: "Basic Qaida for kids",
    description: "This course is designed for children to learn the basic rules of reading the Quran.",
    imageUrl: "/7800339.jpg",
  },
  {
    id: "arabic-language",
    name: "Arabic Language",
    description: "Learn the language of the Quran to better understand its message.",
    imageUrl: "/6628329.jpg",
  },
];


const seedCourses = async () => {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(query(coursesRef, limit(1)));
    
    if (snapshot.empty) {
        console.log("No courses found, seeding database...");
        const batch = writeBatch(db);
        sampleCoursesData.forEach(course => {
            const docRef = doc(db, 'courses', course.id);
            batch.set(docRef, {
                name: course.name,
                description: course.description,
                imageUrl: course.imageUrl,
            });
        });
        await batch.commit();
        console.log("Courses seeded successfully.");
    }
};
seedCourses();


// User Management
export const createUser = async (userData) => {
  const userRef = userData.uid ? doc(db, 'users', userData.uid) : doc(collection(db, 'users'));
  const finalUserData = { ...userData, uid: userRef.id };
  await setDoc(userRef, finalUserData);
};


export const updateUser = async (id, userData) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, userData);
}

export const deleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
}


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
  if (!id) return null;
  const userDocRef = doc(db, 'users', id);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

// Course Management
export const createCourse = async (courseData) => {
  const newCourseRef = doc(collection(db, 'courses'));
  await setDoc(newCourseRef, {
    name: courseData.name,
    description: courseData.description,
    imageUrl: courseData.imageUrl,
  });
  return newCourseRef.id;
};


export const updateCourse = async (id, courseData) => {
    // Only update fields that are part of the course document itself
    const coursePayload = {
        name: courseData.name,
        description: courseData.description,
        imageUrl: courseData.imageUrl
    };
    await updateDoc(doc(db, 'courses', id), coursePayload);
}

export const updateUserCourses = async (courseId, enrolledStudentIds, completedStudentIds, allStudentIdsInForm) => {
    const batch = writeBatch(db);

    const relevantStudentsSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
    
    for (const studentDoc of relevantStudentsSnapshot.docs) {
        const studentRef = doc(db, 'users', studentDoc.id);
        const student = studentDoc.data();
        const currentEnrollment = student.courses?.find(c => c.courseId === courseId);
        
        const isNowEnrolled = enrolledStudentIds.includes(student.id);
        const isNowCompleted = completedStudentIds.includes(student.id);
        
        // If the student has any previous enrollment for this course, remove it first.
        if (currentEnrollment) {
            batch.update(studentRef, { courses: arrayRemove(currentEnrollment) });
        }

        // Add the new status if they are enrolled or completed.
        if (isNowEnrolled) {
             batch.update(studentRef, { courses: arrayUnion({ courseId, status: 'enrolled' }) });
        } else if (isNowCompleted) {
             batch.update(studentRef, { courses: arrayUnion({ courseId, status: 'completed' }) });
        }
    }

    await batch.commit();
}


export const deleteCourse = async (courseId) => {
    const batch = writeBatch(db);
    
    const courseRef = doc(db, 'courses', courseId);
    batch.delete(courseRef);

    const allStudents = await getStudentUsers();
    allStudents.forEach(student => {
        const enrollment = student.courses?.find(c => c.courseId === courseId);
        if (enrollment) {
            const studentRef = doc(db, 'users', student.id);
            batch.update(studentRef, { courses: arrayRemove(enrollment) });
        }
    });

    const assignmentsQuery = query(collection(db, 'assignments'), where('courseId', '==', courseId));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    
    if (!assignmentsSnapshot.empty) {
        const assignmentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        
        assignmentsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        for (let i = 0; i < assignmentIds.length; i += 30) {
            const chunk = assignmentIds.slice(i, i + 30);
            if (chunk.length > 0) {
                const submissionsQuery = query(collection(db, 'submissions'), where('assignmentId', 'in', chunk));
                const submissionsSnapshot = await getDocs(submissionsQuery);
                submissionsSnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
            }
        }
    }
    
    const quizzesQuery = query(collection(db, 'quizzes'), where('courseId', '==', courseId));
    const quizzesSnapshot = await getDocs(quizzesQuery);
    quizzesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}


export const getCourses = async () => {
    const snapshot = await getDocs(collection(db, 'courses'));
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return courses;
};

export const getCourse = async (id) => {
  if (!id) return null;
  const courseDoc = await getDoc(doc(db, 'courses', id));
  if (!courseDoc.exists()) return null;

  const courseData = { id: courseDoc.id, ...courseDoc.data() };
  
  const enrolledStudents = await getDocs(query(collection(db, 'users'), where('courses', 'array-contains', { courseId: id, status: 'enrolled' })));
  const completedStudents = await getDocs(query(collection(db, 'users'), where('courses', 'array-contains', { courseId: id, status: 'completed' })));

  courseData.enrolledStudentIds = enrolledStudents.docs.map(doc => doc.id);
  courseData.completedStudentIds = completedStudents.docs.map(doc => doc.id);

  return courseData;
};

export const getStudentCourses = async (studentId) => {
  const user = await getUser(studentId);
  if (!user || !user.courses || user.courses.length === 0) {
    return [];
  }
  const courseEnrollments = user.courses.filter(c => c && typeof c.courseId === 'string' && c.courseId.trim() !== '');

  if (courseEnrollments.length === 0) {
    return [];
  }
  
  const courseIds = courseEnrollments.map(c => c.courseId);
  
  const courses = [];
  for (let i = 0; i < courseIds.length; i += 30) {
      const chunk = courseIds.slice(i, i + 30);
      if (chunk.length > 0) {
        const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', chunk));
        const snapshot = await getDocs(coursesQuery);
        snapshot.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
      }
  }

  return courses.map(course => {
      const enrollment = courseEnrollments.find(e => e.courseId === course.id);
      return { ...course, status: enrollment?.status || 'enrolled' };
  });
};

export const getStudentCoursesWithProgress = async (studentId) => {
  const courses = await getStudentCourses(studentId);
  if (courses.length === 0) return [];
  
  const courseIds = courses.map(c => c.id);
  const assignments = await getAssignmentsByCourses(courseIds);
  const assignmentIds = assignments.map(a => a.id);
  const submissions = await getSubmissionsByStudent(studentId, assignmentIds);

  const assignmentsByCourse = assignments.reduce((acc, a) => {
      if (!acc[a.courseId]) acc[a.courseId] = [];
      acc[a.courseId].push(a);
      return acc;
  }, {});

  const submissionsByCourse = submissions.reduce((acc, s) => {
      const assignment = assignments.find(a => a.id === s.assignmentId);
      if (assignment) {
          if(!acc[assignment.courseId]) acc[assignment.courseId] = [];
          acc[assignment.courseId].push(s);
      }
      return acc;
  }, {});
  
  return courses.map(course => {
      const courseAssignments = assignmentsByCourse[course.id] || [];
      const courseSubmissions = submissionsByCourse[course.id] || [];

      if(courseAssignments.length === 0) return {...course, progress: 0};
      
      const completedCount = courseSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
      const progress = Math.round((completedCount / courseAssignments.length) * 100);
      
      return { ...course, progress };
  });
}

export const addPendingEnrollment = async (studentId, courseId, requestDate) => {
    const userRef = doc(db, 'users', studentId);
    await updateDoc(userRef, {
        courses: arrayUnion({
            courseId: courseId,
            status: 'pending',
            requestDate: requestDate.toISOString(),
        })
    })
}

export const getPendingEnrollmentRequests = async () => {
    const q = query(collection(db, "users"), where("role", "==", "student"), where("courses", "!=", []));
    const studentsSnapshot = await getDocs(q);

    const requests = [];
    const courseCache = new Map();

    for (const studentDoc of studentsSnapshot.docs) {
        const student = { id: studentDoc.id, ...studentDoc.data() };
        const pendingCourses = student.courses?.filter(c => c.status === 'pending');

        if (pendingCourses && pendingCourses.length > 0) {
            for (const pCourse of pendingCourses) {
                let courseName = courseCache.get(pCourse.courseId);
                if (!courseName) {
                    const course = await getCourse(pCourse.courseId);
                    if (course) {
                        courseName = course.name;
                        courseCache.set(pCourse.courseId, courseName);
                    }
                }

                requests.push({
                    studentId: student.id,
                    studentName: student.name,
                    studentEmail: student.email,
                    courseId: pCourse.courseId,
                    courseName: courseName || "Unknown Course",
                    requestDate: pCourse.requestDate ? new Date(pCourse.requestDate).toLocaleDateString() : 'N/A'
                });
            }
        }
    }
    return requests;
};


// Assignment Management
export const createAssignment = async (assignmentData) => {
  const newAssignment = await addDoc(collection(db, 'assignments'), assignmentData);
  return newAssignment.id;
};

export const updateAssignment = async (id, assignmentData) => {
    await updateDoc(doc(db, 'assignments', id), assignmentData);
}

export const deleteAssignment = async (assignmentId) => {
    const batch = writeBatch(db);
    
    const assignmentRef = doc(db, 'assignments', assignmentId);
    batch.delete(assignmentRef);
    
    const submissionsQuery = query(collection(db, 'submissions'), where('assignmentId', '==', assignmentId));
    const submissionsSnapshot = await getDocs(submissionsQuery);
    submissionsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}


export const getAssignments = async () => {
  const snapshot = await getDocs(collection(db, 'assignments'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAssignmentsByCourse = async (courseId) => {
    const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

const getAssignmentsByCourses = async (courseIds) => {
    if (!courseIds || courseIds.length === 0) return [];
    const assignments = [];
    for (let i = 0; i < courseIds.length; i += 30) {
        const chunk = courseIds.slice(i, i + 30);
        if (chunk.length > 0) {
            const q = query(collection(db, "assignments"), where("courseId", "in", chunk));
            const snapshot = await getDocs(q);
            snapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() }));
        }
    }
    return assignments;
}

export const getStudentAssignmentsWithStatus = async (studentId) => {
    const courses = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const assignments = await getAssignmentsByCourses(courses.map(c => c.id));
    const assignmentIds = assignments.map(a => a.id);
    const submissions = await getSubmissionsByStudent(studentId, assignmentIds);
    
    return assignments.map(assignment => {
        const submission = submissions.find(s => s.assignmentId === assignment.id);
        const course = courses.find(c => c.id === assignment.courseId);
        let status = 'Pending';
        if (submission) {
            status = submission.status || 'Submitted';
        } else if (new Date() > new Date(assignment.dueDate)) {
            status = 'Missing';
        }
        return {...assignment, status, courseName: course?.name || 'Unknown' };
    });
}


export const getAssignment = async (id) => {
  if (!id) return null;
  const assignmentDoc = await getDoc(doc(db, 'assignments', id));
  return assignmentDoc.exists() ? { id: assignmentDoc.id, ...assignmentDoc.data() } : null;
};


// Submissions
export const createSubmission = async (submissionData) => {
    const q = query(collection(db, 'submissions'), where('studentId', '==', submissionData.studentId), where('assignmentId', '==', submissionData.assignmentId));
    const existingSubmission = await getDocs(q);

    if (existingSubmission.empty) {
        const newSubmissionRef = doc(collection(db, 'submissions'));
        await setDoc(newSubmissionRef, { ...submissionData, id: newSubmissionRef.id });
        return newSubmissionRef.id;
    } else {
        const submissionDocRef = existingSubmission.docs[0].ref;
        await updateDoc(submissionDocRef, submissionData);
        return submissionDocRef.id;
    }
}

export const updateSubmissionStatus = async (submissionId, status) => {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, { status });
}

export const getSubmissions = async (count = 0) => {
    const submissionsRef = collection(db, "submissions");
    const q = count > 0 
        ? query(submissionsRef, orderBy("submissionDate", "desc"), limit(count))
        : query(submissionsRef, orderBy("submissionDate", "desc"));

    const snapshot = await getDocs(q);
    const submissions = await Promise.all(snapshot.docs.map(async (docRef) => {
        const data = docRef.data();
        const [student, assignment] = await Promise.all([
            getUser(data.studentId),
            getAssignment(data.assignmentId),
        ]);
        const course = assignment ? await getCourse(assignment.courseId) : null;
        return {
            id: docRef.id,
            ...data,
            submissionDate: new Date(data.submissionDate).toLocaleDateString(),
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

export const getStudentSubmissionForAssignment = (studentId, assignmentId, callback) => {
    const q = query(
        collection(db, 'submissions'), 
        where('studentId', '==', studentId), 
        where('assignmentId', '==', assignmentId),
        limit(1)
    );
    
    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            callback(null);
        } else {
            callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
    });
}

export const getSubmissionsByStudent = async (studentId, assignmentIds) => {
  if (!assignmentIds || assignmentIds.length === 0) return [];
  
  const submissions = [];
  for (let i = 0; i < assignmentIds.length; i += 30) {
      const chunk = assignmentIds.slice(i, i + 30);
      if(chunk.length > 0) {
        const q = query(
          collection(db, "submissions"), 
          where("studentId", "==", studentId),
          where("assignmentId", "in", chunk)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            submissions.push({ id: doc.id, ...doc.data() });
        });
      }
  }
  return submissions;
}

export const getStudentAssignmentStatus = async (studentId, assignmentId) => {
  const q = query(
      collection(db, 'submissions'), 
      where('studentId', '==', studentId), 
      where('assignmentId', '==', assignmentId),
      limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const assignment = await getAssignment(assignmentId);
    if (assignment && new Date() > new Date(assignment.dueDate)) {
        return 'Missing';
    }
    return 'Pending';
  }
  return snapshot.docs[0].data().status || 'Submitted';
}

// Quiz Management
export const createQuiz = async (quizData) => {
    const newQuiz = await addDoc(collection(db, 'quizzes'), quizData);
    return newQuiz.id;
}

export const updateQuiz = async (id, quizData) => {
    await updateDoc(doc(db, 'quizzes', id), quizData);
}

export const deleteQuiz = async (quizId) => {
    await deleteDoc(doc(db, 'quizzes', quizId));
}

export const getQuizzesByCourse = async (courseId) => {
    const q = query(collection(db, "quizzes"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentQuizzes = async (studentId) => {
    const courses = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const enrolledCourses = courses.filter(c => c.status === 'enrolled');
    if(enrolledCourses.length === 0) return [];

    const courseIds = enrolledCourses.map(c => c.id);
    const quizzes = await getQuizzesByCourses(courseIds);

    return quizzes.map(quiz => {
        const course = courses.find(c => c.id === quiz.courseId);
        return {...quiz, courseName: course?.name || 'Unknown' };
    });
}

const getQuizzesByCourses = async (courseIds) => {
    if(courseIds.length === 0) return [];

    const quizzes = [];
    for (let i = 0; i < courseIds.length; i += 30) {
        const chunk = courseIds.slice(i, i + 30);
        if (chunk.length > 0) {
            const q = query(collection(db, "quizzes"), where("courseId", "in", chunk));
            const snapshot = await getDocs(q);
            snapshot.forEach(doc => {
                quizzes.push({ id: doc.id, ...doc.data() });
            });
        }
    }
    return quizzes;
}
