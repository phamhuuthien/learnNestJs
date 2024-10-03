import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { query, Response } from 'express';
import { UsersService } from '../services/user.service';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PaginateQuery } from 'nestjs-paginate';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/modules/role/enum/role.enum';
import { Auth } from 'src/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from 'src/helpers/configSaveFile';
import { PaginationInterface } from '../interfaces/pagination.interface';

@ApiTags('User')
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-deleted-user')
  @Auth('Lấy danh sách deleted users', [Role.Admin], { isPublic: false })
  async getAllDeletedUser(): Promise<User[]> {
    return this.usersService.getAllDeletedUser();
  }

  @Get('/paginate')
  @Auth('lấy danh sách user', [Role.Admin], { isPublic: false })
  async getPaginate(@Query() query: PaginateQuery) {
    return this.usersService.getPaginate(query);
  }
  @Get('danh-sach-user')
  getAllUsers(@Query() query: PaginationInterface) {
    return this.usersService.getAllUser(query);
  }

  @Get(':id')
  @Auth('lấy user detail', [Role.User, Role.Admin], { isPublic: false })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getById(id);
  }

  @Get()
  @Auth('lấy danh sách user', [Role.Admin], { isPublic: false })
  async findAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Post()
  @Auth('tạo user ', [Role.User], { isPublic: true })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(203)
  @Auth('cập nhập user', [Role.User], { isPublic: false })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('restore-user/:id')
  @Auth('restore user deleted', [Role.Admin], { isPublic: false })
  async restoreUser(@Param('id') id: number): Promise<string> {
    return this.usersService.restoreUser(id);
  }

  @Delete('soft-delete-user/:id')
  @Auth('xóa mềm', [Role.Admin], { isPublic: false })
  softDeleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usersService.softDeleteUser(id);
  }

  @Delete(':id')
  @Auth('xóa user ', [Role.Admin], { isPublic: false })
  delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.usersService.delete(id);
  }

  @Post('upload-avatar')
  @Auth('upload avatar', [Role.User], { isPublic: false })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png'];
        if (!allowedExtArr.includes(ext)) {
          req.message = 'sai định dạng file';
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['Content-Length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.message = 'kích thước file quá lớn';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadAvatar(
    @Req() req: any,
    @UploadedFile() // new ParseFilePipe({
    //     new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
    file //   validators: [
    //     new FileTypeValidator({ fileType: '/image/(jpg|jpeg|png)$/' }),
    //   ],
    // }),
    : Express.Multer.File,
  ) {
    if (req.message) {
      throw new BadRequestException(req.message);
    }
    if (!file) {
      throw new BadRequestException('file is required');
    }
    this.usersService.updateAvatar(
      req.user.id,
      file.destination + '/' + file.filename,
    );
  }
}
