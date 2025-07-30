import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    photo: {
  type: String,
  default: '',
},

    name: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'home'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }

);

export const Contact = model('Contact', contactSchema);
