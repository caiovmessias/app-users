import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './shared/user/users.service';
import { User } from './shared/user/user';

@Controller('api')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('users')
  async create(@Body() user: User): Promise<User | object> {
    return this.userService.create(user);
  }

  @Get('user/:id')
  async getById(@Param('id') id: string): Promise<any> {
    return this.userService.getById(id);
  }

  @Get('user/:id/avatar')
  async getImageById(@Param('id') id: string): Promise<any> {
    return this.userService.getImageById(id);
  }

  @Delete('user/:id/avatar')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
