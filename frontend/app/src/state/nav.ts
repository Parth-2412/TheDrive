import { atom } from 'recoil';

interface StorageEntity {
  id : string;
  name : string;
  ai_enabled : boolean;
  created_at : string;
  updated_at : string;
  path : string;
}

export interface IFile extends StorageEntity {
  file_size: number;
  file_hash : string;
  isDirectory: false;
  key_encrypted: string;
  file_iv: string;
  key_encrypted_iv: string;
  folder : string;
}
export interface IFolder extends StorageEntity {
  parent: string | null;
  isDirectory: true;
}

export const ROOT_FOLDER : IFolder = {
  path : '/',
  parent: '',
  id : 'root',
  name : '',
  ai_enabled: false,
  created_at : '',
  updated_at: '',
  isDirectory: true,
}

export const driveState = atom<(IFile|IFolder)[]>({
  key: 'driveState', // unique ID
  default: [], // initial value
});

export interface NavState {
  currentFolder: IFolder;
  currentFileOpened : IFile | null;
}

export const _navState = atom<NavState>({
  key: 'navState', // unique ID
  default: { currentFolder: ROOT_FOLDER, currentFileOpened : null}, // initial value
});
