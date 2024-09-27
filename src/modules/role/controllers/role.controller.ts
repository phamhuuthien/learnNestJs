import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from '../services/role.service';
import { Role } from '../entities/Role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService){}

  @Get(":id")
  getOne(@Param("id",ParseIntPipe) id:number):Promise<Role>{
    return this.rolesService.getById(id)
  }
  @Get()
  async findAll(): Promise<Role[]>{
    return this.rolesService.getAll();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createRoleDto: CreateRoleDto):Promise<Role> {
    return this.rolesService.create(createRoleDto)
  }

  @Put(":id")
  @HttpCode(203)
  async update(@Param("id",ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto):Promise<Role> {
    return this.rolesService.update(id,updateRoleDto)
  }
  
  @Delete(":id")
  delete(@Param("id",ParseIntPipe) id:number){
    return this.rolesService.delete(id)
  }
}