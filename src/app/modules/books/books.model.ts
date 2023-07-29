import { Schema, model } from 'mongoose'
import { BookModel, IBook } from './books.interface'

const bookSchema = new Schema<IBook>(
  {
    id: { type: String, required: true, unique: true },
    reference: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    reviews: { type: [], default: [] },
    author: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: 'Author' },
    edition: { type: String },
    genre: { type: [String], required: true },
    related: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    releaseDate: { type: Date },
    ratingsCount: { type: Number },
    reviewersCount: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const Book = model<IBook, BookModel>('Book', bookSchema)
