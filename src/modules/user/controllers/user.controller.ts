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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/auth.decorator';
import { Role } from 'src/modules/role/role.enum';

@ApiBearerAuth()
@ApiTags('User')
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-deleted-user')
  @Auth([Role.Admin], { isPublic: false })
  @ApiResponse({ status: 200, description: 'get list soft delete thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  async getAllDeletedUser(): Promise<User[]> {
    return this.usersService.getAllDeletedUser();
  }

  @Get('/paginate')
  @Auth([Role.Admin], { isPublic: false })
  async getPaginate(@Query() query: PaginateQuery) {
    return this.usersService.getPaginate(query);
  }

  @Get(':id')
  @Auth([Role.User, Role.Admin], { isPublic: false })
  @ApiResponse({ status: 200, description: 'get user thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getById(id);
  }

  @Get()
  @Auth([Role.Admin], { isPublic: false })
  async findAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Post()
  @Auth([Role.User], { isPublic: true })
  @ApiResponse({ status: 201, description: 'create thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(203)
  @Auth([Role.User], { isPublic: false })
  @ApiResponse({ status: 203, description: 'update thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('restore-user/:id')
  @Auth([Role.Admin], { isPublic: false })
  @ApiResponse({ status: 200, description: 'restore user thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  async restoreUser(@Param('id') id: number): Promise<string> {
    return this.usersService.restoreUser(id);
  }

  @Delete('soft-delete-user/:id')
  @Auth([Role.Admin], { isPublic: false })
  @ApiResponse({ status: 200, description: 'thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  softDeleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usersService.softDeleteUser(id);
  }

  @Delete(':id')
  @Auth([Role.Admin], { isPublic: false })
  @ApiResponse({ status: 200, description: 'thành công' })
  @ApiResponse({ status: 404, description: 'thất bại' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.usersService.delete(id);
  }
}
