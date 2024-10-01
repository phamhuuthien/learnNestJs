import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PermissionsService } from '../services/permission.service';
import { Permission } from '../entities/Permission.entity';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller()
export class PermissionsController {
  constructor(private permissionService: PermissionsService) {}

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
    return this.permissionService.getById(id);
  }
  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.getAll();
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  @HttpCode(203)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id);
  }
}
