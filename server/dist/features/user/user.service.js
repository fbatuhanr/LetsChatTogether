"use strict";
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
const user_model_1 = __importDefault(require("./user.model"));
const friendRequest_model_1 = __importDefault(require("../friendRequest/friendRequest.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_service_1 = require("../auth/auth.service");
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.find();
    });
}
exports.getAll = getAll;
function getAllWithLimitation(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalUsers = yield user_model_1.default.countDocuments();
        const users = yield user_model_1.default.find().skip((page - 1) * limit).limit(limit);
        if (!users)
            return false;
        return {
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users
        };
    });
}
exports.getAllWithLimitation = getAllWithLimitation;
function get(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findById(id);
    });
}
exports.get = get;
function getByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findOne({ username });
    });
}
exports.getByUsername = getByUsername;
function searchUsers(searchRegex, page, limit, currUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const excludeUserId = currUserId || "000000000000000000000000";
        const findPattern = {
            $and: [
                {
                    $or: [
                        { username: { $regex: searchRegex } },
                        { name: { $regex: searchRegex } },
                        { surname: { $regex: searchRegex } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$name", " ", "$surname"] },
                                    regex: searchRegex
                                }
                            }
                        }
                    ]
                },
                { _id: { $ne: excludeUserId } }
            ]
        };
        const totalUsers = yield user_model_1.default.countDocuments(findPattern);
        const users = yield user_model_1.default.find(findPattern).skip((page - 1) * limit).limit(limit);
        if (!users)
            return false;
        return {
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers,
            users,
        };
    });
}
exports.searchUsers = searchUsers;
function login(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = data;
        const user = yield user_model_1.default.findOne({ username });
        if (!user)
            return false;
        if (!user.comparePassword(password))
            return false;
        const accessToken = (0, auth_service_1.generateAccessToken)({ userId: user._id, username: user.username });
        const refreshToken = (0, auth_service_1.generateRefreshToken)({ userId: user._id, username: user.username });
        return { accessToken, refreshToken };
    });
}
exports.login = login;
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        return;
    });
}
exports.logout = logout;
function signup(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = new user_model_1.default(data);
        newUser.hashPassword = bcryptjs_1.default.hashSync(data.password, 10);
        const savedUser = yield newUser.save();
        /* admin automatically adds friends for each new user  */
        const adminUser = yield user_model_1.default.findOne({ username: 'admin' });
        if (adminUser) {
            const newFriendRequest = new friendRequest_model_1.default({
                sender: savedUser._id,
                receiver: adminUser._id,
                status: 'accepted',
            });
            yield newFriendRequest.save();
            yield user_model_1.default.updateOne({ _id: adminUser._id }, { $addToSet: { friends: savedUser._id } });
            yield user_model_1.default.updateOne({ _id: savedUser._id }, { $addToSet: { friends: adminUser._id } });
        }
        return savedUser ? true : false;
    });
}
exports.signup = signup;
function update(id, file, data) {
    let newData = Object.assign({}, data);
    if (file)
        newData = Object.assign(Object.assign({}, newData), { profilePhoto: file.path });
    return user_model_1.default.findOneAndUpdate({ _id: id }, newData);
}
exports.update = update;
function remove(id) {
    return user_model_1.default.findByIdAndDelete(id);
}
exports.remove = remove;
