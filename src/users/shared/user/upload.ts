import { Document } from 'mongoose';

export class Upload extends Document {
  userId: string;
  imgHash: string;
}
