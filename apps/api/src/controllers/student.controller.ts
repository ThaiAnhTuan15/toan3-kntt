import { Request, Response } from 'express';
import prisma from '../config/db';

export const getProgress = async (req: any, res: Response) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let progress = await prisma.studentProgress.findUnique({
      where: { studentId: student.id }
    });

    if (!progress) {
      progress = await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          overallScore: 0,
          level: 1,
          stars: 0,
          coins: 0,
          streakData: {},
          badges: [],
          wrongQuestions: [],
          gameState: {}
        }
      });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProgress = async (req: any, res: Response) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const { stars, coins, streakData, badges, wrongQuestions, gameState, overallScore, level } = req.body;

    const progress = await prisma.studentProgress.upsert({
      where: { studentId: student.id },
      update: {
        stars,
        coins,
        streakData: streakData || {},
        badges: badges || [],
        wrongQuestions: wrongQuestions || [],
        gameState: gameState || {},
        overallScore: overallScore || 0,
        level: level || 1
      },
      create: {
        studentId: student.id,
        stars: stars || 0,
        coins: coins || 0,
        streakData: streakData || {},
        badges: badges || [],
        wrongQuestions: wrongQuestions || [],
        gameState: gameState || {},
        overallScore: overallScore || 0,
        level: level || 1
      }
    });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
