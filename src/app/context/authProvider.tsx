'use client'
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import store from "../(frontend)/store/store"
import React, { Suspense } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'



const queryClient = new QueryClient()

export default function AuthProvider({
  children,

}: { children: React.ReactNode }) {

  return (
   
    <QueryClientProvider client={queryClient}>
       {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Suspense fallback={<div>Loading...</div>}>    {/* //suspense is for use params in client side */}
        <SessionProvider >
          <Provider store={store}>
            {children}
          </Provider>
        </SessionProvider>
      </Suspense>
    </QueryClientProvider>
  )
}

