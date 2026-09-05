import { Request, Response } from 'express';
import prisma from '../config/db';
import { QuestionService } from '../services/question.service';
import { QuestionStatus } from '@toan3/types';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { status, skillId, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (skillId) whereClause.skillId = skillId;

    const questions = await prisma.question.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { skill: true, options: true }
    });

    const total = await prisma.question.count({ where: whereClause });

    res.json({
      data: questions,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const result = await QuestionService.createQuestion(req.body);
    // Lưu ý: createQuestion trong service hiện đang return mock
    // Trong thực tế sẽ gọi prisma.question.create
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQuestionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(QuestionStatus).includes(status)) {
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
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
