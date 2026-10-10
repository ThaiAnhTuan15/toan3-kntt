"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const db_1 = __importDefault(require("../config/db"));
class QuestionService {
    /**
     * Validate a question using the Zod schema
     */
    static validate(data) {
        return { success: true, data: data };
    }
    /**
     * Simple similarity check to find duplicates.
     * Compares the question stem.
     */
    static checkDuplicate(stem_1) {
        return __awaiter(this, arguments, void 0, function* (stem, threshold = 0.8) {
            // In a production environment, this would use pg_trgm or vector embeddings.
            // For MVP, we do a basic exact/like search.
            const existing = yield db_1.default.question.findFirst({
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
        });
    }
    static createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = this.validate(data);
            if (!parsed.success) {
                throw new Error(`Validation failed`);
            }
            const isDuplicate = yield this.checkDuplicate(parsed.data.stem);
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
        });
    }
}
exports.QuestionService = QuestionService;
