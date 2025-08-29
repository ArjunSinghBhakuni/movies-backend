import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
constructor(private users: UsersService, private auth: AuthService) {}

@Post()
@ApiOperation({ summary: 'Register a new user' })
async createUser(@Body() dto: CreateUserDto) {
const u = await this.users.create(dto.username, dto.email, dto.password);
const token = this.auth.sign({ id: u.id, email: u.email, role: u.role });
return { id: u.id, username: u.username, email: u.email, role: u.role, token };
}

@Get()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get all users (Admin only)' })
async getAllUsers(@Req() req: any) {
if (req.user?.role !== 'admin') return { message: 'Admins only' };
return this.users.findAll();
}

@Post('auth')
@ApiOperation({ summary: 'Login user' })
async loginUser(@Body() dto: LoginDto) {
const user = await this.users.findByEmail(dto.email);
if (!user) return { message: 'User not found' };
const ok = await bcrypt.compare(dto.password, user.password);
if (!ok) return { message: 'Invalid password' };
const token = this.auth.sign({ id: user.id, email: user.email, role: user.role });
return { id: user.id, username: user.username, email: user.email, role: user.role, token };
}

@Post('logout')
@ApiOperation({ summary: 'Logout user' })
async logoutUser() {
return { message: 'Logged out successfully' };
}

@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get current user profile' })
async getProfile(@Req() req: any) {
const user = await this.users.findById(req.user.id);
return { id: user.id, username: user.username, email: user.email, role: user.role };
}

@Put('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update current user profile' })
async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
const user = await this.users.updateProfile(req.user.id, dto);
return { id: user.id, username: user.username, email: user.email, role: user.role };
}
}