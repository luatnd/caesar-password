export function encode_all(all_word_string, password, supported_chars = "") {
  const plains = all_word_string.split(' ')
  const encodes = []
  plains.forEach(plain => {
    let encoded, decoded;

    // Encode latin word only
    if (isLatinOnly(plain)) {
      encoded = pass_encode(plain, password);
      decoded = pass_decode(encoded, password);
    } else {
      encoded = plain
      decoded = plain
    }

    encodes.push(encoded)
    const fn = plain === decoded ? console.info : console.error;
    fn(`"${plain}", "${encoded}", "${decoded}"`)
  })
  return encodes.join(' ')
}

export function decode_all(all_decoded_string, password, supported_chars = "") {
  const decoded_words = all_decoded_string.split(' ')
  const plains = []
  decoded_words.forEach(encoded => {
    let plain;
    if (isLatinOnly(encoded)) {
      plain = pass_decode(encoded, password);
    }
    else {
      plain = encoded
    }
    plains.push(plain)
    console.log(`"${encoded}", "${plain}"`)
  })

  return plains.join(' ')
}

// only supported_chars was encoded
function pass_encode(plain_text, password, chars) {
  return base64_encode(caesar_cypher_with_password(plain_text, password, false, chars))
}
function pass_decode(encoded_text, password, chars) {
  return caesar_cypher_with_password(base64_decode(encoded_text), password, true, chars)
}

function caesar_cypher_with_password(plain_text, password, decoding = false, supported_chars = '') {
  if (!supported_chars) {
    supported_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }
  const supported_chars_indexes = toDict(supported_chars);
  /**
   * encode/decode a single char
   * shift can be negative
   */
  function caesar_cypher(char, shift) {
    const prev_idx = supported_chars_indexes[char]
    const new_idx = (prev_idx + shift + supported_chars.length) % supported_chars.length;
    return supported_chars[new_idx];
  }
  function makeShiftValues(password) {
    const shifts = [];
    for(let i = 0, c = password.length; i < c; i++) {
      const charCode = supported_chars_indexes[password[i]];
      const shift = (charCode ?? 0) % supported_chars.length;
      shifts.push(shift);
    }
    return shifts;
  }
  // console.log('makeShiftValues', makeShiftValues(supported_chars + est_special_chars))

  /*
  * encode plain text with multiple shift values
  * In case of single shift: shifts = [shift_value]
  */
  function caesar_cypher_with_shifts(plain_text, shifts) {
    let encoded = '';
    if (!shifts.length) shifts.push(0); // no password mean not shifting

    for(let i =  0, c = plain_text.length; i < c; i++) {
      const char = plain_text[i];
      if (char in supported_chars_indexes) {
        const shift = shifts[i % shifts.length]
        encoded += caesar_cypher(char, shift)
      } else {
        // console.log('skip')
        encoded += char;
      }
    }

    return encoded;
  }

  let shifts = makeShiftValues(password);

  // shift of decoding is reversed compared to encoding
  if (decoding) {
    shifts = shifts.map(i => -i);
  }

  return caesar_cypher_with_shifts(plain_text, shifts)
}

// same as lodash
function toDict(arr) {
  const dict = {}
  for(let i = 0, c = arr.length; i < c; i++) dict[arr[i]] = i;
  return dict;
}
function base64_encode(plain) {
  return btoa(plain)
}
function base64_decode(encoded) {
  return atob(encoded)
}
function isLatinOnly(s) {
  for(let i = 0, c = s.length; i < c; i++) {
    if (s.charCodeAt(i) > 255) return false;
  }
  return true;
}
