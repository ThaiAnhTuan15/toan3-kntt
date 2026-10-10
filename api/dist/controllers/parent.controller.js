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
exports.getChildProgress = void 0;
const db_1 = __importDefault(require("../config/db"));
const getChildProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parentUserId = req.user.id;
        // Tìm Parent profile
        const parent = yield db_1.default.parent.findUnique({
            where: { userId: parentUserId },
            include: { children: true }
        });
        if (!parent || parent.children.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin học sinh' });
        }
        const childId = parent.children[0].id; // Lấy học sinh đầu tiên
        const progress = yield db_1.default.studentProgress.findUnique({
            where: { studentId: childId }
        });
        const weakSkills = yield db_1.default.skillProgress.findMany({
            where: { studentId: childId, level: { in: ['WEAK', 'DEVELOPING'] } },
            include: { skill: true }
        });
        const strongSkills = yield db_1.default.skillProgress.findMany({
            where: { studentId: childId, level: { in: ['PROFICIENT', 'MASTERED'] } },
            include: { skill: true }
        });
        res.json({
            studentId: childId,
            overallProgress: progress,
            weakSkills,
            strongSkills
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.getChildProgress = getChildProgress;
