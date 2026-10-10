"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const parent_routes_1 = __importDefault(require("./routes/parent.routes"));
const teacher_routes_1 = __importDefault(require("./routes/teacher.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://toan3-kntt-web.vercel.app']
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/parent', parent_routes_1.default);
app.use('/api/teacher', teacher_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
const questions_routes_1 = __importDefault(require("./routes/questions.routes"));
app.use('/api/questions', questions_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Toan3KNTT API is running' });
});
app.listen(port, () => {
    console.log(`API Server running on port ${port}`);
});
