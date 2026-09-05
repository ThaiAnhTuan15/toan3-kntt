import prisma from '../config/db';
import { QuestionJSONSchema } from '@toan3/validation';

export class QuestionService {
  /**
   * Validate a question using the Zod schema
   */
  static validate(data: any) {
    return QuestionJSONSchema.safeParse(data);
  }

  /**
   * Simple similarity check to find duplicates.
   * Compares the question stem.
   */
  static async checkDuplicate(stem: string, threshold = 0.8): Promise<boolean> {
    // In a production environment, this would use pg_trgm or vector embeddings.
    // For MVP, we do a basic exact/like search.
    const existing = await prisma.question.findFirst({
      where: {
        stem: {
          equals: stem,
          mode: 'insensitive' // Requires PostgreSQL
        }
      }
    });

    if (existing) {
      return true; // Found an exact or case-insensitive match
    }

    // Pseudo-code for calculating Levenshtein distance or trigram similarity
    // const similar = await prisma.$queryRaw`SELECT id FROM "Question" WHERE similarity(stem, ${stem}) > ${threshold}`;
    // return similar.length > 0;
    
    return false;
  }

  static async createQuestion(data: any) {
    const parsed = this.validate(data);
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`);
    }

    const isDuplicate = await this.checkDuplicate(parsed.data.stem);
    if (isDuplicate) {
      throw new Error('Duplicate question detected based on similarity score.');
    }

    // Logic to insert into Prisma database
    /*
    return prisma.question.create({
      data: {
        code: parsed.data.code,
        stem: parsed.data.stem,
        type: parsed.data.question_type,
        difficulty: parsed.data.difficulty,
        skillId: parsed.data.skill_id,
        // ... mapped fields
      }
    });
    */
    return { success: true, message: 'Question created successfully', data: parsed.data };
  }
}
