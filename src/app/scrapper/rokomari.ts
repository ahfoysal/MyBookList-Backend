import axios, { AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'
import config from '../../config'

type Product = {
  id: string
  name: string
  img: string
}

type ApiResponse = Product[]

const SearchBooks = async (
  term?: string,
  authorIds?: string[],
): Promise<ApiResponse> => {
  const params = new URLSearchParams()
  params.append('search_type', 'BOOK') // Always include 'search_type=BOOK'
  if (term) params.append('term', term)
  if (authorIds) params.append('authorIds', authorIds.join(','))

  const response: AxiosResponse<string> = await axios.get(
    config.search_url as string,
    {
      params,
    },
  )

  try {
    const $ = cheerio.load(response.data)
    const productList: Product[] = []

    // Process ".product-item" section
    $('.product-item').each((i, elem) => {
      const id =
        $(elem)
          .find('.cart-btn-area .btn.js--add-to-cart')
          .attr('product-id') || ''
      const name = $(elem).find('.product-title').text()
      const img = $(elem).find('.product-img img').attr('src') || ''
      productList.push({ id, name, img })
    })

    // Process ".book-list-wrapper" section
    $('.book-list-wrapper').each((i, elem) => {
      const id =
        $(elem)
          .find('.cart-btn-area .btn.js--add-to-cart')
          .attr('product-id') || ''
      const name = $(elem).find('.book-title').text()
      const img = $(elem).find('.book-img img').attr('data-src') || ''

      // Check if the product with the same id exists in the productList
      const existingProduct = productList.find(product => product.id === id)

      // If the product with the same id exists, update its name and img
      if (existingProduct) {
        existingProduct.name = name
        existingProduct.img = img
      } else {
        // If the product with the same id does not exist, add it to the list
        productList.push({ id, name, img })
      }
    })

    return productList
  } catch (error) {
    // Handle error appropriately
    console.error('Error fetching products:', error)
    throw error
  }
}

export const rokomari = { SearchBooks }
