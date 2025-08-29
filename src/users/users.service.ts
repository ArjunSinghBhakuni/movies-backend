import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

async create(username: string, email: string, password: string) {
const exists = await this.repo.findOne({ where: { email } });
if (exists) throw new BadRequestException('User already exists');
const hash = await bcrypt.hash(password, 10);
const user = this.repo.create({ username, email, password: hash, role: 'user' });
return this.repo.save(user);
}

async findAll() {
return this.repo.find();
}

async findByEmail(email: string) {
return this.repo.findOne({ where: { email } });
}

async findById(id: number) {
const user = await this.repo.findOne({ where: { id } });
if (!user) throw new NotFoundException('User not found');
return user;
}

async updateProfile(id: number, dto: { username?: string; password?: string }) {
const user = await this.findById(id);
if (dto.username) user.username = dto.username;
if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
return this.repo.save(user);
}
}