import { IsNumber, Min } from 'class-validator';

export class UpdateQuoteDto {
  @IsNumber()
  @Min(0)
  readonly value: number;
}
