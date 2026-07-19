import { Router } from 'express';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const router = Router();

// Get all students
router.get('/students', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(students);
  } catch (err: any) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'students', req.params.id));
    if (docSnap.exists()) {
      res.json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err: any) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new student profile
router.post('/students', async (req, res) => {
  try {
    const { name, email, title, skills, reputation, rating, completedProjectsCount, achievements } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const docRef = await addDoc(collection(db, 'students'), {
      name,
      email,
      title: title || '',
      skills: skills || [],
      reputation: reputation || 0,
      rating: rating || 5.0,
      completedProjectsCount: completedProjectsCount || 0,
      achievements: achievements || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    res.json({ success: true, id: docRef.id, message: 'Student profile created' });
  } catch (err: any) {
    console.error('Error creating student:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update student profile
router.put('/students/:id', async (req, res) => {
  try {
    const studentRef = doc(db, 'students', req.params.id);
    const updateData = {
      ...req.body,
      updatedAt: Timestamp.now()
    };

    await updateDoc(studentRef, updateData);
    res.json({ success: true, message: 'Student profile updated' });
  } catch (err: any) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete student profile
router.delete('/students/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'students', req.params.id));
    res.json({ success: true, message: 'Student profile deleted' });
  } catch (err: any) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get students by skill
router.get('/students/skill/:skill', async (req, res) => {
  try {
    const q = query(collection(db, 'students'), where('skills', 'array-contains', req.params.skill));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(students);
  } catch (err: any) {
    console.error('Error fetching students by skill:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
