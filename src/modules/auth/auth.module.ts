import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/User.entity';
import { RolesModule } from '../role/role.module';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role.guard';
import { Auth } from './auth.decorator';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    RolesModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
