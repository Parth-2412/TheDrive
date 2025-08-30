import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useCallback, useEffect,  useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { importAesKey } from "../services/crypto.service";
import { actualstringToUint8Array, stringToUint8Array } from "../services/helpers.service";
import axiosInstance from "../services/api.service"; // Import axios instance
import { decryptFileName, encryptName } from "../services/encrypt.service";
import { useIonToast } from '@ionic/react';
import { showError } from "../util";
import { RecoilState, useRecoilState } from "recoil";
import { User, userState } from "../state/user";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


interface StorageEntity {
  id : string;
  name : string;
  ai_enabled : boolean;
  created_at : string;
  updated_at : string;
  path : string;
}

interface File extends StorageEntity {
  file_size: number;
  file_hash : string;
  isDirectory: false;
  key_encrypted: string;
  file_iv: string;
  key_encrypted_iv: string;
  folder : string;
}
interface Folder extends StorageEntity {
  parent: string | null;
  isDirectory: true;
}
interface NavState {
  currentFolder: Folder;
}
const ROOT_FOLDER : Folder = {
  path : '/',
  parent: '',
  id : 'root',
  name : '',
  ai_enabled: false,
  created_at : '',
  updated_at: '',
  isDirectory: true,
}

const fileUploadConfig = {
  url: BACKEND_URL+'/api/files/',
}

function removeDuplicates(arr : (File|Folder)[]) {
    const seen = new Set();
    return arr.filter(item => {
        if (seen.has(item.id)) {
            return false;
        } else {
            seen.add(item.id);
            return true;
        }
    });
}

const Manager: React.FC = () => {
  const [files, setFiles] = useState<(File|Folder)[]>([]);
  const [user,_] = useRecoilState<User>(userState as RecoilState<User>)
  const [navState, setNavState] = useState<NavState>({ currentFolder : ROOT_FOLDER });
  const { currentFolder } = navState;
  const [present] = useIonToast();

  const get_path = (name:string, currentFolder: Folder) => currentFolder.path + (currentFolder.id == 'root' ? '' : '/') + name

  const fetchFolderFiles = useCallback(
    async (currentFolder: Folder, masterAesKey: CryptoKey) => {
      if (!user.masterAesKey) {
        return; // Wait until the user.masterAesKey is set before proceeding
      }
      try {
        const response = await axiosInstance.get(`/api/folders/${currentFolder.id}`, {
        });
        
        const data = response.data; // Assuming response is in JSON format
        
        
        // Map the response data to the format needed for FileManager
        const folders = await Promise.all(
          data.folders.map(
            async (folder: any) => {
              const name = await decryptFileName(folder.name_encrypted, masterAesKey)
                return {
                  ...folder,
                  name,  // Await the decryption
                  isDirectory: true,
                  path: get_path(name, currentFolder),
                }
              })
          );

        const sub_files = await Promise.all(
          data.files.map(async (file: any) => {
            const name  = await decryptFileName(file.name_encrypted, masterAesKey)
            return {
              name,
              isDirectory: false,
              path: get_path(name, currentFolder),
              size: file.file_size,
              downloadUrl: file.download_url,
            }
          })
        );


          setFiles(current_files => removeDuplicates([...current_files,...folders, ...sub_files])); // Combine folders and files into one array
        
      } catch (error) {
        console.error("Error fetching root files:", error);
        present(showError());
      }
  }, [present,setFiles]);

  // Fetch the master AES key from secure storage
  
  

  // Fetch root files from the backend using axios
  useEffect(() => {
    
    if(!user.masterAesKey){ 
      return;
    };
    fetchFolderFiles(currentFolder,user.masterAesKey);
  }, [user.masterAesKey,  currentFolder]);

  console.log(files)

  const handleFileRename = async (file: File | Folder, newName: string) => {
    
    if(!user.masterAesKey){
      present(showError());
      return;
    }
    const updatedFiles = files.map(f => {
    if (f.id === file.id) {
      const updatedFile = { ...f, name: newName, path: f.path.split('/').slice(0, -1).concat(newName).join('/') }; // Update name and path
      return updatedFile;
    }
    return f;
  });

  setFiles(updatedFiles);
  
  const encryptedName = await encryptName(newName, user.masterAesKey)
  try {
    let response;
    if(file.isDirectory){
      response = await axiosInstance.patch(`/api/folders/${file.id}/rename/`, {name_encrypted: encryptedName});
    }
    else {
      response = await axiosInstance.patch(`/api/files/${file.id}/rename/`, {name_encrypted: encryptedName});
    }
    
    }
    catch (error) {
      const revertedFiles = files.map(f => {
      if (f.id === file.id) {
        const revertedFile = { ...f, name: file.name }; // revert to original name
        return revertedFile;
      }
      return f;
    });
    setFiles(revertedFiles);
    present(showError());
    }
  }

  const handleCreateFolder = async (newName: string, currentFolder : Folder | null) => {

    if(!currentFolder){
      currentFolder = ROOT_FOLDER;
    }
    const encryptedName = await encryptName(newName, user.masterAesKey)
    console.log(encryptedName)
    try {
      const response = await axiosInstance.post('/api/folders/', {name_encrypted: encryptedName, parent: currentFolder.id, ai_enabled: false});
      const newFolder : Folder = {
        name: newName,
        isDirectory: true,
        path: get_path(newName, currentFolder),
        ...response.data
      };
      setFiles(prevFiles => [...prevFiles, newFolder]);
    }
    catch(error) {
      console.error(error);
      present(showError());
    }
  }

  // const handleFileUpload = async ()

  return (
    <FileManager 
      onNavChange={(navData : NavState) => {
        if(navData.currentFolder == null ){
          if(currentFolder.id != 'root'){
            setNavState({...navState, currentFolder : ROOT_FOLDER})
          }
        }
        else if(navData.currentFolder.id === currentFolder.id){}
        else {
          setNavState(navData);
        }
      }} 
      files={files} 
      masterAesKey={user.masterAesKey} 
      onCreateFolder={handleCreateFolder} 
      initialPath=""
      fileUploadConfig={fileUploadConfig}
      onRename={handleFileRename}
    />
  );
};

export default Manager;
