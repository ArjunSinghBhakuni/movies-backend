import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { MoviesModule } from './movies/movies.module';
import { UploadsModule } from './uploads/uploads.module';


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRootAsync({
useFactory: () => ({
type: 'postgres',
host: process.env.DATABASE_HOST,
port: Number(process.env.DATABASE_PORT || 5432),
username: process.env.DATABASE_USER,
password: process.env.DATABASE_PASSWORD,
database: process.env.DATABASE_NAME,
ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
autoLoadEntities: true,
synchronize: true, // set false and use migrations for production
}),
}),
UsersModule,
AuthModule,
GenresModule,
MoviesModule,
UploadsModule,
],
})
export class AppModule {}

