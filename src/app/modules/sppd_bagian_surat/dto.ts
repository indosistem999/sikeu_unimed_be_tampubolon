import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DTO_ValidationCreate {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description!: string;
}

export class DTO_ValidationUpdate {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description!: string;
} 