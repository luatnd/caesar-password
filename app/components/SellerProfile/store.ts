import {Product} from "@/services/AppDb";
import {makeAutoObservable} from "mobx";
import {isClientDevMode} from "@/utils/env";
import {logOutTaskManager} from "@/(EmptyLayout)/auth/service";

class SellerProducts {
  public products: Product[] = []

  constructor() {
    makeAutoObservable(this)
    // this.registerCleanUpOnLogout()
  }

  setProducts(p: Product[]) {
    this.products = p
  }

  addProduct(p: Product) {
    this.products.push(p)
  }

  rmProduct(productId: string) {
    this.products = this.products.filter(i => i.id != productId)
  }

  // // register task to clean up on logout
  // registerCleanUpOnLogout() {
  //   logOutTaskManager.register('cleanSellerProduct', () => this.setProducts([]))
  // }
}

export const SellerProductsStore = new SellerProducts();

if (isClientDevMode) {
  //@ts-ignore
  window.tmp__SellerProductsStore = SellerProductsStore;
}
