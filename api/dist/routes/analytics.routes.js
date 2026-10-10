"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
// Routes cho Admin/Teacher
router.get('/questions/:questionId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), analytics_controller_1.getQuestionStats);
router.get('/curriculum-gaps', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN', 'ADMIN']), analytics_controller_1.getCurriculumGaps);
// Routes cho Student gọi khi cần giải thích tự động
router.post('/ai-explain', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['STUDENT']), analytics_controller_1.generateAIExplanation);
exports.default = router;
