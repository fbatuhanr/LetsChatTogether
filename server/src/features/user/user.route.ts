import express from 'express';
import * as userController from './user.controller'
import multer from 'multer';
import authenticateToken from '../../middleware/authMiddleware';

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

router.get('/', userController.getAll);

router.get('/:id', authenticateToken, userController.get);

router.put('/:id', upload.single('profilePhoto'), userController.update);

router.delete('/:id', userController.remove);

export default router;