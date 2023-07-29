import { Schema, model } from 'mongoose'
import { AcademicFacultyModel, IAcademicFaculty } from './books.interface'

const academicFacultySchema = new Schema<IAcademicFaculty>(
  {
    title: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
  'AcademicFaculty',
  academicFacultySchema,
)
