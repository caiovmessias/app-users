import { Injectable } from '@nestjs/common';
import { User } from './user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendToRabbit } from 'src/helpers/sendToRabbit';
import { sendMail } from 'src/helpers/sendMail';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Upload } from './upload';
import { firstValueFrom } from 'rxjs';
import { createFile, deleteFile, getFile } from 'src/helpers/storage';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Upload') private readonly uploadModel: Model<Upload>,
    private mailerService: MailerService,
    private httpService: HttpService,
  ) {}

  async create(user: User) {
    if (!user.email || !user.name) {
      return {
        message: 'Name and Email are required',
      };
    }

    const createdUser = new this.userModel(user);
    await createdUser.save();

    await sendToRabbit('New user created in App');

    const mailParams = {
      email: user.email,
      subject: 'User Createad',
      mensagem: 'Welcome to the App',
    };

    try {
      await sendMail(
        this.mailerService,
        mailParams.email,
        mailParams.subject,
        mailParams.mensagem,
      );
    } catch (e) {
      console.log(
        'Error on sending mail, probably your mail addres is not cadastred in Mailgun',
      );
    } finally {
      return createdUser;
    }
  }

  async getById(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`https://reqres.in/api/users/${id}`),
    );
    return response.data;
  }

  async getImageById(id: string) {
    const img: Upload = await this.uploadModel.findOne({ userId: id }).exec();

    if (img) {
      const file = await getFile(img.imgHash);
      return {
        path: img.imgHash,
        imgBase64: file,
      };
    }

    const { data } = await firstValueFrom(
      this.httpService.get(`https://reqres.in/api/users/${id}`),
    );

    const avatar = await firstValueFrom(
      this.httpService.get(`${data.data.avatar}`, {
        responseType: 'arraybuffer',
      }),
    );

    const imageBuffer = Buffer.from(avatar.data, 'binary');
    const imgHash = Date.now() + path.extname(data.data.avatar);
    const filePath = `./uploads`;

    await createFile(filePath, imgHash, imageBuffer);

    const uploadData = {
      imgHash: `${filePath}/${imgHash}`,
      userId: id,
    };

    const createdUpload = new this.uploadModel(uploadData);
    await createdUpload.save();

    return {
      path: `${filePath}/${imgHash}`,
      imgBase64: imageBuffer.toString('base64'),
    };
  }

  async delete(id: string) {
    const img: Upload = await this.uploadModel.findOne({ userId: id }).exec();

    if (!img) {
      return true;
    }

    await deleteFile(img.imgHash);

    return await this.uploadModel.deleteOne({ userId: id }).exec();
  }
}
