import { Request, Response } from 'express';
import prisma from '../config/db';

export const getChildProgress = async (req: any, res: Response) => {
  try {
    const parentUserId = req.user.id;
    // Tìm Parent profile
    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      include: { children: true }
    });

    if (!parent || parent.children.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin học sinh' });
    }

    const childId = parent.children[0].id; // Lấy học sinh đầu tiên

    const progress = await prisma.studentProgress.findUnique({
      where: { studentId: childId }
    });

    const weakSkills = await prisma.skillProgress.findMany({
      where: { studentId: childId, level: { in: ['WEAK', 'DEVELOPING'] } },
      include: { skill: true }
    });

    const strongSkills = await prisma.skillProgress.findMany({
      where: { studentId: childId, level: { in: ['PROFICIENT', 'MASTERED'] } },
      include: { skill: true }
    });

    res.json({
      studentId: childId,
      overallProgress: progress,
      weakSkills,
      strongSkills
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
