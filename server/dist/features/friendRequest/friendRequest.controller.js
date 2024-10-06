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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRequest = exports.acceptRequest = exports.sendRequest = exports.getRequestStatusBetweenUsers = exports.getIncomingRequests = exports.getOutgoingRequests = void 0;
const friendRequestService = __importStar(require("./friendRequest.service"));
function getIncomingRequests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const allRequests = yield friendRequestService.getIncomingRequests(userId);
            if (!allRequests)
                return res
                    .status(404)
                    .json({ message: "Incoming friend requests not found!" });
            return res.status(200).json(allRequests);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getIncomingRequests = getIncomingRequests;
function getOutgoingRequests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const allRequests = yield friendRequestService.getOutgoingRequests(userId);
            if (!allRequests)
                return res
                    .status(404)
                    .json({ message: "Outgoing friend requests not found!" });
            return res.status(200).json(allRequests);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getOutgoingRequests = getOutgoingRequests;
function acceptRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.body;
            const result = yield friendRequestService.acceptRequest(senderId, receiverId);
            if (!result)
                return res.status(404).json({ message: "Friend request accept failed!" });
            return res.status(201).json({ message: "Friend request accepted!" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.acceptRequest = acceptRequest;
function cancelRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.body;
            const request = yield friendRequestService.cancelRequest(senderId, receiverId);
            if (!request)
                return res
                    .status(404)
                    .json({ message: "Friend request not found or already processed!" });
            res.status(200).json({ message: "Friend request canceled successfully!" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.cancelRequest = cancelRequest;
function getRequestStatusBetweenUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.query;
            const request = yield friendRequestService.getRequestStatusBetweenUsers(senderId, receiverId);
            if (!request)
                return res.status(404).json({ message: "Friend request not found!" });
            return res.status(200).json(request);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getRequestStatusBetweenUsers = getRequestStatusBetweenUsers;
function sendRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.body;
            const friendRequest = yield friendRequestService.sendRequest(senderId, receiverId);
            if (friendRequest) {
                return res
                    .status(201)
                    .json({ message: "Friend request sent successfully!" });
            }
            else {
                return res.status(500).json({ message: "Friend request failed!" });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.sendRequest = sendRequest;
