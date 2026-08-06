import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../users/auth.guard';
import { ProfileService } from './profile.service';
import { CurrentUserId } from '../users/decorators/current-user-id.decorator';
import { ChangePasswordDto } from './changePassword.dto';
import { UpdateThemeDto } from './update-theme.dto';
import { UpdateUserNameDto } from './update-user-name.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch('change-password')
  public async changePassword(
    @CurrentUserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.profileService.changePassword(userId, changePasswordDto);
  }

  @Get('theme')
  public async getTheme(@CurrentUserId() userId: string) {
    return await this.profileService.getTheme(userId);
  }

  @Patch('theme')
  public async updateTheme(
    @CurrentUserId() userId: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    return await this.profileService.updateTheme(userId, updateThemeDto);
  }

  @Get('menu')
  public async getMenu(@CurrentUserId() userId: string) {
    return await this.profileService.getMenu(userId);
  }

  @Get('user-name')
  public async getUserName(
    @CurrentUserId() userId: string,
  ): Promise<{ userName: string }> {
    return await this.profileService.getUserName(userId);
  }

  @Post('user-name')
  public async updateUserName(
    @CurrentUserId() userId: string,
    @Body() udateUserNameDto: UpdateUserNameDto,
  ) {
    return await this.profileService.updateUserName(userId, udateUserNameDto);
  }
}
