import { Router } from 'express'
import authenticateToken from '../../middleware/authMiddleware'
import * as friendRequestController from './friendRequest.controller'

const router = Router()

router.get('/status', authenticateToken, friendRequestController.getRequest)

router.post('/send', authenticateToken, friendRequestController.sendRequest)
router.post('/accept/:requestId', authenticateToken, friendRequestController.acceptRequest)

router.delete('/cancel', authenticateToken, friendRequestController.cancelRequest)


router.get('/incoming/:userId', authenticateToken, friendRequestController.getAllRequestsForUser);


export default router