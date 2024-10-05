import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER, APP_PIPE, RouterModule, Routes } from '@nestjs/core';
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
import { dataSourceOptions } from 'db/data-source';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/users', module: UsersModule },
      { path: '/permissions', module: PermissionsModule },
      { path: '/roles', module: RolesModule },
    ],
  },
];
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
    RouterModule.register(routes),
    TypeOrmModule.forRoot(dataSourceOptions),
    PermissionsModule,
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
