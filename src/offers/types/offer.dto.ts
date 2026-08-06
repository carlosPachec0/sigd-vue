export interface OfferDto {
  id: number
  academy_id: number
  title: string
  description: string
  price: number
  created_at: string
  updated_at: string
}

export interface CreateOfferDto {
  academy_id: number
  title: string
  description: string
  price: number
}

export interface UpdateOfferDto {
  title?: string
  description?: string
  price?: number
}
