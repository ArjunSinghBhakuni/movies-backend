import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private readonly movies: Repository<Movie>,
    @InjectRepository(Genre) private readonly genres: Repository<Genre>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
  ) {}

  async create(dto: any, creatorId: number) {
    const genre = await this.genres.findOne({ where: { id: dto.genreId } });
    if (!genre) throw new NotFoundException('Genre not found');

    const movie = this.movies.create({
      name: dto.name,
      image: dto.image,
      year: dto.year,
      genre,
      detail: dto.detail,
      cast: dto.cast || [],
      createdBy: { id: creatorId } as User,
    });

    return this.movies.save(movie);
  }

  getAll() {
    return this.movies.find();
  }

  async getById(id: number) {
    const movie = await this.movies.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: number, dto: any) {
    const movie = await this.movies.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');

    if (dto.genreId) {
      const g = await this.genres.findOne({ where: { id: dto.genreId } });
      if (!g) throw new NotFoundException('Genre not found');
      movie.genre = g;
    }
    if (dto.name !== undefined) movie.name = dto.name;
    if (dto.image !== undefined) movie.image = dto.image;
    if (dto.year !== undefined) movie.year = dto.year;
    if (dto.detail !== undefined) movie.detail = dto.detail;
    if (dto.cast !== undefined) movie.cast = dto.cast;

    return this.movies.save(movie);
  }

  async remove(id: number) {
    const movie = await this.movies.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');
    await this.movies.delete(id);
    return { message: 'Movie Deleted Successfully' };
  }

  async addReview(
    movieId: number,
    user: { id: number; username: string },
    rating: number,
    comment: string,
  ) {
    const movie = await this.movies.findOne({
      where: { id: movieId },
      relations: ['reviews'],
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const exists = await this.reviews.findOne({
      where: { movie: { id: movieId }, user: { id: user.id } },
    });
    if (exists) throw new BadRequestException('Movie already reviewed');

    const review = this.reviews.create({
      name: user.username || 'User',
      rating,
      comment,
      user: { id: user.id } as User,
      movie: { id: movieId } as Movie,
    });
    await this.reviews.save(review);

    const stats = (await this.reviews
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.movieId = :movieId', { movieId })
      .getRawOne<{ count: string; avg: string }>()) || { count: '0', avg: '0' };

    movie.numReviews = Number(stats.count || 0);
    movie.rating = Number(stats.avg || 0);
    await this.movies.save(movie);

    return { message: 'Review Added' };
  }

  getNew(limit = 10) {
    return this.movies.find({
      order: { createdAt: 'DESC' as FindOptionsOrder<Movie>['createdAt'] },
      take: limit,
    });
  }

  async getTop(limit = 10) {
    return this.movies
      .createQueryBuilder('m')
      .orderBy('m.numReviews', 'DESC')
      .take(limit)
      .getMany();
  }

  async getRandom(limit = 10) {
    // Using raw SQL for random fetch
    return this.movies.query(
      `SELECT * FROM "movie" ORDER BY RANDOM() LIMIT $1`,
      [limit],
    );
  }

  async deleteComment(movieId: number, reviewId: number) {
    const review = await this.reviews.findOne({
      where: { id: reviewId, movie: { id: movieId } },
    });
    if (!review) throw new NotFoundException('Comment not found');

    await this.reviews.delete(review.id);

    const stats = (await this.reviews
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.movieId = :movieId', { movieId })
      .getRawOne<{ count: string; avg: string }>()) || { count: '0', avg: '0' };

    await this.movies.update(movieId, {
      numReviews: Number(stats.count || 0),
      rating: Number(stats.avg || 0),
    });

    return { message: 'Comment Deleted Successfully' };
  }
}
