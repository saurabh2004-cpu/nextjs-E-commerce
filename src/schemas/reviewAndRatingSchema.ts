import { comment } from "postcss";
import { z } from "zod";


export const reviewSchema = z.object({
    rating:z.number(),
    comment:z.string()
   
})





