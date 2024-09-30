import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/fillters/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/user/user.module';
import { User } from './modules/user/entities/User.entity';
import { Role } from './modules/role/entities/Role.entity';
import { RolesModule } from './modules/role/role.module';
import { PermissionsModule } from './modules/permission/permission.module';
import { Permission } from './modules/permission/entities/Permission.entity';
import { ValidationPipe } from './pipes/validation.pipe';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: '123456',
      database: 'test_db',
      entities: [User,Role,Permission],
      synchronize: true, 
      autoLoadEntities: true,
    }),
    PermissionsModule,
    UsersModule,
    RolesModule,
    AuthModule
  ],
})
export class AppModule  {
}
