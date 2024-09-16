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


// schemas/uypdateproductschema.ts

export const updateProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be positive'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    stock: z.string().optional(),  // or z.number().int().nonnegative() if you want to validate stock as a number
    keywords: z.string().optional(),
    imageUrl: z.string().optional(),
});



