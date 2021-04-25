const Express = require('express');
const router = Express.Router();
const UserController = require('../controllers/userController')

router.post('/login', UserController.Login);
router.post('/register', UserController.Register);
router.get('/verify-email/:id', UserController.VerifyEmail)

router.post('/update/password', UserController.UpdateFunctions.changePassword);
router.post('/update/email', UserController.UpdateFunctions.changeEmail);
router.post('/update/username', UserController.UpdateFunctions.changeUsername);
router.post('/update/address', UserController.UpdateFunctions.updateAddress);
router.post('/update/profile', UserController.UpdateFunctions.updateProfile);

router.get('/reset/password/sendmail', UserController.ForgetPassword.SendMail);
router.get('/reset/password/verification', UserController.ForgetPassword.TakeToken);
router.post('/reset/password', UserController.ForgetPassword.ResetPassword);

router.get('/delete', UserController.Delete);
router.get('/freeze', UserController.Freeze);

router.get('/get', UserController.GetUserData)

router.get('/:username', UserController.UserProfile)
module.exports = router;
