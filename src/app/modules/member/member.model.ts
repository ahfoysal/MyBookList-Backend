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
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Books',
      },
    ],
    currentlyReading: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Books',
      },
    ],
    finishedReading: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Books',
      },
    ],
    planToRead: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Books',
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
