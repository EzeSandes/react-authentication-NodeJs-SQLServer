const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

module.exports = router;
