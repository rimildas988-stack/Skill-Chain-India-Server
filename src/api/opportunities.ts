import { Router } from 'express';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const router = Router();

// Get all opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'opportunities'));
    const opportunities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(opportunities);
  } catch (err: any) {
    console.error('Error fetching opportunities:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get opportunity by ID
router.get('/opportunities/:id', async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'opportunities', req.params.id));
    if (docSnap.exists()) {
      res.json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (err: any) {
    console.error('Error fetching opportunity:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new opportunity
router.post('/opportunities', async (req, res) => {
  try {
    const { title, companyName, description, category, budget, paymentMethod, requiredSkills } = req.body;

    if (!title || !companyName) {
      return res.status(400).json({ error: 'Title and company name are required' });
    }

    const docRef = await addDoc(collection(db, 'opportunities'), {
      title,
      companyName,
      description: description || '',
      category: category || '',
      budget: budget || '0',
      paymentMethod: paymentMethod || 'USDC',
      requiredSkills: requiredSkills || [],
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    res.json({ success: true, id: docRef.id, message: 'Opportunity created' });
  } catch (err: any) {
    console.error('Error creating opportunity:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update opportunity
router.put('/opportunities/:id', async (req, res) => {
  try {
    const opportunityRef = doc(db, 'opportunities', req.params.id);
    const updateData = {
      ...req.body,
      updatedAt: Timestamp.now()
    };

    await updateDoc(opportunityRef, updateData);
    res.json({ success: true, message: 'Opportunity updated' });
  } catch (err: any) {
    console.error('Error updating opportunity:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete opportunity
router.delete('/opportunities/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'opportunities', req.params.id));
    res.json({ success: true, message: 'Opportunity deleted' });
  } catch (err: any) {
    console.error('Error deleting opportunity:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get opportunities by category
router.get('/opportunities/category/:category', async (req, res) => {
  try {
    const q = query(collection(db, 'opportunities'), where('category', '==', req.params.category));
    const querySnapshot = await getDocs(q);
    const opportunities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(opportunities);
  } catch (err: any) {
    console.error('Error fetching opportunities by category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get active opportunities
router.get('/opportunities/status/active', async (req, res) => {
  try {
    const q = query(collection(db, 'opportunities'), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    const opportunities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(opportunities);
  } catch (err: any) {
    console.error('Error fetching active opportunities:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
