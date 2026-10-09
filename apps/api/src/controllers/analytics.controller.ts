import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AIService } from '../services/ai.service';

export const getQuestionStats = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const stats = await AnalyticsService.getQuestionAnalytics(questionId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

export const getCurriculumGaps = async (req: Request, res: Response) => {
  try {
    const { curriculumId } = req.query;
    if (!curriculumId) return res.status(400).json({ message: 'Missing curriculumId' });
    
    const gaps = await AnalyticsService.getCurriculumGaps(String(curriculumId));
    res.json(gaps);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

export const generateAIExplanation = async (req: Request, res: Response) => {
  try {
    const { questionText, correctAnswer, wrongAnswer } = req.body;
    const explanation = await AIService.generateExplanation(questionText, correctAnswer, wrongAnswer);
    res.json(explanation);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
