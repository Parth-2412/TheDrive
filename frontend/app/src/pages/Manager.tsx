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
import { ERROR_CONFIG } from "../util";
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
}

const fileUploadConfig = {
  url: BACKEND_URL
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
  const [masterAesKey, setMasterAesKey] = useState<CryptoKey | null>(null);
  const [navState, setNavState] = useState<NavState>({ currentFolder : ROOT_FOLDER });
  const { currentFolder } = navState;
  const [present] = useIonToast();


  const fetchFolderFiles = useCallback(
    async (currentFolder: Folder, masterAesKey: CryptoKey | null) => {
      if (!masterAesKey) {
        return; // Wait until the masterAesKey is set before proceeding
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
                  path: currentFolder.path + name ,
                }
              })
          );

        const sub_files = await Promise.all(
          data.files.map(async (file: any) => {
            const name  = await decryptFileName(file.name_encrypted, masterAesKey)
            return {
              name,  // Await the decryption
              isDirectory: false,
              path: currentFolder.path + name,
              size: file.file_size,
              downloadUrl: file.download_url,
            }
          })
        );


          setFiles(current_files => removeDuplicates([...current_files,...folders, ...sub_files])); // Combine folders and files into one array
        
      } catch (error) {
        console.error("Error fetching root files:", error);
        present(ERROR_CONFIG);
      }
  }, [present,setFiles]);

  // Fetch the master AES key from secure storage
  useEffect(() => {
    const fetchMasterKey = async () => {
      try {
        const { value } = await SecureStoragePlugin.get({ key: "masterKey" });
        const master = await importAesKey(stringToUint8Array(value));
        setMasterAesKey(master);
      } catch (error) {
        console.error("Failed to get master key:", error);
      }
    };

    fetchMasterKey();
  }, []);

  

  // Fetch root files from the backend using axios
  useEffect(() => {
    if(!masterAesKey){ 
      return;
    };
    fetchFolderFiles(currentFolder,masterAesKey);
  }, [masterAesKey,  currentFolder]);

  console.log(files)

  const handleCreateFolder = async (newName: string, currentFolder : Folder | null) => {

    if(currentFolder == null){
      currentFolder = ROOT_FOLDER;
    }
    const encryptedName = await encryptName(newName, masterAesKey as CryptoKey)
    console.log(encryptedName)
    try {
      const response = await axiosInstance.post('/api/folders/', {name_encrypted: encryptedName, parent: currentFolder.id, ai_enabled: false});
      const newFolder : Folder = {
        isDirectory: true,
        path: '/' + newName,
        ...response.data
      };
      setFiles(prevFiles => [...prevFiles, newFolder]);
    }
    catch(error) {
      console.error(error);
      present(ERROR_CONFIG);
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
      masterAesKey={masterAesKey} 
      onCreateFolder={handleCreateFolder} 
      initialPath=""
    />
  );
};

export default Manager;
