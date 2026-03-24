import { ArticleWithSlug } from './articles'

export type ContentItem = ArticleWithSlug & {
  _type?: 'post'
} 
