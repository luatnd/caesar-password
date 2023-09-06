import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardActions} from "@mui/material";
import Button from "@mui/material/Button";
import {useCallback, useState} from "react";
import TextField from "@mui/material/TextField";

import {addSellerProduct} from "../../service";
import {SellerProductsStore} from "../../store";
import {nanoid6} from "@/services/NanoId";
import {randInt} from "@/utils/number";
import {observer} from "mobx-react-lite";


interface Props {
  sellerId: number,
}

export default observer(function ProductCreate(props: Props) {
  const {sellerId} = props
  const [name, setName] = useState("")
  const [price, setPrice] = useState<string>("")
  const [desc, setDesc] = useState("")
  const listLength = SellerProductsStore.products.length

  const createProduct = useCallback(async (e:any) => {
    e.preventDefault();

    // TODO: Validate input

    // add new product to seller.products
    const newProduct = await addSellerProduct(sellerId, {
      id: nanoid6(),
      name,
      order: listLength,
      price: parseFloat(price),
      description: desc,
      image: 'https://source.unsplash.com/random/320x180/?fruit-' + randInt(0, 3),
    });
    // refresh UI: add this to product list
    console.log('{add to list} newProduct: ', newProduct);
    if (newProduct) {
      SellerProductsStore.addProduct(newProduct)
      setName("")
      setPrice("")
      setDesc("")
    }
  }, [name, price, desc, listLength])

  return (
    // <Grid item xs={12} sm={4} md={3}>
      <Card variant="elevation">
        <form onSubmit={createProduct}>
        <CardContent>
          <TextField
            variant="outlined"
            margin="normal" fullWidth
            required
            name="name" label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal" fullWidth
            required
            name="price" label="Price"
            value={price} type="number"
            inputProps={{ step: 0.1 }}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            variant="outlined"
            multiline
            margin="normal" fullWidth rows={3}
            required
            name="desc" label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button
            title="Create product"
            type="submit"
            fullWidth
            variant="outlined"
          >Create</Button>
        </CardActions>
        </form>
      </Card>
    // </Grid>
  );
})
