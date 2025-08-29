import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Review } from './entities/review.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Genre } from '../genres/entities/genre.entity';
import { User } from '../users/entities/user.entity';

@Module({
imports: [TypeOrmModule.forFeature([Movie, Review, Genre, User])],
controllers: [MoviesController],
providers: [MoviesService],
})
export class MoviesModule {}