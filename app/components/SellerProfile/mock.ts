import {isClientDevMode} from "@/utils/env";
import {SellerDAO, SellerDataSource} from "./dao";


const featuredPosts = [
  {
    id: "kljasnfl",
    name: 'Featured post',
    description:
      'Lizards are a widespread group of squamate reptiles, with over 6,000\n' +
      'species, ranging across all continents except Antarctica',
    image: 'https://source.unsplash.com/random/320x180/?fruit-tropical',
    price: 123.6688,
  },
  {
    id: "jawekf",
    name: 'Post title',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random/320x180/?fruit',
    price: 12.080123,
  },
]
  .map(i => Array(3).fill(i)).flat()
  .map((i,idx) => ({...i, id: i.id + idx}));

const mainFeaturedPost = {
  user_id: 1,
  name: 'Sanoya Fresh Food Hall - 4 seasons',
  phone: '+8412345678',
  description: "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  cover_image: 'https://source.unsplash.com/random/320x180/?shop',
  products: featuredPosts,
};

function createSeller(override: any) {
  const seller = {...mainFeaturedPost, ...override};
  const sellerDao = new SellerDAO(SellerDataSource.Local);
  sellerDao.createSeller(seller).then(r => {
    console.log('{createSeller} r: ', r);
  })
}

if (isClientDevMode) {
  // @ts-ignore
  window.tmp__createSeller = createSeller;
}
