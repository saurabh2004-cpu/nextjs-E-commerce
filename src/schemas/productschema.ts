import { z } from "zod";


export const productSchema = z.object({
    imageUrl:z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    category: z.string(),
    stock: z.number(),
    keywords: z.string()
   
})





