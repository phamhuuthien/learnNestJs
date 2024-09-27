import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { User } from './entities/User.entity';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { RolesModule } from '../role/role.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]),RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
  }
}