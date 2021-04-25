const Express = require('express');
const router = Express.Router();
const AdminController = require('../controllers/adminController.js');
const adminVerification = require('../middleware/adminVerification');

router.use(adminVerification);

router.get("/block/:id", AdminController.BlockUser);
router.get("/unblock/:id", AdminController.UnblockUser);

module.exports = router;
