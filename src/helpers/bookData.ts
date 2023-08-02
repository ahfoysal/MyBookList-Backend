import { IBook } from '../app/modules/books/books.interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractData = (data: any[], id: string) => {
  //
  const matchedObject = data.find(
    (item: { id: number }) => item.id === Number(id),
  )

  const extractedBook: IBook = {
    id: matchedObject.id.toString(),
    reference: matchedObject.reference,
    title: matchedObject.label,
    titleEnglish: matchedObject.nameEnglish,
    description: matchedObject.description,
    image: matchedObject.avatar,
    reviews: matchedObject.reviews,
    author: matchedObject.authorOrBrand,
    authorId: matchedObject.authorId
      ? matchedObject.authorId[0].toString()
      : undefined,
    edition: matchedObject.edition,
    genre: matchedObject.categories,
    related: matchedObject.related,
    releaseDate: matchedObject.releaseDate
      ? new Date(matchedObject.releaseDate)
      : undefined,
    ratingsCount: matchedObject.numberOfRating,
    reviewersCount: matchedObject.numberOfReview,
  }
  return extractedBook
}
export const bookHelper = { extractData }
