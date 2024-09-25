import { Router } from 'express'
import authenticateToken from '../../middleware/authMiddleware'
import * as userController from './user.controller'
/*
// it was using for upload to server (before google firebase storage)
import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })
*/

const router = Router();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.signup);

router.get('/find', userController.getByUsername);
router.get('/search', userController.searchUsers);

router.get('/', authenticateToken, userController.getAllWithLimitation);
router.get('/:id', authenticateToken, userController.get);

/*
// it was using for upload to server (before google firebase storage)
router.put('/:id', authenticateToken, upload.single('profilePhoto'), userController.update);
*/
router.put('/:id', authenticateToken, userController.update);

router.delete('/:id', authenticateToken, userController.remove);

export default router;