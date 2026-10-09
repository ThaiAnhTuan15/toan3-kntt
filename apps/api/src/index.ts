import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import parentRoutes from './routes/parent.routes';
import teacherRoutes from './routes/teacher.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://toan3-kntt-web.vercel.app']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/analytics', analyticsRoutes);
import questionsRoutes from './routes/questions.routes';
app.use('/api/questions', questionsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Toan3KNTT API is running' });
});

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
