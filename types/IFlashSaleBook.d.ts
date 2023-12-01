import { IBook } from "./IBook"

interface IFlashSaleBook {
    id: number
    flash_sale_hour_id: number
    product_id: number
    percent_discount: number
    created_at: string
    updated_at: string
    product_info: IBook
}