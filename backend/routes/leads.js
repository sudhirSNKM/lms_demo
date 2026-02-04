const express = require('express');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead
} = require('../controllers/leads');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router
    .route('/')
    .get(getLeads)
    .post(createLead);

router
    .route('/:id')
    .get(getLead)
    .put(updateLead)
    .delete(authorize('admin', 'manager'), deleteLead);

module.exports = router;
