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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get questions by week (lesson)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield prisma.question.findMany({
            include: {
                options: true
            }
        });
        // Map backend model to frontend expected format
        const mappedQuestions = questions.map(q => {
            let diff = 'easy';
            if (q.difficulty === 3)
                diff = 'medium';
            if (q.difficulty === 5)
                diff = 'hard';
            const correctIndex = q.options.findIndex(opt => opt.isCorrect);
            return {
                id: q.code,
                week: 1, // hardcoded for demo mapping
                stage: 1,
                category: 'natural_num',
                difficulty: diff,
                question: q.stem,
                options: q.options.map(opt => opt.text),
                correctIndex: correctIndex >= 0 ? correctIndex : 0,
                hint: q.hint,
                explanation: q.explanation
            };
        });
        res.json(mappedQuestions);
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
}));
exports.default = router;
