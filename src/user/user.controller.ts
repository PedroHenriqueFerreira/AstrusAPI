import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { Public } from 'src/shared/public/public.decorator';
import { Roles } from 'src/shared/roles/roles.decorator';
import { Role } from 'src/shared/roles/roles.enum';
import { DeleteUserDto } from './dto/delete-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @Public()
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @Post('/login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Put('/update')
  async update(
    @Req() { user }: Express.Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user, updateUserDto);
  }

  @Delete('/delete')
  async delete(
    @Req() { user }: Express.Request,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    return await this.userService.delete(user, deleteUserDto);
  }

  @Get('/all')
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/me')
  async findMe(@Req() { user }: Express.Request) {
    return await this.userService.findMe(user);
  }
}
