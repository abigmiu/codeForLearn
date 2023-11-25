import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
    @Inject(EmailService)
    private emailService: EmailService;

    @Inject(RedisService)
    private redisService: RedisService;

    constructor(private readonly userService: UserService) {}

    @Post('register')
    register(@Body() registerUser: RegisterUserDto) {
        console.log(registerUser);
        return this.userService.register(registerUser);
    }

    @Get('register-captcha')
    async captcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(`captcha_${address}`, code);

        await this.emailService.sendMail({
            to: address,
            subject: '注册验证码',
            html: code,
        });

        return '发送成功';
    }

    @Get('init-data')
    async initData() {
        await this.userService.initData();
        return 'done';
    }

    @Post('login')
    async userLogin(@Body() loginUser: LoginUserDto) {
        return this.userService.login(loginUser, false);
    }

    @Post('admin/login')
    async adminLogin(@Body() loginUser: LoginUserDto) {
        return this.userService.login(loginUser, true);
    }

    @Get('refresh')
    refresh(@Query('refreshToken') refreshToken: string) {
        return this.userService.refresh(refreshToken);
    }
}
