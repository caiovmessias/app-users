import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './shared/user/users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { UploadSchema } from './schemas/upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Upload', schema: UploadSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailgun.org',
        secure: false,
        port: 587,
        auth: {
          user: 'postmaster@sandboxe50bc9e68a1246b9adb063e9c41e469d.mailgun.org',
          pass: '3a234130d410b50098fa6ea448c55b42-81bd92f8-d7b8943d',
        },
        ignoreTLS: true,
      },
      defaults: {
        from: '"',
      },
    }),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
