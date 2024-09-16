'use client'
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import store from "../(frontend)/store/store"
import React, { Suspense } from 'react';

export default function AuthProvider({
  children,

}: { children: React.ReactNode }) {
  return (

    //suspense for use params in client side
    <Suspense fallback={<div>Loading...</div>}>  
      <SessionProvider >
        <Provider store={store}>
          {children}
        </Provider>
      </SessionProvider>
    </Suspense>
  )
}

