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
exports.updateQuestionStatus = exports.createQuestion = exports.getQuestions = void 0;
const db_1 = __importDefault(require("../config/db"));
const question_service_1 = require("../services/question.service");
const client_1 = require("@prisma/client");
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, skillId, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const whereClause = {};
        if (status)
            whereClause.status = status;
        if (skillId)
            whereClause.skillId = skillId;
        const questions = yield db_1.default.question.findMany({
            where: whereClause,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: { skill: true, options: true }
        });
        const total = yield db_1.default.question.count({ where: whereClause });
        res.json({
            data: questions,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.getQuestions = getQuestions;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield question_service_1.QuestionService.createQuestion(req.body);
        // Lưu ý: createQuestion trong service hiện đang return mock
        // Trong thực tế sẽ gọi prisma.question.create
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createQuestion = createQuestion;
const updateQuestionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(client_1.QuestionStatus).includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }
        /*
        const updated = await prisma.question.update({
          where: { id },
          data: { status }
        });
        return res.json(updated);
        */
        res.json({ message: `Đã cập nhật câu hỏi ${id} thành trạng thái ${status}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.updateQuestionStatus = updateQuestionStatus;
