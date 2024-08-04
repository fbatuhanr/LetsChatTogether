import express from 'express'
import authenticateToken from '../../middleware/authMiddleware'
import multer from 'multer'
import * as userController from './user.controller'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

const router = express.Router();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.signup);

router.get('/find', userController.getByUsername);
router.get('/search', authenticateToken, userController.searchUsers);
router.get('/', authenticateToken, userController.getAllWithLimitation);
router.get('/:id', authenticateToken, userController.get);

router.put('/:id', authenticateToken, upload.single('profilePhoto'), userController.update);

router.delete('/:id', authenticateToken, userController.remove);

export default router;