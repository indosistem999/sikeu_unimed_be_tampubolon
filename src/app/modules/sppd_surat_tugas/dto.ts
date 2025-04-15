import { IsNotEmpty, IsOptional, IsString, IsDate, IsNumber, IsDateString } from 'class-validator';

export class DTO_ValidationCreate {
    @IsOptional()
    @IsString()
    unit_id?: string;

    @IsOptional()
    @IsString()
    bagian_surat_id?: string;

    @IsOptional()
    @IsString()
    nomor_surat?: string;

    @IsOptional()
    @IsDate()
    tanggal_surat?: Date;

    @IsNotEmpty()
    @IsString()
    kegiatan!: string;

    @IsOptional()
    @IsDate()
    awal_kegiatan?: Date;

    @IsOptional()
    @IsDate()
    akhir_kegiatan?: Date;

    @IsOptional()
    @IsNumber()
    only_one?: number;

    @IsOptional()
    @IsString()
    lokasi_kegiatan?: string;

    @IsOptional()
    @IsString()
    officers_id?: string;

    @IsOptional()
    @IsString()
    file_undangan?: string;
}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsString()
    unit_id?: string;

    @IsOptional()
    @IsString()
    bagian_surat_id?: string;

    @IsOptional()
    @IsString()
    nomor_surat?: string;

    @IsOptional()
    @IsDate()
    tanggal_surat?: Date;

    @IsOptional()
    @IsString()
    kegiatan?: string;

    @IsOptional()
    @IsDate()
    awal_kegiatan?: Date;

    @IsOptional()
    @IsDate()
    akhir_kegiatan?: Date;

    @IsOptional()
    @IsNumber()
    only_one?: number;

    @IsOptional()
    @IsString()
    lokasi_kegiatan?: string;

    @IsOptional()
    @IsString()
    officers_id?: string;

    @IsOptional()
    @IsString()
    file_undangan?: string;
}

export class CreateSppdDto {
    @IsOptional()
    @IsString()
    bagian_surat_id?: string;

    @IsNotEmpty()
    @IsDateString()
    tanggal_sppd!: Date;

    @IsNotEmpty()
    @IsString()
    instansi!: string;

    @IsOptional()
    @IsString()
    akun?: string;

    @IsOptional()
    @IsString()
    lainnya?: string;

    @IsOptional()
    @IsString()
    officers_id?: string;

    @IsOptional()
    @IsString()
    transportation_type_id?: string;

    @IsOptional()
    @IsString()
    lokasi_awal?: string;

    @IsOptional()
    @IsString()
    lokasi_akhir?: string;
}

export class UpdateSppdDto {
    @IsOptional()
    @IsString()
    bagian_surat_id?: string;

    @IsOptional()
    @IsDateString()
    tanggal_sppd?: Date;

    @IsOptional()
    @IsString()
    instansi?: string;

    @IsOptional()
    @IsString()
    akun?: string;

    @IsOptional()
    @IsString()
    lainnya?: string;

    @IsOptional()
    @IsString()
    officers_id?: string;

    @IsOptional()
    @IsString()
    transportation_type_id?: string;

    @IsOptional()
    @IsString()
    lokasi_awal?: string;

    @IsOptional()
    @IsString()
    lokasi_akhir?: string;
} 