// DAO layer (data fetching layer): fetch data from REST, socket, localstorage, ...

import AppDb, {Seller, Product} from "@/services/AppDb";

export enum SellerDataSource {
  Local = 'Local',
  GraphQL = 'GraphQL',
}

export class SellerDAO {
  private adapter: DataSourceAdapter;

  constructor(dataSource: SellerDataSource) {
    this.adapter = this.getAdapter(dataSource);
  }

  private getAdapter(dataSource: SellerDataSource): DataSourceAdapter {
    switch (dataSource) {
      case SellerDataSource.Local:
        return new LocalDataSourceAdapter();
      default:
        throw new Error('Invalid data source');
    }
  }

  async createSeller(seller: Seller): Promise<Seller | undefined> {
    return this.adapter.createSeller(seller)
  }

  async getSeller(id: number): Promise<Seller | undefined> {
    return this.adapter.getSeller(id)
  }

  async findFirst(equalityCriteria: Record<any, any>): Promise<Seller | undefined> {
    return this.adapter.findFirst(equalityCriteria)
  }

  async updateSeller(id: number, seller: Partial<Seller>): Promise<boolean> {
    return this.adapter.updateSeller(id, seller)
  }

  async addSellerProduct(id: number, product: Product): Promise<Product | undefined> {
    return this.adapter.addSellerProduct(id, product)
  }

  async removeSellerProduct(id: number, productId: string): Promise<boolean> {
    return this.adapter.removeSellerProduct(id, productId)
  }
  async reOrderSellerProduct(id: number, products: Product[]): Promise<boolean> {
    return this.adapter.reOrderSellerProduct(id, products)
  }
}

interface DataSourceAdapter {
  getSeller(id: number): Promise<Seller | undefined>;
  findFirst(option: Record<any, any>): Promise<Seller | undefined>;
  createSeller(seller: Seller): Promise<Seller | undefined>;
  updateSeller(id: number, data: Partial<Seller>): Promise<boolean>;
  addSellerProduct(id: number, product: Product): Promise<Product | undefined>;
  removeSellerProduct(id: number, productId: string): Promise<boolean>;
  reOrderSellerProduct(id: number, products: Product[]): Promise<boolean>;
}

class LocalDataSourceAdapter implements DataSourceAdapter {
  db = AppDb;

  // this modifies input
  private sortSellerProducts(seller: Seller | undefined) {
    seller?.products.sort((a, b) => a.order - b.order)
    // console.log('{sortSellerProducts} seller: ', seller);
    return seller
  }

  async getSeller(id: number): Promise<Seller | undefined> {
    const seller = await this.db.sellers.get(id)
    return this.sortSellerProducts(seller)
  }

  async findFirst(equalityCriteria: Record<any, any>): Promise<Seller | undefined> {
    if (!Object.keys(equalityCriteria).length) {
      const seller = await this.db.sellers.limit(1).first();
      return this.sortSellerProducts(seller)
    }

    const seller = await this.db.sellers.where(equalityCriteria).first();
    return this.sortSellerProducts(seller)
  }

  async createSeller(seller: Seller): Promise<Seller | undefined> {
    const id = await this.db.sellers.add(seller);
    if (id) {
      // @ts-ignore
      seller.id = id;
    }

    return this.sortSellerProducts(seller)
  }

  async updateSeller(id: number, data: Partial<Seller>): Promise<boolean> {
    const updated = await this.db.sellers.update(id, data)
    return updated > 0
  }

  async addSellerProduct(id: number, product: Product): Promise<Product | undefined> {
    const r = await this.db.sellers.where('id').equals(id)
      .modify(i => i.products.push(product) );
    console.log('{addSellerProduct} r: ', r, id, product);
    return product
  }

  // return true if we can update
  async removeSellerProduct(id: number, productId: string): Promise<boolean> {
    const r = await this.db.sellers
      .where('id').equals(id)
      .modify(i => {
        i.products = i.products.filter(p => p.id != productId);
      });
    console.log('{removeSellerProduct} r: ', r, id, productId);
    return r > 0
  }

  async reOrderSellerProduct(id: number, products: Product[]): Promise<boolean> {
    const seller = await this.db.sellers.get(id)
    if (!seller) return false

    const mapIdToNewOrder: Record<string, number> = {}
    for (let i = 0, c = products.length; i < c; i++) {
      const item = products[i];
      mapIdToNewOrder[item.id ?? ""] = i
    }

    const oldProducts = seller.products
    const changes: Record<string, number> = {
      // "keyPath1": newValue1
      // "products.0.order": 9
    };
    for (let i = 0, c = oldProducts.length; i < c; i++) {
      const item = oldProducts[i];
      changes[`products.${i}.order`] = mapIdToNewOrder[item.id ?? '']
    }

    const r = await this.db.sellers.update(id, changes);
    console.log('{reOrderSellerProduct} : ', {r, changes,});
    return r > 0
  }
}

