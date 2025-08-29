import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
@Entity()
export class Genre {
@PrimaryGeneratedColumn() id: number;
@Index({ unique: true }) @Column() name: string;
@CreateDateColumn() createdAt: Date;
@UpdateDateColumn() updatedAt: Date;
}