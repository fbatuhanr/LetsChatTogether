"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const userController = __importStar(require("./user.controller"));
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
const router = (0, express_1.Router)();
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/sign-up', userController.signup);
router.get('/find', userController.getByUsername);
router.get('/search', userController.searchUsers);
router.get('/', authMiddleware_1.default, userController.getAllWithLimitation);
router.get('/:id', authMiddleware_1.default, userController.get);
/*
// it was using for upload to server (before google firebase storage)
router.put('/:id', authenticateToken, upload.single('profilePhoto'), userController.update);
*/
router.put('/:id', authMiddleware_1.default, userController.update);
router.delete('/:id', authMiddleware_1.default, userController.remove);
exports.default = router;
