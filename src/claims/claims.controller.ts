import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { AssessClaimDto } from './dto/assess-claim.dto';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) { }

  @Get()
  async getAllClaims() {
    return this.claimsService.getClaims();
  }

  @Post('assess')
  async assessClaim(@Body() dto: AssessClaimDto) {
    return this.claimsService.assessClaim(dto);
  }
}
