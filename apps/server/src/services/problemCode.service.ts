import prisma from '../lib/prisma';
import { CreateProblemCodeDTO, UpdateProblemCodeDTO, ProblemCodeResponse } from '../types';

class ProblemCodeService {
  async createProblemCode(data: CreateProblemCodeDTO): Promise<ProblemCodeResponse> {
    const problemCode = await prisma.problemCode.create({
      data: {
        problemId: data.problemId,
        language: data.language,
        wrapperCode: data.wrapperCode,
        boilerplateCode: data.boilerplateCode,
      },
    });

    return problemCode;
  }

  async getProblemCodeByLanguage(
    problemId: number,
    language: string
  ): Promise<ProblemCodeResponse | null> {
    return await prisma.problemCode.findUnique({
      where: {
        problemId_language: {
          problemId,
          language,
        },
      },
    });
  }

  async getAllProblemCodes(problemId: number): Promise<ProblemCodeResponse[]> {
    return await prisma.problemCode.findMany({
      where: { problemId },
      orderBy: { language: 'asc' },
    });
  }

  async updateProblemCode(
    problemId: number,
    language: string,
    data: UpdateProblemCodeDTO
  ): Promise<ProblemCodeResponse> {
    const existing = await prisma.problemCode.findUnique({
      where: {
        problemId_language: {
          problemId,
          language,
        },
      },
    });

    if (!existing) {
      throw new Error('Problem code not found');
    }

    const updateData: any = {};
    if (data.wrapperCode !== undefined) updateData.wrapperCode = data.wrapperCode;
    if (data.boilerplateCode !== undefined) updateData.boilerplateCode = data.boilerplateCode;

    return await prisma.problemCode.update({
      where: {
        problemId_language: {
          problemId,
          language,
        },
      },
      data: updateData,
    });
  }

  async upsertProblemCode(data: CreateProblemCodeDTO): Promise<ProblemCodeResponse> {
    return await prisma.problemCode.upsert({
      where: {
        problemId_language: {
          problemId: data.problemId,
          language: data.language,
        },
      },
      update: {
        wrapperCode: data.wrapperCode,
        boilerplateCode: data.boilerplateCode,
      },
      create: {
        problemId: data.problemId,
        language: data.language,
        wrapperCode: data.wrapperCode,
        boilerplateCode: data.boilerplateCode,
      },
    });
  }

  async deleteProblemCode(problemId: number, language: string): Promise<boolean> {
    try {
      await prisma.problemCode.delete({
        where: {
          problemId_language: {
            problemId,
            language,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new ProblemCodeService();
