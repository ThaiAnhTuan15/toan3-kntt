import { z } from 'zod';
import { QuestionType, QuestionStatus } from '@toan3/types';

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean().optional()
});

export const QuestionJSONSchema = z.object({
  id: z.string().optional(),
  code: z.string().regex(/^M3-Q-\d{6}$/, "Code must match format M3-Q-XXXXXX"),
  grade: z.literal(3),
  subject: z.literal("TOAN"),
  book: z.literal("KET_NOI_TRI_THUC"),
  semester: z.union([z.literal(1), z.literal(2)]),
  topic_id: z.string(),
  lesson_id: z.string(),
  skill_id: z.string(),
  difficulty: z.number().int().min(1).max(5),
  question_type: z.nativeEnum(QuestionType),
  stem: z.string().min(5, "Question stem is too short"),
  options: z.array(QuestionOptionSchema).optional(),
  correct_answer: z.string().min(1),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  common_mistakes: z.array(z.string()).optional(),
  estimated_time: z.number().min(10).max(600),
  curriculum_requirement_id: z.string(),
  status: z.nativeEnum(QuestionStatus),
  source_type: z.string()
}).refine(data => {
  if (data.question_type === QuestionType.MULTIPLE_CHOICE) {
    if (!data.options || data.options.length < 2) return false;
    // Check if correct_answer matches one of the options
    return data.options.some(opt => opt.id === data.correct_answer);
  }
  return true;
}, {
  message: "Multiple choice questions must have at least 2 options and a valid correct_answer matching an option id.",
  path: ["options"]
});

export const validateQuestion = (data: any) => {
  return QuestionJSONSchema.safeParse(data);
};
