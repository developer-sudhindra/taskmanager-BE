import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './changePassword.dto';
import { PasswordService } from '../users/password.service';
import { MenuType } from '../users/menu-type.enum';
import { UpdateThemeDto } from './update-theme.dto';
import { menuList, IMenuItem } from './menu-list';
import { UpdateUserNameDto } from './update-user-name.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly PasswordService: PasswordService,
  ) {}

  public async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!currentUser) {
      throw new NotFoundException();
    }

    const isMatch = await this.PasswordService.verify(
      changePasswordDto.oldPassword,
      currentUser.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Password missmatch');
    }

    const hashedPassword = await this.PasswordService.hash(
      changePasswordDto.newPassword,
    );

    currentUser.password = hashedPassword;

    await this.userRepository.save(currentUser);

    return { message: 'Password updated successfully' };
  }

  public async getTheme(userId: string): Promise<{ theme: string }> {
    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!currentUser) {
      throw new NotFoundException();
    }
    return { theme: currentUser.theme };
  }

  public async updateTheme(
    userId: string,
    updateThemeDto: UpdateThemeDto,
  ): Promise<{ theme: string }> {
    const updateResult = await this.userRepository.update(userId, {
      theme: updateThemeDto.theme,
    });

    if (updateResult.affected === 0) {
      throw new NotFoundException('User profile not found');
    }

    return { theme: updateThemeDto.theme };
  }

  public async getMenu(userId: string): Promise<{ menuItems: IMenuItem[] }> {
    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!currentUser) {
      throw new NotFoundException();
    }

    const menuType = currentUser.menuType as MenuType;

    return { menuItems: menuList[menuType] };
  }

  public async getUserName(userId: string): Promise<{ userName: string }> {
    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!currentUser) {
      throw new NotFoundException();
    }

    return { userName: currentUser.name };
  }

  public async updateUserName(
    userId: string,
    @Body() userNameDto: UpdateUserNameDto,
  ): Promise<{ userName: string }> {
    const updatedResult = await this.userRepository.update(userId, {
      name: userNameDto.userName,
    });

    if (updatedResult.affected === 0) {
      throw new NotFoundException();
    }

    return { userName: userNameDto.userName };
  }
}
