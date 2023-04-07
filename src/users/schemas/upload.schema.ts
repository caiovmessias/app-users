import * as mongoose from 'mongoose';

export const UploadSchema = new mongoose.Schema({
  userId: String,
  imgHash: String,
});
