import { atom } from 'recoil';

export interface User {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
    masterAesKey : CryptoKey;
    accessToken?: string;
    refreshToken?: string;
    ready?: boolean
}
export const userState = atom<User | null | 'loading'>({
  key: 'userState', // unique ID
  default: 'loading', // initial value
});