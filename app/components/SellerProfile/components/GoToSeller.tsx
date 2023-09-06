import {useState} from "react";
import {useRouter} from "next/navigation";
import Paper from "@mui/material/Paper";
import {InputBase} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";

export function GoToSeller() {
  const [id, setId] = useState('')
  const router = useRouter();
  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, margin: '0 auto' }}
      action="javascript: void(0)"
      onSubmit={() => router.push('/seller/' + id)}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Visit other Seller: Type Seller ID here"
        inputProps={{ 'aria-label': 'go to seller' }}
        onChange={(e) => setId(e.target.value)}
      />
      <IconButton
        type="button" sx={{ p: '10px' }} aria-label="search"
        onClick={() => router.push('/seller/' + id)}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
