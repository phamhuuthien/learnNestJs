import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './controllers/permission.controller';
import { PermissionsService } from './services/permission.service';
import { Permission } from './entities/Permission.entity';
import { RolesModule } from '../role/role.module';
import { RolesService } from '../role/services/role.service';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([Permission]),
    forwardRef(() => RolesModule)
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(PermissionsController);
  }
}