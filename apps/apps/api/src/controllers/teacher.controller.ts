import { Request, Response } from 'express';
import prisma from '../config/db';

export const getClassAnalytics = async (req: any, res: Response) => {
  try {
    const teacherUserId = req.user.id;
    
    // Giả sử lấy lớp đầu tiên của giáo viên
    const teacher = await prisma.teacher.findUnique({
      where: { userId: teacherUserId },
      include: { classes: { include: { students: true } } }
    });

    if (!teacher || teacher.classes.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    }

    const classData = teacher.classes[0];
    const studentIds = classData.students.map(s => s.id);

    // Tính điểm trung bình của lớp
    const progressList = await prisma.studentProgress.findMany({
      where: { studentId: { in: studentIds } }
    });

    const averageScore = progressList.reduce((acc, curr) => acc + curr.overallScore, 0) / (progressList.length || 1);

    res.json({
      classId: classData.id,
      className: classData.name,
      totalStudents: studentIds.length,
      averageScore,
      // Trong thực tế sẽ map weak skills của cả lớp
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
