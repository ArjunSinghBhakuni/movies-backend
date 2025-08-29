import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
constructor(private readonly jwtService: JwtService) {}
sign(user: { id: number; email: string; role: string }) {
return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
}
}