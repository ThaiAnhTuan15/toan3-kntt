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
exports.getClassAnalytics = void 0;
const db_1 = __importDefault(require("../config/db"));
const getClassAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacherUserId = req.user.id;
        // Giả sử lấy lớp đầu tiên của giáo viên
        const teacher = yield db_1.default.teacher.findUnique({
            where: { userId: teacherUserId },
            include: { classes: { include: { students: true } } }
        });
        if (!teacher || teacher.classes.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lớp học' });
        }
        const classData = teacher.classes[0];
        const studentIds = classData.students.map(s => s.id);
        // Tính điểm trung bình của lớp
        const progressList = yield db_1.default.studentProgress.findMany({
            where: { studentId: { in: studentIds } }
        });
        const averageScore = progressList.reduce((acc, curr) => acc + curr.overallScore, 0) / (progressList.length || 1);
        res.json({
            classId: classData.id,
            className: classData.name,
            totalStudents: studentIds.length,
            averageScore,
            // Trong thực tế sẽ map weak skills của cả lớp
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.getClassAnalytics = getClassAnalytics;
