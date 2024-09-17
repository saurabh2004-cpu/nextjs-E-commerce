
'use client'
import ProductByCategory from "@/components/comps/ProductByCategory";
import MyCarousel from "@/components/comps/myCarousel";
import Footer from "@/components/footer/Footer";
import Categories from "@/components/comps/Categories";
import Navbar from "@/components/navbar/Navbar";
import GetAllProducts from "@/components/comps/GetAllProducts";
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from "react";


export default function Home() {

 
  return (
    <>

      <Navbar />
      <Categories />
      <MyCarousel />
      <ProductByCategory category={'mobiles and tablets'} heading={'Best of smartphones'} />
      <ProductByCategory category={'tv and appliances'} heading={'Best of TV'} />
      <GetAllProducts />
      <Footer />
      
    </>
  );
}
