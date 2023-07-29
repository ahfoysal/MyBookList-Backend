import { Schema, model } from 'mongoose'
import { IMember, MemberModel } from './member.interface'

export const memberSchema = new Schema<IMember, MemberModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    myBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    bookmark: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    currentlyReading: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    finishedReading: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    planToRead: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

export const Member = model<IMember, MemberModel>('Member', memberSchema)
