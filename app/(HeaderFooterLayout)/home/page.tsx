'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function SellerPage(ctx: any) {
  return (
    <>
      <Typography variant="h3" textAlign="center" sx={{my: 5}}>
        Simple deterministic encryption by combining caesar cipher with password
      </Typography>
      <Typography variant="subtitle1" textAlign="center" sx={{my: 5}}>
        Simple deterministic encryption by combining caesar cipher with password
      </Typography>

      <Box sx={{mt: 5}}>
        encrypt here
      </Box>
    </>
  )
}
