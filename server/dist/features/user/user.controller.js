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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.signup = exports.logout = exports.login = exports.searchUsers = exports.getByUsername = exports.get = exports.getAllWithLimitation = exports.getAll = void 0;
const userService = __importStar(require("./user.service"));
const ms_1 = __importDefault(require("ms"));
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield userService.getAll());
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAll = getAll;
function getAllWithLimitation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = yield userService.getAllWithLimitation(page, limit);
            if (result)
                return res.status(200).json(result);
            res.status(500).json({ message: 'Unexpected error occurred.' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllWithLimitation = getAllWithLimitation;
function get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user || req.user.userId !== req.params.id) { // If it is successfully decoded by authMiddleware, decoded information is returned to req.user.
                return res.status(403).json({ message: 'Access denied' });
            }
            res.json(yield userService.get(req.params.id));
        }
        catch (error) {
            next(error);
        }
    });
}
exports.get = get;
function getByUsername(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.query.username;
            res.json(yield userService.getByUsername(username));
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getByUsername = getByUsername;
function searchUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRegex = new RegExp(req.query.query, 'i');
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
            const currUserId = req.query.currUserId;
            const result = yield userService.searchUsers(searchRegex, page, limit, sortOrder, currUserId);
            if (result)
                return res.status(200).json(result);
            res.status(500).json({ message: 'Unexpected error occurred.' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.searchUsers = searchUsers;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield userService.login(req.body);
            if (!result)
                return res.status(404).json({ message: 'Invalid username or password!' });
            if (!result.refreshToken || !result.accessToken)
                return res.status(500).json({ message: 'Unexpected error occurred.' });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // its true when production and its false development mode
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict", // its none when we made production because its based on different domains, but in development its strict because localhost wants that
                maxAge: (0, ms_1.default)(process.env.REFRESH_TOKEN_EXPIRATION)
            });
            return res.status(200).json({
                message: 'Login successful!',
                accessToken: result.accessToken
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.login = login;
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.logout(); // Logout işlemi için service fonksiyonunu çağır
            res.clearCookie('refreshToken'); // Refresh token çerezini temizle
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.logout = logout;
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isSignedUp = yield userService.signup(req.body);
            if (isSignedUp) {
                return res.status(201).json({ message: 'Signup successful!' });
            }
            else {
                return res.status(500).json({ message: 'Signup failed!' });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.signup = signup;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /*
            // it was using for upload to server (before google firebase storage)
            const updatedUser = await userService.update(req.params.id, req.file, req.body)
            */
            const updatedUser = yield userService.update(req.params.id, req.body);
            if (!updatedUser)
                return res.status(404).json({ message: 'An error occurred during profile update!' });
            return res.status(201).json({ message: 'Profile successfully updated!' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
function remove(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield userService.remove(req.params.id));
        }
        catch (error) {
            next(error);
        }
    });
}
exports.remove = remove;
