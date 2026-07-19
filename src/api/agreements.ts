import { Router } from 'express';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const router = Router();

// Get all agreements
router.get('/agreements', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'agreements'));
    const agreements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(agreements);
  } catch (err: any) {
    console.error('Error fetching agreements:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get agreement by ID
router.get('/agreements/:id', async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'agreements', req.params.id));
    if (docSnap.exists()) {
      res.json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: 'Agreement not found' });
    }
  } catch (err: any) {
    console.error('Error fetching agreement:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new agreement
router.post('/agreements', async (req, res) => {
  try {
    const { studentId, opportunityId, studentName, companyName, projectTitle, budget, description, clauses, milestones } = req.body;

    if (!studentId || !opportunityId) {
      return res.status(400).json({ error: 'Student ID and Opportunity ID are required' });
    }

    const docRef = await addDoc(collection(db, 'agreements'), {
      studentId,
      opportunityId,
      studentName: studentName || '',
      companyName: companyName || '',
      projectTitle: projectTitle || '',
      budget: budget || '0',
      description: description || '',
      clauses: clauses || [],
      milestones: milestones || [],
      status: 'draft',
      escrowAmount: budget || '0',
      escrowLocked: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    res.json({ success: true, id: docRef.id, message: 'Agreement created' });
  } catch (err: any) {
    console.error('Error creating agreement:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update agreement
router.put('/agreements/:id', async (req, res) => {
  try {
    const agreementRef = doc(db, 'agreements', req.params.id);
    const updateData = {
      ...req.body,
      updatedAt: Timestamp.now()
    };

    await updateDoc(agreementRef, updateData);
    res.json({ success: true, message: 'Agreement updated' });
  } catch (err: any) {
    console.error('Error updating agreement:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete agreement
router.delete('/agreements/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'agreements', req.params.id));
    res.json({ success: true, message: 'Agreement deleted' });
  } catch (err: any) {
    console.error('Error deleting agreement:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get agreements by student
router.get('/agreements/student/:studentId', async (req, res) => {
  try {
    const q = query(collection(db, 'agreements'), where('studentId', '==', req.params.studentId));
    const querySnapshot = await getDocs(q);
    const agreements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(agreements);
  } catch (err: any) {
    console.error('Error fetching student agreements:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get agreements by company
router.get('/agreements/company/:companyName', async (req, res) => {
  try {
    const q = query(collection(db, 'agreements'), where('companyName', '==', req.params.companyName));
    const querySnapshot = await getDocs(q);
    const agreements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(agreements);
  } catch (err: any) {
    console.error('Error fetching company agreements:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get agreements by status
router.get('/agreements/status/:status', async (req, res) => {
  try {
    const q = query(collection(db, 'agreements'), where('status', '==', req.params.status));
    const querySnapshot = await getDocs(q);
    const agreements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(agreements);
  } catch (err: any) {
    console.error('Error fetching agreements by status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Lock escrow for agreement
router.post('/agreements/:id/lock-escrow', async (req, res) => {
  try {
    const agreementRef = doc(db, 'agreements', req.params.id);
    await updateDoc(agreementRef, {
      escrowLocked: true,
      status: 'active',
      escrowLockedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    res.json({ success: true, message: 'Escrow locked successfully' });
  } catch (err: any) {
    console.error('Error locking escrow:', err);
    res.status(500).json({ error: err.message });
  }
});

// Release milestone payment
router.post('/agreements/:id/release-milestone', async (req, res) => {
  try {
    const { milestoneIndex } = req.body;
    const docSnap = await getDoc(doc(db, 'agreements', req.params.id));
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Agreement not found' });
    }

    const data = docSnap.data();
    const milestones = data.milestones || [];

    if (milestoneIndex >= milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    milestones[milestoneIndex].released = true;
    milestones[milestoneIndex].releasedAt = new Date().toISOString();

    await updateDoc(doc(db, 'agreements', req.params.id), {
      milestones,
      updatedAt: Timestamp.now()
    });

    res.json({ success: true, message: 'Milestone payment released' });
  } catch (err: any) {
    console.error('Error releasing milestone:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
