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
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services/user.service';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PaginateQuery } from 'nestjs-paginate';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-deleted-user')
  async getAllDeletedUser(): Promise<User[]> {
    return this.usersService.getAllDeletedUser();
  }

  @Get('/paginate')
  async getPaginate(@Query() query: PaginateQuery) {
    return this.usersService.getPaginate(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getById(id);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(203)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('restore-user/:id')
  async restoreUser(@Param('id') id: number): Promise<string> {
    return this.usersService.restoreUser(id);
  }

  @Delete('soft-delete-user/:id')
  softDeleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usersService.softDeleteUser(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.usersService.delete(id);
  }
}
