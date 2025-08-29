import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Genres')
@Controller('api/v1/genre')
export class GenresController {
constructor(private readonly service: GenresService) {}

@Post()
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create genre (admin)' })
createGenre(@Body() dto: CreateGenreDto) { return this.service.create(dto.name); }

@Put(':id')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update genre (admin)' })
updateGenre(@Param('id') id: string, @Body() dto: CreateGenreDto) {
return this.service.update(Number(id), dto.name);
}

@Delete(':id')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Remove genre (admin)' })
removeGenre(@Param('id') id: string) { return this.service.remove(Number(id)); }

@Get('genres')
@ApiOperation({ summary: 'List genres' })
listGenres() { return this.service.list(); }

@Get(':id')
@ApiOperation({ summary: 'Read genre' })
readGenre(@Param('id') id: string) { return this.service.read(Number(id)); }
}