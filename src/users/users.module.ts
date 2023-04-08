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
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        auth: {
          user: '0c70fe3a6bab9e',
          pass: '2f918f081a3fa1',
        },
      },
    }),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
