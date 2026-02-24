'use client'
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { encrypt_words, decrypt_words, encrypt_string, decrypt_string } from "@/services/CaesarEncrypt"
import { Stack, Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

export default function Playground() {
  const [pw, setPw] = useState("");
  const defaultAlphaNumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const [charMode, setCharMode] = useState("alphanumeric");
  const [customChars, setCustomChars] = useState("");
  const [supportedChars, setSupportedChars] = useState(defaultAlphaNumeric);
  const [wholeString, setWholeString] = useState(true);
  const [plainText, setPlainText] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [plainTextLastEdited, setPlainTextLastEdited] = useState(0);
  const [encryptedLastEdited, setEncryptedLastEdited] = useState(0);
  const [plainTextErr, setPlainTextErr] = useState("");
  const [encryptedErr, setEncryptedErr] = useState("");

  // get encrypted text from url
  useEffect(() => {
    if (typeof window !== "undefined") {
      const eParam = new URLSearchParams(window.location.search).get("e");
      if (eParam) {
        // Base64 ' ' converts to '+' because '+' in URL params is often decoded to a space
        const base64Encrypted = eParam.replace(/ /g, "+");
        setEncrypted(base64Encrypted);
        setEncryptedLastEdited(Date.now());
      }
    }
  }, []);

  // refresh form
  useEffect(() => {
    const encrypting = plainTextLastEdited > encryptedLastEdited

    if (encrypting) {
      try {
        const s = wholeString
          ? encrypt_string(plainText, pw, supportedChars)
          : encrypt_words(plainText, pw, supportedChars)
        setEncrypted(s)
        setPlainTextErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setPlainTextErr("Invalid input")
      }
    } else {
      try {
        const s = wholeString
          ? decrypt_string(encrypted, pw, supportedChars)
          : decrypt_words(encrypted, pw, supportedChars)
        setPlainText(s)
        setEncryptedErr("")
      } catch (e) {
        console.error('{decrypt} e: ', e);
        setEncryptedErr("Invalid input")
      }
    }
  }, [pw, supportedChars, wholeString, plainTextLastEdited, encryptedLastEdited, plainText, encrypted])

  return (
    <Paper elevation={1} sx={{ p: 3, my: 5 }}>
      <Typography variant="h5">
        Playground
      </Typography>
      <div>
        <TextField
          label="Password" fullWidth sx={{ mt: 3 }}
          value={pw} onChange={e => setPw(e.target.value)}
          type="password"
        />
        <Typography variant="caption">
          Program will encrypt only the supported characters, the other remain plaintexts.
        </Typography>

        <FormControl sx={{ mt: 3, width: '100%' }}>
          <FormLabel id="supported-chars-group-label" sx={{ fontSize: '0.8rem' }}>Supported chars</FormLabel>
          <RadioGroup
            row
            aria-labelledby="supported-chars-group-label"
            name="supported-chars-group"
            value={charMode}
            onChange={(e: any) => {
              const mode = e.target.value;
              setCharMode(mode);
              if (mode === "alphanumeric") {
                setSupportedChars(defaultAlphaNumeric);
              } else {
                setSupportedChars(customChars);
              }
            }}
          >
            <FormControlLabel value="alphanumeric" control={<Radio size="small" />} label="Default AlphaNumeric" />
            <FormControlLabel value="custom" control={<Radio size="small" />} label="Custom" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Supported chars"
          value={charMode === "alphanumeric" ? defaultAlphaNumeric : customChars}
          onChange={(e: any) => {
            setCharMode("custom");
            setCustomChars(e.target.value);
            setSupportedChars(e.target.value);
          }}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" sx={{ display: 'block' }} color="warning">
          ⚠️ Program will encrypt only the supported characters, the other remain plaintexts.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <Typography>Word by word</Typography>
          <Switch
            checked={wholeString}
            onChange={e => setWholeString(e.target.checked)}
            color="primary"
          />
          <Typography>Whole string</Typography>
        </Stack>
        {!wholeString && <Typography variant="caption">
          Apply the password to each word, see <a href="#how-it-work"><b>How it work</b></a> section below for more detail
        </Typography>}
        {wholeString && <Typography variant="caption">
          Apply the password to the whole string, see <a href="#how-it-work"><b>How it work</b></a> section below for more detail
        </Typography>}
      </div>

      <Box sx={{ mt: 5 }}>
        <TextField
          id="outlined-multiline-static"
          label="Plaintext"
          multiline
          rows={6}
          value={plainText} onChange={e => {
            setPlainText(e.target.value)
            setPlainTextLastEdited(Date.now())
          }}
          error={!!plainTextErr}
          helperText={plainTextErr}
          sx={{ width: '43%' }}
        />
        <div style={{ width: '14%', display: "inline-block", textAlign: "center" }}>
          <IconButton color="primary" aria-label="add an alarm">
            <SwapHorizOutlinedIcon />
          </IconButton>
        </div>
        <TextField
          id="outlined-multiline-static"
          label="Encrypted"
          multiline
          rows={6}
          value={encrypted} onChange={e => {
            setEncrypted(e.target.value)
            setEncryptedLastEdited(Date.now())
          }}
          error={!!encryptedErr}
          helperText={encryptedErr}
          sx={{ width: '43%' }}
        />
      </Box>
      <Typography variant="caption" textAlign="center" sx={{ my: 5 }}>
        Type or paste Plaintext/Encrypted to encrypt/decrypt between them
      </Typography>
    </Paper>
  )
}
