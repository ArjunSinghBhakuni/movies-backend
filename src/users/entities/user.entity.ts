import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
@Entity()
export class User {
@PrimaryGeneratedColumn() id: number;
@Column({ unique: true }) username: string;
@Index({ unique: true }) @Column() email: string;
@Column() password: string;
@Column({ default: 'user' }) role: 'user' | 'admin';
@CreateDateColumn() createdAt: Date;
@UpdateDateColumn() updatedAt: Date;
}