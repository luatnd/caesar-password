import React, {useEffect, useState} from "react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {DoneAllOutlined, ModeEditOutlined, PermPhoneMsg} from "@mui/icons-material";

import TextField from "@mui/material/TextField";
import {useSellerInfo} from "./service";
import {bottom} from "@popperjs/core";

interface Props {
  item: {
    id?: number;
    name: string;
    phone: string;
    description: string;
    cover_image: string;
  };
  isOwner?: boolean,
}

export default function SellerInfo(props: Props) {
  const { item, isOwner } = props;
  const [edit, setEdit] = useState(false)

  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        mt: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${item.cover_image})`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={item.cover_image} alt={item.name} />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <SellerInfoForm item={item} edit={edit}/>
          </Box>
        </Grid>
      </Grid>

      {isOwner && <Button
        color="info"
        variant="contained"
        onClick={() => setEdit(!edit)} title="Edit"
        sx={{position: "absolute", top: 10, right: 10, py: 1, }}
      >
        {edit ? <DoneAllOutlined/> : <ModeEditOutlined/>}
      </Button>}
    </Paper>
  );
}

function SellerInfoForm(props: Props & { edit: boolean }) {
  const { item, edit } = props;

  const [name, setName] = useState(item.name)
  const [phone, setPhone] = useState(item.phone)
  const [desc, setDesc] = useState(item.description)
  const {
    persistName, persistPhone, persistDesc,
  } = useSellerInfo(item.id ?? -1)

  return !edit
    ? (
      <>
        <Typography component="h1" variant="h3" color="inherit" gutterBottom noWrap data-lines={2}>
          {name}
        </Typography>
        <Typography variant="h4" color="whitesmoke" gutterBottom noWrap data-lines={1}>
          <PermPhoneMsg fontSize="medium" />
          &nbsp;  {phone}
        </Typography>
        <Typography variant="h5" color="inherit" paragraph noWrap data-lines={6}>
          {desc}
        </Typography>
      </>
    )
  : (
    <Paper sx={{p: 2, width: '80%'}}>
      <TextField
        variant="outlined"
        margin="normal" fullWidth
        required
        name="name" label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={persistName}
      />
      <TextField
        variant="outlined"
        margin="normal" fullWidth
        required
        name="phone" label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={persistPhone}
      />
      <TextField
        variant="outlined"
        multiline
        margin="normal" fullWidth
        required
        name="desc" label="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        onBlur={persistDesc}
      />
    </Paper>
  )
}
