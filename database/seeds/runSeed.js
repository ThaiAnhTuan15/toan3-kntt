const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting Seed...');

  // 1. Create generic structure
  const curriculum = await prisma.curriculum.create({
    data: { name: 'GDPT 2018 - Toán 3' }
  });

  const req = await prisma.curriculumRequirement.create({
    data: { code: 'YC-03', description: 'Yêu cầu cần đạt Toán 3', curriculumId: curriculum.id }
  });

  const book = await prisma.book.create({
    data: { title: 'Toán 3 Kết nối tri thức', publisher: 'NXB Giáo dục' }
  });

  const chapter = await prisma.bookChapter.create({
    data: { title: 'Chương 1: Ôn tập', bookId: book.id }
  });

  const lesson = await prisma.bookLesson.create({
    data: { title: 'Bài 1', lessonOrder: 1, chapterId: chapter.id }
  });

  const topic = await prisma.topic.create({
    data: { name: 'Số học' }
  });

  const subtopic = await prisma.subtopic.create({
    data: { name: 'Cộng trừ nhân chia', topicId: topic.id }
  });

  const skill = await prisma.skill.create({
    data: { 
      name: 'Kỹ năng Toán cơ bản',
      subtopicId: subtopic.id,
      lessonId: lesson.id,
      requirementId: req.id
    }
  });

  console.log('Created base curriculum and skill:', skill.id);

  // 2. Read Stage 1 JS
  const stage1Path = path.join(__dirname, '../../apps/web/src/data/stages/stage1.js');
  if (fs.existsSync(stage1Path)) {
    let content = fs.readFileSync(stage1Path, 'utf8');
    // Replace "export const STAGE_1_QUESTIONS =" with "module.exports ="
    content = content.replace(/export const STAGE_1_QUESTIONS\s*=\s*/g, 'module.exports = ');
    
    // Save to a temp commonjs file
    const tempPath = path.join(__dirname, 'temp_stage1.js');
    fs.writeFileSync(tempPath, content, 'utf8');
    
    // Require it
    const questions = require('./temp_stage1.js');
    console.log(`Found ${questions.length} questions in stage1.js`);
    
    let count = 0;
    for (const q of questions) {
      // Map frontend fields to Prisma model Question
      // schema: code, stem, type, difficulty (Int), status, skillId, correctAnswer, explanation, hint, estimatedTime
      let diffInt = 1;
      if (q.difficulty === 'medium') diffInt = 3;
      if (q.difficulty === 'hard') diffInt = 5;

      const correctAnswerText = q.options ? q.options[q.correctIndex] : q.correctAnswer || '';

      try {
        await prisma.question.create({
          data: {
            code: q.id || `Q_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            stem: q.question,
            type: 'MULTIPLE_CHOICE', // assume MC for now
            difficulty: diffInt,
            status: 'PUBLISHED',
            correctAnswer: correctAnswerText,
            explanation: q.explanation || '',
            hint: q.hint || '',
            estimatedTime: 60,
            skillId: skill.id,
            lessonId: lesson.id,
            requirementId: req.id,
            options: {
              create: q.options ? q.options.map((opt, idx) => ({
                text: opt,
                isCorrect: idx === q.correctIndex
              })) : []
            }
          }
        });
        count++;
      } catch (e) {
        console.error('Error seeding question:', q.id, e.message);
      }
    }
    console.log(`Successfully seeded ${count} questions.`);
    fs.unlinkSync(tempPath);
  } else {
    console.log('stage1.js not found!');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
