import prisma from '../lib/prisma';
import { CreateSubmissionDTO, SubmissionResponse, SubmissionStats } from '../types';

class SubmissionService {
  async createSubmission(data: CreateSubmissionDTO): Promise<SubmissionResponse> {
    const submission = await prisma.submission.create({
      data: {
        userId: data.userId,
        problemId: data.problemId,
        code: data.code,
        language: data.language,
        status: 'Pending',
      },
    });

    return submission;
  }

  async getSubmissionById(id: number): Promise<SubmissionResponse | null> {
    return await prisma.submission.findUnique({ where: { id } });
  }

  async getSubmissionsByUser(userId: number, limit: number = 50, offset: number = 0): Promise<SubmissionResponse[]> {
    return await prisma.submission.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubmissionsByProblem(problemId: number, limit: number = 50, offset: number = 0): Promise<SubmissionResponse[]> {
    return await prisma.submission.findMany({
      where: { problemId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubmissionsByUserAndProblem(userId: number, problemId: number, limit: number = 50, offset: number = 0): Promise<SubmissionResponse[]> {
    return await prisma.submission.findMany({
      where: { userId, problemId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllSubmissions(limit: number = 50, offset: number = 0): Promise<SubmissionResponse[]> {
    return await prisma.submission.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSubmissionStatus(id: number, status: string, runtime?: number, memory?: number): Promise<SubmissionResponse> {
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        runtime,
        memory,
      },
    });

    return submission;
  }

  async getUserStats(userId: number): Promise<SubmissionStats> {
    const submissions = await prisma.submission.findMany({
      where: { userId },
      select: { status: true },
    });

    return this.calculateStats(submissions);
  }

  async getProblemStats(problemId: number): Promise<SubmissionStats> {
    const submissions = await prisma.submission.findMany({
      where: { problemId },
      select: { status: true },
    });

    return this.calculateStats(submissions);
  }

  async deleteSubmission(id: number): Promise<boolean> {
    try {
      await prisma.submission.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSubmissionCount(): Promise<number> {
    return await prisma.submission.count();
  }

  private calculateStats(submissions: { status: string | null }[]): SubmissionStats {
    const stats: SubmissionStats = {
      total: submissions.length,
      accepted: 0,
      wrongAnswer: 0,
      timeLimitExceeded: 0,
      runtimeError: 0,
      compilationError: 0,
    };

    submissions.forEach((sub) => {
      switch (sub.status) {
        case 'Accepted':
          stats.accepted++;
          break;
        case 'Wrong Answer':
          stats.wrongAnswer++;
          break;
        case 'Time Limit Exceeded':
          stats.timeLimitExceeded++;
          break;
        case 'Runtime Error':
          stats.runtimeError++;
          break;
        case 'Compilation Error':
          stats.compilationError++;
          break;
      }
    });

    return stats;
  }
}

export default new SubmissionService();
