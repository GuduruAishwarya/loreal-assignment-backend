import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiAssessmentService } from './ai-assessment.service';
import { AssessClaimDto } from './dto/assess-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAssessmentService: AiAssessmentService,
  ) {}

  async getClaims() {
    return this.prisma.claim.findMany({
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assessClaim(dto: AssessClaimDto) {
    const productName = dto.productName?.trim();
    const claimText = dto.claimText?.trim();
    const evidenceText = dto.evidenceText?.trim();

    if (!productName || !claimText || !evidenceText) {
      throw new BadRequestException('productName, claimText and evidenceText are required');
    }

    let claimRecord: { id: string } | null = null;

    if (dto.claimId) {
      claimRecord = await this.prisma.claim.findUnique({ where: { id: dto.claimId } });
      if (!claimRecord) {
        throw new NotFoundException(`Claim with id ${dto.claimId} not found`);
      }
    }

    if (!claimRecord) {
      claimRecord = await this.prisma.claim.create({
        data: {
          productName,
          claimText,
          status: 'SUBMITTED',
        },
      });
    }

    const claimId = claimRecord!.id;

    const assessmentResult = await this.aiAssessmentService.assessEvidence(
      productName,
      claimText,
      evidenceText,
      dto.studyType,
    );

    const assessment = await this.prisma.assessment.create({
      data: {
        claimId,
        justified: assessmentResult.justified,
        confidenceScore: assessmentResult.confidenceScore,
        reasoning: assessmentResult.reasoning,
        rawResponse: assessmentResult.rawResponse,
      },
    });

    return {
      assessmentId: assessment.id,
      claimId,
      justified: assessment.justified,
      confidenceScore: assessment.confidenceScore,
      reasoning: assessment.reasoning,
      createdAt: assessment.createdAt,
    };
  }
}
