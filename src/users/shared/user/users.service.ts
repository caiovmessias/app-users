import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        'Name and Email are required',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const userCadastred: User = await this.userModel
      .findOne({ email: user.email })
      .exec();

    if (userCadastred) {
      throw new HttpException('Mail already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(user);
    await createdUser.save();

    try {
      await sendToRabbit('New user created in App');
    } catch (e) {
      console.error(
        'Error on sending message for Rabbit, probably the container is not up',
      );
    }

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
      console.log('error: ', e);
    } finally {
      return createdUser;
    }
  }

  async getById(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`https://reqres.in/api/users/${id}`),
    ).catch(() => {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    });

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
    ).catch(() => {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    });

    const avatar = await firstValueFrom(
      this.httpService.get(`${data.data.avatar}`, {
        responseType: 'arraybuffer',
      }),
    ).catch(() => {
      throw new HttpException(
        'Image not found in API for this user',
        HttpStatus.NOT_FOUND,
      );
    });

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
      throw new HttpException(
        'Image or User not cadastred',
        HttpStatus.BAD_REQUEST,
      );
    }

    await deleteFile(img.imgHash);

    return await this.uploadModel.deleteOne({ userId: id }).exec();
  }
}
