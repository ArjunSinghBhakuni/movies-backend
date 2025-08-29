import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
constructor(@InjectRepository(Genre) private readonly repo: Repository<Genre>) {}

async create(name: string) {
const exists = await this.repo.findOne({ where: { name } });
if (exists) throw new BadRequestException('Already exists');
return this.repo.save(this.repo.create({ name }));
}
async update(id: number, name: string) {
const g = await this.repo.findOne({ where: { id } });
if (!g) throw new NotFoundException('Genre not found');
g.name = name;
return this.repo.save(g);
}
async remove(id: number) {
const g = await this.repo.findOne({ where: { id } });
if (!g) throw new NotFoundException('Genre not found');
await this.repo.delete(id);
return g;
}
list() { return this.repo.find(); }
read(id: number) { return this.repo.findOne({ where: { id } }); }
}