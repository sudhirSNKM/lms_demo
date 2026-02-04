const express = require('express');
const { getActivities } = require('../controllers/activities');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getActivities);

module.exports = router;
