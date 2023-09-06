import {customAlphabet} from 'nanoid';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679"
const nanoid_6 = nanoidGenerator(6);

export function nanoidGenerator(length: number) {
  return customAlphabet(alphabet, length)
}

export function nanoid6() {
  return nanoid_6()
}
