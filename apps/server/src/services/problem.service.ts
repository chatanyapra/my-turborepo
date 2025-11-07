import prisma from '../lib/prisma';
import { CreateProblemDTO, UpdateProblemDTO, ProblemResponse, TestCase } from '../types';

class ProblemService {
  async createProblem(data: CreateProblemDTO): Promise<ProblemResponse> {
    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        constraints: data.constraints,
        examples: data.examples as any,
        testCases: data.testCases as any,
        tags: data.tags || [],
        timeLimit: data.timeLimit || 1,
        memoryLimit: data.memoryLimit || 128,
        createdBy: data.createdBy,
      },
    });

    return this.formatProblem(problem, false);
  }

  async getProblemById(id: number, includeHidden: boolean = false): Promise<ProblemResponse | null> {
    const problem = await prisma.problem.findUnique({ where: { id } });
    return problem ? this.formatProblem(problem, includeHidden) : null;
  }

  async getAllProblems(limit: number = 50, offset: number = 0): Promise<ProblemResponse[]> {
    const problems = await prisma.problem.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return problems.map((p) => this.formatProblem(p, false));
  }

  async getProblemsByDifficulty(difficulty: string, limit: number = 50, offset: number = 0): Promise<ProblemResponse[]> {
    const problems = await prisma.problem.findMany({
      where: { difficulty },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return problems.map((p) => this.formatProblem(p, false));
  }

  async getProblemsByTag(tag: string, limit: number = 50, offset: number = 0): Promise<ProblemResponse[]> {
    const problems = await prisma.problem.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return problems.map((p) => this.formatProblem(p, false));
  }

  async getProblemsByCreator(userId: number, limit: number = 50, offset: number = 0): Promise<ProblemResponse[]> {
    const problems = await prisma.problem.findMany({
      where: { createdBy: userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return problems.map((p) => this.formatProblem(p, true)); // Creator sees hidden tests
  }

  async updateProblem(id: number, data: UpdateProblemDTO): Promise<ProblemResponse> {
    const existing = await prisma.problem.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Problem not found');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.constraints !== undefined) updateData.constraints = data.constraints;
    if (data.examples !== undefined) updateData.examples = data.examples;
    if (data.testCases !== undefined) updateData.testCases = data.testCases;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.timeLimit !== undefined) updateData.timeLimit = data.timeLimit;
    if (data.memoryLimit !== undefined) updateData.memoryLimit = data.memoryLimit;

    const problem = await prisma.problem.update({
      where: { id },
      data: updateData,
    });

    return this.formatProblem(problem, true);
  }

  async deleteProblem(id: number): Promise<boolean> {
    try {
      await prisma.problem.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getProblemCount(): Promise<number> {
    return await prisma.problem.count();
  }

  async getProblemCountByDifficulty(difficulty: string): Promise<number> {
    return await prisma.problem.count({ where: { difficulty } });
  }

  private formatProblem(problem: any, includeHidden: boolean): ProblemResponse {
    const testCases = problem.testCases as TestCase[];
    
    return {
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      examples: problem.examples,
      testCases: includeHidden ? testCases : testCases.filter((tc) => !tc.hidden),
      tags: problem.tags,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      createdBy: problem.createdBy,
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    };
  }
}

export default new ProblemService();
