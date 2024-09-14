import { z } from "zod";


export const addressSchema = z.object({
            addressLine1:z.string(),
            addressLine2:z.string(),
            city:z.string(),
            state:z.string(),
            postalCode:z.string(),
            country:z.string(),
})





