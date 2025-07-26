import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, documentId, orderBy, limit, writeBatch, setDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadFile = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `submissions/${new Date().getTime()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      }, 
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};


// User Management
export const createUser = async (userData) => {
  // Use uid as the document ID if provided, otherwise Firestore generates one.
  const userRef = userData.uid ? doc(db, 'users', userData.uid) : doc(collection(db, 'users'));
  // If uid is not provided, we need to add it to the data.
  const finalUserData = { ...userData, uid: userRef.id };
  await setDoc(userRef, finalUserData);
};


export const updateUser = async (id, userData) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, userData);
}

export const deleteUser = async (userId) => {
    // This function only deletes the Firestore user document.
    // Deleting a user from Firebase Auth requires admin privileges and is best done from a secure server environment (e.g., Firebase Functions).
    // Attempting to do this on the client can expose admin credentials.
    await deleteDoc(doc(db, 'users', userId));
    // Here you would also call a Firebase Function to delete the Auth user.
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
  const newCourse = await addDoc(collection(db, 'courses'), courseData);
  return newCourse.id;
};

export const updateCourse = async (id, courseData) => {
    await updateDoc(doc(db, 'courses', id), courseData);
}

export const deleteCourse = async (courseId) => {
    const batch = writeBatch(db);
    
    const courseRef = doc(db, 'courses', courseId);
    batch.delete(courseRef);

    const assignmentsQuery = query(collection(db, 'assignments'), where('courseId', '==', courseId));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    
    if (!assignmentsSnapshot.empty) {
        const assignmentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        
        assignmentsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Split assignmentIds into chunks of 30 for 'in' query limitation
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

    await batch.commit();
}


export const getCourses = async () => {
  const snapshot = await getDocs(collection(db, 'courses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCourse = async (id) => {
  if (!id) return null;
  const courseDoc = await getDoc(doc(db, 'courses', id));
  return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;
};

export const getStudentCourses = async (studentId) => {
  const user = await getUser(studentId);
  if (!user || !user.courses || user.courses.length === 0) {
    return [];
  }
  const courses = [];
  // Firestore 'in' queries are limited to 30 items. Chunk if needed.
  for (let i = 0; i < user.courses.length; i+= 30) {
      const chunk = user.courses.slice(i, i + 30);
      if (chunk.length > 0) {
        const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', chunk));
        const snapshot = await getDocs(coursesQuery);
        snapshot.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
      }
  }
  return courses;
};

export const getStudentCoursesWithProgress = async (studentId) => {
  const courses = await getStudentCourses(studentId);
  if (courses.length === 0) return [];
  
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const assignments = await getAssignmentsByCourse(course.id);
      if(assignments.length === 0) return {...course, progress: 0};

      const assignmentIds = assignments.map(a => a.id);
      const submissions = await getSubmissionsByStudent(studentId, assignmentIds);
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
    const q = query(collection(db, "assignments"), where("courseId", "==", courseId), orderBy("dueDate", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getStudentAssignmentsWithStatus = async (studentId) => {
    const courses = await getStudentCourses(studentId);
    if(courses.length === 0) return [];

    const courseIds = courses.map(c => c.id);
    if(courseIds.length === 0) return [];

    const assignments = [];
    for (let i = 0; i < courseIds.length; i += 30) {
        const chunk = courseIds.slice(i, i + 30);
        if (chunk.length > 0) {
            const q = query(collection(db, "assignments"), where("courseId", "in", chunk));
            const snapshot = await getDocs(q);
            snapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() }));
        }
    }

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
  // Chunking to handle 'in' query limitation (max 30 values)
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
    if (assignment && new Date(assignment.dueDate) < new Date()) {
        return 'Missing';
    }
    return 'Pending';
  }
  return snapshot.docs[0].data().status || 'Submitted';
}
