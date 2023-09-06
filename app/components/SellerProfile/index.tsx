import * as React from 'react';
import {useState} from "react";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import {InputBase} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Masonry from '@mui/lab/Masonry';
import {useRouter} from "next/navigation";
import {observer} from "mobx-react-lite";

import {authStore} from "@/(EmptyLayout)/auth/store";
import SellerInfo from './components/SellerInfo';
import ProductCreate from "./components/Product/ProductCreate";
import Product from '../Product';
import {useSellerProfile} from "./service";
import {SellerProductsStore} from "./store";
import SortSideBar from "@/components/SellerProfile/components/SortSideBar";
import {GoToSeller} from "@/components/SellerProfile/components/GoToSeller";


type Props = {
  // 0 mean auto select:
  // - anonymous: show first found profile
  // - auth user: show my seller profile
  sellerId: number,
}
export default observer(function SellerProfile(props: Props) {
  const {sellerId} = props;
  const {seller} = useSellerProfile(sellerId)
  const authUserId = authStore.currentAuth?.user.id;
  const sellerProducts = SellerProductsStore.products;
  const isOwner = !!authUserId && (seller?.user_id == authUserId);

  return (
    <div className="SellerProfile">
      {seller && <SellerInfo item={seller} isOwner={isOwner} />}

      {!!seller && !sellerProducts.length && (
        <Typography variant="subtitle1" textAlign="center" sx={{my:5}}>
          Seller has no products
        </Typography>
      )}
      {!seller && (
        <Typography variant="subtitle1" textAlign="center" sx={{my:5}}>
          Seller profile does not exist.
          {!authUserId && " Please login and create a new one."}
        </Typography>
      )}

      {/*<Grid container spacing={4}>*/}
      <Box sx={{mr: 0}}>
      <Masonry columns={{xs: 1, sm: 2, md: 3}} spacing={5} sx={{
        pt: 2,
        width: "auto",
      }}>
        <Products
          products={sellerProducts}
          sellerId={seller?.id ?? -1}
          isLoggedIn={!!authUserId}
          isOwner={isOwner}
        />
      </Masonry>
      </Box>
      {/*</Grid>*/}


      <Box sx={{mt: 5}}>
        <GoToSeller/>
      </Box>

      {isOwner && <SortSideBar/>}
    </div>
  );
})

function Products({products, isOwner, isLoggedIn, sellerId}: {products: any[], isOwner: boolean, isLoggedIn: boolean, sellerId: number}) {
  return <>
    {products.map((p) => (
      <Product
        key={p.id} item={p}
        buyAble={isLoggedIn && !isOwner}
        editable={isOwner}
        sellerId={sellerId}
      />
    ))}

    {isOwner && <ProductCreate sellerId={sellerId} />}
  </>
}
