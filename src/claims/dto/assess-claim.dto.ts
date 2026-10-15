import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssessClaimDto {
  @IsOptional()
  @IsString()
  claimId?: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  claimText: string;

  @IsString()
  @IsNotEmpty()
  evidenceText: string;

  @IsOptional()
  @IsString()
  studyType?: string;
}
