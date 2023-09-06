'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Paper from "@mui/material/Paper";
import {useEffect, useState} from "react";
import {encode_all, decode_all} from "@/services/CaesarEncrypt"

export default function HomePage(ctx: any) {
  const [pw, setPw] = useState("");
  const [supportedChars, setSupportedChars] = useState("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const [plainText, setPlainText] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [plainTextLastEdited, setPlainTextLastEdited] = useState(0);
  const [encryptedLastEdited, setEncryptedLastEdited] = useState(0);
  const [plainTextErr, setPlainTextErr] = useState("");
  const [encryptedErr, setEncryptedErr] = useState("");

  // refresh form
  useEffect(() => {
    const encrypting = plainTextLastEdited > encryptedLastEdited

    if (encrypting) {
      try {
        setEncrypted(encode_all(plainText, pw, supportedChars))
        setPlainTextErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setPlainTextErr("Invalid input")
      }
    } else {
      try {
        setPlainText(decode_all(encrypted, pw, supportedChars))
        setEncryptedErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setEncryptedErr("Invalid input")
      }
    }
  }, [pw, supportedChars, plainTextLastEdited, encryptedLastEdited, plainText, encrypted])

  return (
    <>
      <Typography variant="h3" textAlign="center" sx={{my: 5}}>
        Caesar password
      </Typography>
      <Typography variant="h5" textAlign="center" sx={{my: 5}}>
        Simple deterministic encryption by combining caesar cipher with password
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{my: 5}}>
        This is a web UI, you can see source code and understand how it work here: <a href="https://gist.github.com/luatnd/1adec00e1c5086ff6767ae681be20c47">
        mxn0 encrypt with password
      </a>
      </Typography>

      <Paper elevation={1} sx={{p: 3, my: 5}}>
        <div>
          <TextField
            label="Password" fullWidth
            value={pw} onChange={e => setPw(e.target.value)}
          />
          <Typography variant="caption" textAlign="center" sx={{my: 5}}>
            Program will encrypt only the supported characters, the other remain plaintexts.
          </Typography>

          <TextField
            label="Supported chars"
            value={supportedChars} onChange={e => setSupportedChars(e.target.value)}
            fullWidth
            sx={{mt: 2}}
          />
          <Typography variant="caption" textAlign="center" sx={{my: 5}}>
            Program will encrypt only the supported characters, the other remain plaintexts.
          </Typography>
        </div>

        <Box sx={{mt: 5}}>
          <TextField
            id="outlined-multiline-static"
            label="Plaintext"
            multiline
            rows={4}
            value={plainText} onChange={e => {
              setPlainText(e.target.value)
              setPlainTextLastEdited(Date.now())
            }}
            error={!!plainTextErr}
            helperText={plainTextErr}
            sx={{width: '43%'}}
          />
          <div style={{width: '14%', display: "inline-block", textAlign: "center"}}>
            <IconButton color="secondary" aria-label="add an alarm">
              <SwapHorizOutlinedIcon />
            </IconButton>
          </div>
          <TextField
            id="outlined-multiline-static"
            label="Encrypted"
            multiline
            rows={4}
            value={encrypted} onChange={e => {
              setEncrypted(e.target.value)
              setEncryptedLastEdited(Date.now())
            }}
            error={!!encryptedErr}
            helperText={encryptedErr}
            sx={{width: '43%'}}
          />
        </Box>
        <Typography variant="caption" textAlign="center" sx={{my: 5}}>
          Type or paste Plaintext/Encrypted to encrypt/decrypt between them
        </Typography>
      </Paper>
    </>
  )
}
