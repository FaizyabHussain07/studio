import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

// User Management
export const createUser = async (userData) => {
  const newUser = await addDoc(collection(db, 'users'), userData);
  return newUser.id;
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
  const userDoc = await getDoc(doc(db, 'users', id));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
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

export const updateCourse = async (id, courseData) => {
  await updateDoc(doc(db, 'courses', id), courseData);
};

export const deleteCourse = async (id) => {
  await deleteDoc(doc(db, 'courses', id));
};

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


export const getAssignment = async (id) => {
  const assignmentDoc = await getDoc(doc(db, 'assignments', id));
  return assignmentDoc.exists() ? { id: assignmentDoc.id, ...assignmentDoc.data() } : null;
};

export const updateAssignment = async (id, assignmentData) => {
  await updateDoc(doc(db, 'assignments', id), assignmentData);
};

export const deleteAssignment = async (id) => {
  await deleteDoc(doc(db, 'assignments', id));
};

// Submissions
export const createSubmission = async (submissionData) => {
    const newSubmission = await addDoc(collection(db, 'submissions'), submissionData);
    return newSubmission.id;
}

export const getSubmissionsByAssignment = async (assignmentId) => {
    const q = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
