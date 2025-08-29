import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from './review.entity';

@Entity()
export class Movie {
@PrimaryGeneratedColumn() id: number;
@Column() name: string;
@Column({ nullable: true }) image: string;
@Column() year: number;
@ManyToOne(() => Genre, { eager: true }) @JoinColumn() genre: Genre;
@Column() detail: string;
@Column('text', { array: true, default: '{}' }) cast: string[];
@OneToMany(() => Review, (r: Review) => r.movie, { cascade: true }) reviews: Review[];
@Column({ default: 0 }) numReviews: number;
@Column({ type: 'float', default: 0 }) rating: number;
@ManyToOne(() => User, { nullable: true }) @JoinColumn() createdBy: User;
@CreateDateColumn() createdAt: Date;
@UpdateDateColumn() updatedAt: Date;
}