import {useCallback, useEffect, useMemo, useState} from "react";
import {throttle} from 'throttle-debounce'

import {Product, Seller} from "@/services/AppDb";
import {SellerDAO, SellerDataSource} from "./dao";
import {isClientDevMode, isDevMode} from "@/utils/env";
import {authStore} from "@/(EmptyLayout)/auth/store";
import {hasChanged} from "@/utils/changed";
import {SellerProductsStore} from "./store";


const sellerDao = new SellerDAO(SellerDataSource.Local);
if (isClientDevMode) {
  //@ts-ignore
  window.tmp__sellerDao = sellerDao;
}

export function useSellerProfile(seller_id: number) {
  const [seller, setSeller] = useState<Seller | undefined>(undefined)

  const tryCreateAndFetchSeller = useCallback(() => {
    const onDone = (seller: Seller | undefined) => {
      // console.log('{getSeller} seller_id, seller: ', seller_id, seller);
      setSeller(seller)
      SellerProductsStore.setProducts(seller?.products ?? [])
    };

    if (seller_id <= 0) {
      getFirstOrCreateSeller(authStore.userId).then(onDone)
    } else {
      sellerDao.getSeller(seller_id).then(onDone)
    }
  }, [seller_id])

  const tryCreateAndFetchSellerThrottled = useMemo(() => {
    return throttle(300, () => {
      tryCreateAndFetchSeller()
    })
  }, [tryCreateAndFetchSeller])

  // fetch seller by id
  // NOTE: this effect run twice on dev mode
  // https://react.dev/blog/2022/03/29/react-v18#new-strict-mode-behaviors
  useEffect(() => {
    // if (isDevMode && !hasChanged('useSellerProfile_useEffect', [seller_id])) {
    //   console.log('{useEffect} SKIP effect: seller_id: ', seller_id);
    //   return;
    // }

    tryCreateAndFetchSellerThrottled()
  }, [tryCreateAndFetchSellerThrottled, seller_id])

  return {
    seller
  }
}

async function getFirstOrCreateSeller(authUserId: number | undefined): Promise<Seller | undefined> {
  let criteria = authUserId ? {user_id: authUserId} : {}
  return sellerDao.findFirst(criteria).then(async seller => {
    // create new profile for current auth user
    if (authUserId && !seller) {
      const sellerObj = {
        user_id: authUserId,
        name: `User ${authUserId}'s shop`,
        description: `Please change this`,
        phone: "+.....",
        cover_image: 'https://source.unsplash.com/random/320x180/?shop',
        products: [],
      }
      seller = await sellerDao.createSeller(sellerObj)
    }

    return seller
  })
}

export async function updateSeller(id: number, data: Partial<Seller>) {
  return sellerDao.updateSeller(id, data)
}

export async function addSellerProduct(id: number, product: Product): Promise<Product | undefined> {
  return sellerDao.addSellerProduct(id, product)
}

export async function removeSellerProduct(id: number, productId: string): Promise<boolean> {
  return sellerDao.removeSellerProduct(id, productId)
}

// send product list in correct order to dao,
// then dao would update the order base on this list
export async function reOrderSellerProduct(id: number, products: Product[]): Promise<boolean> {
  return sellerDao.reOrderSellerProduct(id, products)
}
