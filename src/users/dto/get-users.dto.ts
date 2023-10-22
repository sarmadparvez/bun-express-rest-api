import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export class GetUsersDto {
  @IsEnum(SortDirection)
  @IsOptional()
  created?: SortDirection;
  @IsNumber()
  @IsOptional()
  @Min(0)
  skip?: number;
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}
