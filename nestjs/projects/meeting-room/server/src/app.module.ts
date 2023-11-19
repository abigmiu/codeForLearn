import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'nest_meeting_room',
            synchronize: true,
            logging: true,
            entities: [User, Role, Permission],
        }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
