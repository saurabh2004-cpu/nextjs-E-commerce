import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    [key: string]: any; // other product properties
}

interface orderState {
    items: Product[];
}

const initialState: orderState = {
    items: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
        },
        addItemToOrder: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        removeItemFromOrder: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
    },
});

export const { setOrder, addItemToOrder, removeItemFromOrder } = orderSlice.actions;

export default orderSlice.reducer;
