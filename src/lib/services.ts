

import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, documentId, orderBy, limit, writeBatch, setDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';

const sampleCoursesData = [
    {
        id: "basic-qaida-for-kid",
        name: "Basic Qaida for kid",
        description: "Foundational course for children to learn the basic rules of reading the Quran.",
        imageUrl: "https://images.unsplash.com/photo-1594910196905-5735b54a5a57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjaGlsZCUyMHJlYWRpbmd8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "child reading",
    },
    {
        id: "qaida-revision",
        name: "Qaida Revision",
        description: "A revision course to solidify the rules of Qaida for accurate Quranic recitation.",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzfGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "study books",
    },
    {
        id: "quran-reading",
        name: "Quran Reading",
        description: "Learn to read the Holy Quran with proper pronunciation and fluency.",
        imageUrl: "https://images.unsplash.com/photo-1621160105007-727ca40f26a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cXVyYW4lMjByZWFkaW5nfGVufDB8fHx8MTc1Mzc1Nzc0NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "quran reading",
    },
    {
        id: "quran-reading-revision",
        name: "Quran Reading Revision",
        description: "Revise and perfect your Quranic reading skills with guided practice.",
        imageUrl: "https://images.unsplash.com/photo-1582159073167-2a14a3857f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyZWxpZ2lvdXMlMjB0ZXh0fGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "religious text",
    },
    {
        id: "quran-with-tajweed",
        name: "Quran with Tajweed",
        description: "Master the art of Quranic recitation with the correct rules of Tajweed.",
        imageUrl: "https://images.unsplash.com/photo-1609599595249-1a3b83f4be5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3NxdWUlMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "mosque architecture",
    },
    {
        id: "quran-with-tajweed-revision",
        name: "Quran with Tajweed Revision",
        description: "A comprehensive revision course for all the rules of Tajweed.",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2Rpbmd8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "coding",
    },
    {
        id: "hifz-ul-quran",
        name: "Hifz-ul-Quran",
        description: "This course is for students who want to memorize the Holy Quran by heart.",
        imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZW1vcml6YXRpb258ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "memorization",
    },
    {
        id: "hifz-ul-quran-revision",
        name: "Hifz-ul-Quran Revision",
        description: "Revise your memorization of the Quran to ensure long-term retention.",
        imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXZpc2lvbiUyMHN0dWR5fGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "revision study",
    },
    {
        id: "diniyat-for-kids",
        name: "Diniyat for kids/Basic Diniyat",
        description: "Fundamental Islamic knowledge for children, covering basics of faith and practice.",
        imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWFybmluZyUyMGNsYXNzfGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "learning class",
    },
    {
        id: "diniyat-for-kids-revision",
        name: "Diniyat for kids/Basic Diniyat Revision",
        description: "A revision course to reinforce the foundational concepts of Diniyat.",
        imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncm91cCUyMHN0dWR5fGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "group study",
    },
    {
        id: "advanced-diniyat",
        name: "Advanced Diniyat",
        description: "An in-depth study of Islamic sciences for advanced learners.",
        imageUrl: "https://images.unsplash.com/photo-1517414442328-3693a72e81d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZHZhbmNlZCUyMGxlYXJuaW5nfGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "advanced learning",
    },
    {
        id: "advanced-diniyat-revision",
        name: "Advanced Diniyat Revision",
        description: "Revise complex topics in Islamic studies to deepen your understanding.",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleGFtJTIwcHJlcGFyYXRpb258ZW58MHx8fHwxNzUzNzY4NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "exam preparation",
    },
];

const seedCourses = async () => {
    try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        const existingIds = new Set(snapshot.docs.map(doc => doc.id));
        const sampleIds = new Set(sampleCoursesData.map(c => c.id));

        const areDifferent = snapshot.size !== sampleIds.size || !snapshot.docs.every(doc => sampleIds.has(doc.id));

        if (areDifferent) {
            console.log("Course data mismatch detected. Re-seeding database...");
            const batch = writeBatch(db);

            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            sampleCoursesData.forEach(course => {
                const docRef = doc(db, 'courses', course.id);
                batch.set(docRef, {
                    name: course.name,
                    description: course.description,
                    imageUrl: course.imageUrl,
                    dataAiHint: course.dataAiHint,
                    enrolledStudentIds: [],
                    completedStudentIds: [],
                });
            });
            
            await batch.commit();
            console.log("Courses re-seeded successfully.");
        }
    } catch (error) {
        console.error("Error during course seeding:", error);
    }
};

seedCourses();

export const createUser = async (userData: any) => {
  const userRef = doc(db, 'users', userData.uid);
  await setDoc(userRef, userData);
  return userRef.id;
};

export const updateUser = async (id: string, userData: any) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, userData);
}

export const deleteUser = async (userId: string) => {
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

export const getUser = async (id: string) => {
  if (!id) return null;
  const userDocRef = doc(db, 'users', id);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const createCourse = async (courseData: any) => {
  const newCourseRef = doc(collection(db, 'courses'));
  await setDoc(newCourseRef, {
    ...courseData,
    enrolledStudentIds: [],
    completedStudentIds: [],
  });
  return newCourseRef.id;
};

export const updateCourse = async (id: string, courseData: any) => {
    const coursePayload = {
        name: courseData.name,
        description: courseData.description,
        imageUrl: courseData.imageUrl
    };
    await updateDoc(doc(db, 'courses', id), coursePayload);
}

export const updateUserCourses = async (courseId: string, enrolledStudentIds: string[], completedStudentIds: string[], allStudents: any[], approvingStudentId: string | null = null) => {
    const batch = writeBatch(db);
    
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    const courseData = courseDoc.data();
    
    const prevEnrolledIds = courseData?.enrolledStudentIds || [];
    const prevCompletedIds = courseData?.completedStudentIds || [];
    const allPreviousStudentIds = new Set([...prevEnrolledIds, ...prevCompletedIds]);

    const allStudentDocs = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
    const studentMap = new Map(allStudentDocs.docs.map(d => [d.id, d.data()]));

    const allCurrentStudentIds = new Set([...enrolledStudentIds, ...completedStudentIds]);
    
    for(const studentId of allPreviousStudentIds) {
        if (!allCurrentStudentIds.has(studentId)) {
            const studentRef = doc(db, 'users', studentId);
            const studentData: any = studentMap.get(studentId);
            if (studentData) {
                const updatedCourses = studentData.courses.filter((c: any) => c.courseId !== courseId);
                batch.update(studentRef, { courses: updatedCourses });
            }
        }
    }
    
    for (const studentId of allCurrentStudentIds) {
        const studentRef = doc(db, 'users', studentId);
        const studentData: any = studentMap.get(studentId);

        if (studentData) {
            let courses = studentData.courses || [];
            courses = courses.filter((c: any) => c.courseId !== courseId);
            
            if (enrolledStudentIds.includes(studentId)) {
                courses.push({ courseId, status: 'enrolled' });
            } else if (completedStudentIds.includes(studentId)) {
                courses.push({ courseId, status: 'completed' });
            }
             batch.update(studentRef, { courses: courses });
        }
    }

    batch.update(doc(db, 'courses', courseId), {
        enrolledStudentIds: enrolledStudentIds || [],
        completedStudentIds: completedStudentIds || []
    });

    if (approvingStudentId) {
        const studentRef = doc(db, 'users', approvingStudentId);
        const studentData: any = studentMap.get(approvingStudentId);
        if (studentData) {
           const updatedCourses = studentData.courses.map((c: any) => 
               c.courseId === courseId ? { ...c, status: 'enrolled' } : c
           );
           batch.update(studentRef, { courses: updatedCourses });
        }
    }

    await batch.commit();
}

export const deleteCourse = async (courseId: string) => {
    const batch = writeBatch(db);
    const courseRef = doc(db, 'courses', courseId);
    batch.delete(courseRef);

    const allStudents = await getStudentUsers();
    allStudents.forEach((student: any) => {
        if (student.courses && Array.isArray(student.courses)) {
            const updatedCourses = student.courses.filter((c: any) => c.courseId !== courseId);
            if (updatedCourses.length < student.courses.length) {
                const studentRef = doc(db, 'users', student.id);
                batch.update(studentRef, { courses: updatedCourses });
            }
        }
    });

    const assignmentsQuery = query(collection(db, 'assignments'), where('courseId', '==', courseId));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    
    if (!assignmentsSnapshot.empty) {
        const assignmentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        
        assignmentsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Batch delete submissions for the found assignments
        if (assignmentIds.length > 0) {
            for (let i = 0; i < assignmentIds.length; i += 30) {
                const chunk = assignmentIds.slice(i, i + 30);
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

export const getCourse = async (id: string) => {
  if (!id) return null;
  const courseDoc = await getDoc(doc(db, 'courses', id));
  return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;
};

export const getStudentCourses = async (studentId: string) => {
  const user: any = await getUser(studentId);
  if (!user || !user.courses || user.courses.length === 0) {
    return [];
  }
  const courseEnrollments = user.courses.filter((c: any) => c && typeof c.courseId === 'string' && c.courseId.trim() !== '');

  if (courseEnrollments.length === 0) {
    return [];
  }
  
  const courseIds = courseEnrollments.map((c: any) => c.courseId);
  
  const courseDocs: any[] = [];
  for (let i = 0; i < courseIds.length; i += 30) {
      const chunk = courseIds.slice(i, i + 30);
      if (chunk.length > 0) {
        const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', chunk));
        const snapshot = await getDocs(coursesQuery);
        snapshot.forEach(doc => courseDocs.push(doc));
      }
  }

  const courseMap = new Map(courseDocs.map(doc => [doc.id, { id: doc.id, ...doc.data() }]));

  return courseEnrollments
    .map((enrollment: any) => {
      const course = courseMap.get(enrollment.courseId);
      if (!course) return null;
      return { ...course, status: enrollment.status || 'enrolled' };
    })
    .filter(Boolean);
};

export const getStudentCoursesWithProgress = async (studentId: string) => {
  const courses = await getStudentCourses(studentId);
  if (courses.length === 0) return [];
  
  const courseIds = courses.map(c => c.id);
  const assignments = await getAssignmentsByCourses(courseIds);
  const assignmentIds = assignments.map(a => a.id);
  const submissions = await getSubmissionsByStudent(studentId, assignmentIds);

  const assignmentsByCourse = assignments.reduce((acc: any, a: any) => {
      if (!acc[a.courseId]) acc[a.courseId] = [];
      acc[a.courseId].push(a);
      return acc;
  }, {});

  const submissionsByCourse = submissions.reduce((acc: any, s: any) => {
      const assignment: any = assignments.find(a => a.id === s.assignmentId);
      if (assignment) {
          if(!acc[assignment.courseId]) acc[assignment.courseId] = [];
          acc[assignment.courseId].push(s);
      }
      return acc;
  }, {});
  
  return courses.map((course: any) => {
      const courseAssignments = assignmentsByCourse[course.id] || [];
      const courseSubmissions = submissionsByCourse[course.id] || [];
      if(courseAssignments.length === 0) return {...course, progress: 0};
      const completedCount = courseSubmissions.filter((s: any) => s.status === 'Submitted' || s.status === 'Graded').length;
      const progress = Math.round((completedCount / courseAssignments.length) * 100);
      return { ...course, progress };
  });
}

export const addPendingEnrollment = async (studentId: string, courseId: string, requestDate: Date) => {
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
    const allStudents: any[] = await getStudentUsers();
    const requests: any[] = [];
    const courseCache = new Map();

    for (const student of allStudents) {
        const pendingCourses = student.courses?.filter((c: any) => c.status === 'pending');

        if (pendingCourses && pendingCourses.length > 0) {
            for (const pCourse of pendingCourses) {
                let courseName = courseCache.get(pCourse.courseId);
                if (!courseName) {
                    const courseDoc = await getCourse(pCourse.courseId);
                    if (courseDoc) {
                        courseName = courseDoc.name;
                        courseCache.set(pCourse.courseId, courseName);
                    } else {
                        courseName = "Deleted Course";
                    }
                }
                requests.push({
                    studentId: student.id,
                    studentName: student.name,
                    studentEmail: student.email,
                    courseId: pCourse.courseId,
                    courseName: courseName,
                    requestDate: pCourse.requestDate ? new Date(pCourse.requestDate).toLocaleDateString() : 'N/A'
                });
            }
        }
    }
    return requests;
};

export const createAssignment = async (assignmentData: any) => {
  const newAssignment = await addDoc(collection(db, 'assignments'), assignmentData);
  return newAssignment.id;
};

export const updateAssignment = async (id: string, assignmentData: any) => {
    await updateDoc(doc(db, 'assignments', id), assignmentData);
}

export const deleteAssignment = async (assignmentId: string) => {
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

export const getAssignmentsByCourse = async (courseId: string) => {
    const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return assignments.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

const getAssignmentsByCourses = async (courseIds: string[]) => {
    if (!courseIds || courseIds.length === 0) return [];
    const assignments: any[] = [];
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

export const getStudentAssignmentsWithStatus = async (studentId: string) => {
    const courses = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const enrolledCourses = courses.filter(c => c.status === 'enrolled');
    if (enrolledCourses.length === 0) return [];

    const assignments = await getAssignmentsByCourses(enrolledCourses.map((c: any) => c.id));
    if (assignments.length === 0) return [];
    
    const assignmentIds = assignments.map((a: any) => a.id);
    const submissions = await getSubmissionsByStudent(studentId, assignmentIds);
    
    return assignments.map((assignment: any) => {
        const submission = submissions.find((s: any) => s.assignmentId === assignment.id);
        const course = courses.find((c: any) => c.id === assignment.courseId);
        let status = 'Pending';
        if (submission) {
            status = submission.status || 'Submitted';
        } else if (new Date() > new Date(assignment.dueDate)) {
            status = 'Missing';
        }
        return {...assignment, status, courseName: course?.name || 'Unknown' };
    }).filter(a => a.courseName !== 'Unknown');
};

export const getAssignment = async (id: string) => {
  if (!id) return null;
  const assignmentDoc = await getDoc(doc(db, 'assignments', id));
  return assignmentDoc.exists() ? { id: assignmentDoc.id, ...assignmentDoc.data() } : null;
};

export const createSubmission = async (submissionData: any) => {
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

export const updateSubmissionStatus = async (submissionId: string, status: string) => {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, { status });
}

export const getSubmissions = async (count = 0) => {
    const submissionsRef = collection(db, "submissions");
    const q = count > 0 
        ? query(submissionsRef, orderBy("submissionDate", "desc"), limit(count))
        : query(submissionsRef, orderBy("submissionDate", "desc"));

    const snapshot = await getDocs(q);
    const submissionsData = snapshot.docs.map(docRef => ({id: docRef.id, ...docRef.data()}));

    const studentIds = [...new Set(submissionsData.map((sub: any) => sub.studentId))];
    const assignmentIds = [...new Set(submissionsData.map((sub: any) => sub.assignmentId))];

    const [students, assignments] = await Promise.all([
        Promise.all(studentIds.map(id => getUser(id))),
        Promise.all(assignmentIds.map(id => getAssignment(id))),
    ]);
    
    const studentMap = new Map(students.filter(Boolean).map((s: any) => [s.id, s]));
    const assignmentMap = new Map(assignments.filter(Boolean).map((a: any) => [a.id, a]));

    const courseIds = [...new Set(assignments.filter(Boolean).map((a: any) => a.courseId))];
    const courses = await Promise.all(courseIds.map(id => getCourse(id)));
    const courseMap = new Map(courses.filter(Boolean).map((c: any) => [c.id, c]));

    return submissionsData.map((sub: any) => {
        const student = studentMap.get(sub.studentId);
        const assignment = assignmentMap.get(sub.assignmentId);
        const course = assignment ? courseMap.get(assignment.courseId) : null;
        return {
            id: sub.id,
            ...sub,
            submissionDate: new Date(sub.submissionDate).toLocaleDateString(),
            studentName: student?.name || 'Unknown Student',
            assignmentTitle: assignment?.title || 'Deleted Assignment',
            courseName: course?.name || 'Unknown Course',
        }
    });
}


export const getSubmissionsByAssignment = async (assignmentId: string) => {
    const q = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentSubmissionForAssignment = (studentId: string, assignmentId: string, callback: (sub: any) => void) => {
    if (!studentId || !assignmentId) {
        callback(null);
        return () => {};
    }
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

export const getSubmissionsByStudent = async (studentId: string, assignmentIds: string[]) => {
  if (!assignmentIds || assignmentIds.length === 0) return [];
  
  const submissions: any[] = [];
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

export const getStudentAssignmentStatus = async (studentId: string, assignmentId: string) => {
  const q = query(
      collection(db, 'submissions'), 
      where('studentId', '==', studentId), 
      where('assignmentId', '==', assignmentId),
      limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const assignment: any = await getAssignment(assignmentId);
    if (assignment && new Date() > new Date(assignment.dueDate)) {
        return 'Missing';
    }
    return 'Pending';
  }
  return snapshot.docs[0].data().status || 'Submitted';
}

export const createQuiz = async (quizData: any) => {
    const newQuiz = await addDoc(collection(db, 'quizzes'), quizData);
    return newQuiz.id;
}

export const updateQuiz = async (id: string, quizData: any) => {
    await updateDoc(doc(db, 'quizzes', id), quizData);
}

export const deleteQuiz = async (quizId: string) => {
    await deleteDoc(doc(db, 'quizzes', quizId));
}

export const getQuizzesByCourse = async (courseId: string) => {
    const q = query(collection(db, "quizzes"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentQuizzes = async (studentId: string) => {
    const courses: any[] = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const enrolledCourses = courses.filter(c => c.status === 'enrolled');
    if(enrolledCourses.length === 0) return [];

    const courseIds = enrolledCourses.map(c => c.id);
    const quizzes = await getQuizzesByCourses(courseIds);

    const courseMap = new Map(courses.map(c => [c.id, c]));

    return quizzes.map(quiz => {
        const course = courseMap.get(quiz.courseId);
        return {...quiz, courseName: course?.name || 'Unknown' };
    }).filter(q => q.courseName !== 'Unknown');
}

const getQuizzesByCourses = async (courseIds: string[]) => {
    if(courseIds.length === 0) return [];
    const quizzes: any[] = [];
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

export const createNote = async (noteData: any) => {
    const newNoteRef = await addDoc(collection(db, 'notes'), noteData);
    return newNoteRef.id;
}

export const updateNote = async (id: string, noteData: any) => {
    await updateDoc(doc(db, 'notes', id), noteData);
}

export const deleteNote = async (noteId: string) => {
    await deleteDoc(doc(db, 'notes', noteId));
}

export const getStudentNotes = async (studentId: string) => {
    const q = query(collection(db, 'notes'), where('assignedStudentIds', 'array-contains', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
