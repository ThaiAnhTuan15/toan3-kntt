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
exports.generateAIExplanation = exports.getCurriculumGaps = exports.getQuestionStats = void 0;
const analytics_service_1 = require("../services/analytics.service");
const ai_service_1 = require("../services/ai.service");
const getQuestionStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        const stats = yield analytics_service_1.AnalyticsService.getQuestionAnalytics(questionId);
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.getQuestionStats = getQuestionStats;
const getCurriculumGaps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { curriculumId } = req.query;
        if (!curriculumId)
            return res.status(400).json({ message: 'Missing curriculumId' });
        const gaps = yield analytics_service_1.AnalyticsService.getCurriculumGaps(String(curriculumId));
        res.json(gaps);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.getCurriculumGaps = getCurriculumGaps;
const generateAIExplanation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, wrongAnswer } = req.body;
        const explanation = yield ai_service_1.AIService.generateExplanation(questionId, wrongAnswer);
        res.json(explanation);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});
exports.generateAIExplanation = generateAIExplanation;
