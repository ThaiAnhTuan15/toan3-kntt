export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_NUMBER = 'fill_number',
  FILL_ANSWER = 'fill_answer',
  MATCHING = 'matching',
  ORDERING = 'ordering',
}

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  AI_GENERATED = 'AI_GENERATED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuestionJSON {
  id?: string;
  code: string;
  grade: number;
  subject: string;
  book: string;
  semester: number;
  topic_id: string;
  lesson_id: string;
  skill_id: string;
  difficulty: number; // 1 to 5
  question_type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  correct_answer: string;
  explanation?: string;
  hint?: string;
  common_mistakes?: string[];
  estimated_time: number;
  curriculum_requirement_id: string;
  status: QuestionStatus;
  source_type: string;
}
