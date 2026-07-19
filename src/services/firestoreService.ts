import {
  db,
  auth
} from './firebaseClient';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  onSnapshot,
  Query,
  DocumentSnapshot
} from 'firebase/firestore';

// ============ STUDENTS ============

export const createStudent = async (studentData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: auth.currentUser?.uid
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const getStudent = async (studentId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'students', studentId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    console.error('Error getting student:', error);
    throw error;
  }
};

export const updateStudent = async (studentId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'students', studentId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const subscribeToStudents = (callback: (students: any[]) => void) => {
  try {
    return onSnapshot(collection(db, 'students'), (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(students);
    });
  } catch (error: any) {
    console.error('Error subscribing to students:', error);
    throw error;
  }
};

// ============ OPPORTUNITIES ============

export const createOpportunity = async (oppData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'opportunities'), {
      ...oppData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: auth.currentUser?.uid
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating opportunity:', error);
    throw error;
  }
};

export const getOpportunity = async (opportunityId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'opportunities', opportunityId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    console.error('Error getting opportunity:', error);
    throw error;
  }
};

export const getAllOpportunities = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'opportunities'), where('status', '==', 'active'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error('Error getting opportunities:', error);
    throw error;
  }
};

export const subscribeToOpportunities = (callback: (opportunities: any[]) => void) => {
  try {
    return onSnapshot(
      query(collection(db, 'opportunities'), where('status', '==', 'active')),
      (snapshot) => {
        const opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(opportunities);
      }
    );
  } catch (error: any) {
    console.error('Error subscribing to opportunities:', error);
    throw error;
  }
};

export const updateOpportunity = async (opportunityId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'opportunities', opportunityId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    console.error('Error updating opportunity:', error);
    throw error;
  }
};

// ============ AGREEMENTS/CONTRACTS ============

export const createAgreement = async (agreementData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'agreements'), {
      ...agreementData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: auth.currentUser?.uid,
      status: 'draft'
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating agreement:', error);
    throw error;
  }
};

export const getAgreement = async (agreementId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'agreements', agreementId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    console.error('Error getting agreement:', error);
    throw error;
  }
};

export const updateAgreement = async (agreementId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'agreements', agreementId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    console.error('Error updating agreement:', error);
    throw error;
  }
};

export const lockEscrow = async (agreementId: string) => {
  try {
    await updateDoc(doc(db, 'agreements', agreementId), {
      escrowLocked: true,
      status: 'active',
      escrowLockedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    console.error('Error locking escrow:', error);
    throw error;
  }
};

export const releaseMilestonePayment = async (agreementId: string, milestoneIndex: number) => {
  try {
    const agreement = await getAgreement(agreementId);
    if (!agreement) throw new Error('Agreement not found');

    const milestones = agreement.milestones || [];
    if (milestones[milestoneIndex]) {
      milestones[milestoneIndex].released = true;
      milestones[milestoneIndex].releasedAt = new Date().toISOString();
      
      await updateDoc(doc(db, 'agreements', agreementId), {
        milestones,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error: any) {
    console.error('Error releasing milestone:', error);
    throw error;
  }
};

export const subscribeToAgreements = (callback: (agreements: any[]) => void) => {
  try {
    return onSnapshot(collection(db, 'agreements'), (snapshot) => {
      const agreements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(agreements);
    });
  } catch (error: any) {
    console.error('Error subscribing to agreements:', error);
    throw error;
  }
};

// ============ SEARCH & FILTER ============

export const searchStudentsBySkill = async (skill: string) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'students'), where('skills', 'array-contains', skill))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export const getOpportunitiesByCategory = async (category: string) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'opportunities'),
        where('category', '==', category),
        where('status', '==', 'active')
      )
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error('Error getting opportunities by category:', error);
    throw error;
  }
};
