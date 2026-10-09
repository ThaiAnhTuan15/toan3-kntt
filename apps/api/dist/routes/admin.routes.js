"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_question_controller_1 = require("../controllers/admin.question.controller");
const router = (0, express_1.Router)();
// Chỉ SUPER_ADMIN và ADMIN mới được truy cập các API này
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN', 'ADMIN']));
router.get('/questions', admin_question_controller_1.getQuestions);
router.post('/questions', admin_question_controller_1.createQuestion);
router.patch('/questions/:id/status', admin_question_controller_1.updateQuestionStatus);
exports.default = router;
