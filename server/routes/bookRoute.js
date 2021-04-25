const Express = require('express');
const router = Express.Router();
const BookController = require('../controllers/bookController.js');
const verificate = require('../middleware/verificate');

router.use(verificate)

router.get("/test", BookController.test);
router.post("/new",BookController.NewSwapBook);
router.get("/remove/:id", BookController.RemoveSwapBook);

router.post("/request/new", BookController.NewSwapRequest);
router.get("/request/:id", BookController.GetSwapRequest);
router.get("/request/:id", BookController.RemoveSwapRequest);

module.exports = router;
