import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Review {
@PrimaryGeneratedColumn() id: number;
@Column() name: string;
@Column('int') rating: number;
@Column('text') comment: string;
@ManyToOne(() => User, { eager: true }) @JoinColumn() user: User;
@ManyToOne(() => Movie, movie => movie.reviews, { onDelete: 'CASCADE' }) @JoinColumn() movie: Movie;
@CreateDateColumn() createdAt: Date;
@UpdateDateColumn() updatedAt: Date;
}