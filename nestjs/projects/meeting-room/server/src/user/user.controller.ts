import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Inject,
    ParseIntPipe,
    BadRequestException,
    DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/util';

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

    @Get('info')
    @RequireLogin()
    async info(@UserInfo('userId') userId: number) {
        return this.userService.findUserDetailById(userId);
    }

    @Post(['update_password', 'admin/update_password'])
    @RequireLogin()
    async updatePassword(
        @UserInfo('userId') userId: number,
        @Body() passwordDto: UpdateUserPasswordDto,
    ) {
        return this.userService.updatePassword(userId, passwordDto);
    }

    @Get('update_password/captcha')
    async updatePasswordCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_password_captcha_${address}`,
            code,
            10 * 60,
        );

        await this.emailService.sendMail({
            to: address,
            subject: '更改密码验证码',
            html: `<p>你的更改密码验证码是 ${code}</p>`,
        });
        return '发送成功';
    }

    @Post(['update', 'admin/update'])
    @RequireLogin()
    async update(
        @UserInfo('userId') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.update(userId, updateUserDto);
    }

    @Get('update/captcha')
    async updateCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_user_captcha_${address}`,
            code,
            10 * 60,
        );

        await this.emailService.sendMail({
            to: address,
            subject: '更改用户信息验证码',
            html: `<p>你的验证码是 ${code}</p>`,
        });
        return '发送成功';
    }

    @Get('freeze')
    async freeze(@Query('id') userId: number) {
        await this.userService.freezeUserById(userId);
        return 'success';
    }

    @Get('list')
    async list(
        @Query(
            'pageNo',
            new DefaultValuePipe(1),
            generateParseIntPipe('pageNo'),
        )
        pageNo: number,
        @Query(
            'pageSize',
            new DefaultValuePipe(2),
            generateParseIntPipe('pageSize'),
        )
        pageSize: number,
        @Query('username') username: string,
        @Query('nickName') nickName: string,
        @Query('email') email: string,
    ) {
        return await this.userService.findUsers(
            username,
            nickName,
            email,
            pageNo,
            pageSize,
        );
    }
}
