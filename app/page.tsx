'use client'
import * as React from "react";
import ContainerLayout from "@/(HeaderFooterLayout)/layout";
import SellerPage from "@/(HeaderFooterLayout)/seller/[id]/page";
// import HomePage from "@/(HeaderFooterLayout)/home/page";

export default function App() {
  return (
    <ContainerLayout>
      <SellerPage />
    </ContainerLayout>
  )
}
