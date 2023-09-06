import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {CardActions} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {AddShoppingCartOutlined, DeleteOutlined, DragIndicatorOutlined, RemoveShoppingCartOutlined} from "@mui/icons-material";
import Link from "next/link";
import {useCallback} from "react";
import {observer} from "mobx-react-lite";

import {cartStore} from "../Cart/store";
import {SellerProductsStore} from "@/components/SellerProfile/store";
import {removeSellerProduct} from "@/components/SellerProfile/service";
import {SortSideBarStore} from "@/components/SellerProfile/components/SortSideBar/store";

interface Props {
  item: {
    id?: string;
    name: string;
    description: string;
    image: string;
    price: number;
  };
  buyAble?: boolean,
  editable?: boolean,
  sellerId: number,
}

export default observer(function Product(props: Props) {
  const { item, buyAble, editable, sellerId } = props;
  const itemId = item.id ?? '';
  const inUserCart = cartStore.hasProduct(itemId);
  const incCart = useCallback(() => {
    cartStore.increaseProduct(itemId)
  }, [itemId])
  const decCart = useCallback(() => {
    cartStore.decreaseProduct(itemId)
  }, [itemId])
  const rmProduct = useCallback(async () => {
    // rm via api
    const success = await removeSellerProduct(sellerId, itemId)
    // update UI
    success && SellerProductsStore.rmProduct(itemId)
  }, [itemId, sellerId])
  const openArrangeSideBar = useCallback(async () => {
    SortSideBarStore.setStates({
      visible: true,
      sellerId,
    })
  }, [sellerId])

  return (
    <Box draggable="false" className="product-c">
        <Card variant="elevation">
          <Link href={""}>
            <CardMedia
              component="img"
              height="140"
              image={item.image}
              alt={item.name}
            />
          </Link>
          <CardContent>
            <Link href={""}>
              <Typography gutterBottom variant="h5" color="text.primary" noWrap data-lines={3}>
                {item.name}
              </Typography>
            </Link>
            <Typography variant="subtitle1" color="text.primary" noWrap data-lines={1}>
              ${item.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap data-lines={6}>
              {item.description}
            </Typography>
          </CardContent>
          <CardActions>
            {buyAble && (
              !inUserCart
                ? <Button onClick={incCart} title="Add to cart"><AddShoppingCartOutlined /></Button>
                : <Button onClick={decCart} title="Remove from cart"><RemoveShoppingCartOutlined /></Button>
            )}
            {editable && <Button title="Delete product" onClick={rmProduct}><DeleteOutlined/> </Button>}
            {editable && <Button title="Re-arrange product" onClick={openArrangeSideBar}><DragIndicatorOutlined/> </Button>}
          </CardActions>
        </Card>
    </Box>
  );
})
