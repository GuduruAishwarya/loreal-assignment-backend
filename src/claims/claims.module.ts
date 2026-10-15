import { Module } from '@nestjs/common';
import { AiAssessmentService } from './ai-assessment.service';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

@Module({
  controllers: [ClaimsController],
  providers: [ClaimsService, AiAssessmentService],
})
export class ClaimsModule {}
