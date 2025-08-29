import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ReviewDto } from './dto/review.dto';

@ApiTags('Movies')
@Controller('api/v1/movies')
export class MoviesController {
constructor(private readonly service: MoviesService) {}

// Public
@Get('all-movies')
@ApiOperation({ summary: 'Get all movies' })
getAllMovies() { return this.service.getAll(); }

@Get('specific-movie/:id')
@ApiOperation({ summary: 'Get a specific movie' })
getSpecificMovie(@Param('id') id: string) { return this.service.getById(Number(id)); }

@Get('new-movies')
@ApiOperation({ summary: 'Get latest movies' })
getNewMovies() { return this.service.getNew(10); }

@Get('top-movies')
@ApiOperation({ summary: 'Get top movies by number of reviews' })
getTopMovies() { return this.service.getTop(10); }

@Get('random-movies')
@ApiOperation({ summary: 'Get random movies' })
getRandomMovies() { return this.service.getRandom(10); }

// Restricted
@Post(':id/reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Add a review to a movie' })
addReview(@Param('id') id: string, @Req() req: any, @Body() dto: ReviewDto) {
return this.service.addReview(Number(id), req.user, dto.rating, dto.comment);
}

// Admin
@Post('create-movie')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create movie (admin)' })
createMovie(@Body() dto: CreateMovieDto, @Req() req: any) {
return this.service.create(dto, req.user.id);
}

@Put('update-movie/:id')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update movie (admin)' })
updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
return this.service.update(Number(id), dto);
}

@Delete('delete-movie/:id')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete movie (admin)' })
deleteMovie(@Param('id') id: string) {
return this.service.remove(Number(id));
}

@Delete('delete-comment')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete a comment (admin)' })
deleteComment(@Body() body: { movieId: number; reviewId: number }) {
return this.service.deleteComment(Number(body.movieId), Number(body.reviewId));
}
}