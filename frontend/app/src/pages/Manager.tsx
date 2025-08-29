import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useEffect, useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { importAesKey } from "../services/crypto.service";
import { actualstringToUint8Array, stringToUint8Array } from "../services/helpers.service";
import axiosInstance from "../services/api.service"; // Import axios instance
import { decryptFileName, encryptName } from "../services/encrypt.service";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Manager: React.FC = () => {
  const fileUploadConfig = {
    url: BACKEND_URL
  }
  const [files, setFiles] = useState<any[]>([]);
  const [masterAesKey, setMasterAesKey] = useState<CryptoKey | null>(null);

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
    const fetchFolderFiles = async (currentFolder: any) => {
      if (!masterAesKey) {
        return; // Wait until the masterAesKey is set before proceeding
      }
      try {
        const response = await axiosInstance.get(`/api/folders/${currentFolder.id}`, {
        });

        const data = response.data; // Assuming response is in JSON format

        // If the request was successful
        if (response.status === 200) {
          // Map the response data to the format needed for FileManager
          const folders = await Promise.all(data.folders.map(async (folder: any) => {
          const name = await decryptFileName(folder.name_encrypted, masterAesKey as CryptoKey)
            return {...folder,
          name,  // Await the decryption
          isDirectory: true,
          path: currentFolder.path + '/' + name,
          updatedAt: folder.updated_at,}
        }));

        const files = await Promise.all(data.files.map(async (file: any) => {
          
          const name  = await decryptFileName(file.name_encrypted, masterAesKey as CryptoKey)
          return {
          name,  // Await the decryption
          isDirectory: false,
          path: currentFolder.path + '/' + name,
          updatedAt: file.updated_at,
          size: file.file_size,
          downloadUrl: file.download_url,}
        }));


          setFiles([...folders, ...files]); // Combine folders and files into one array
        } else {
          console.error("Failed to fetch root files:", data);
        }
      } catch (error) {
        console.error("Error fetching root files:", error);
      }
    };

    fetchFolderFiles();
  }, [masterAesKey]);
  console.log(files)
  const handleCreateFolder = async (newName: string) => {

    
    const encryptedName = await encryptName(newName, masterAesKey as CryptoKey)
    console.log(encryptedName)
    const response = await axiosInstance.post('/api/folders/', {name_encrypted: encryptedName, parent: null, ai_enabled: false});
    if (response.status === 201) {
        const newFolder = {
          name: newName,  // You can update this once decrypted
          isDirectory: true,
          path: '/' + newName,
          updatedAt: new Date(),  // You may want to use the actual timestamp from the response
        };
        setFiles(prevFiles => [...prevFiles, newFolder]);

      }
  }

  // const handleFileUpload = async ()

  return (
    <FileManager onNavChange={} fileUploadConfig={fileUploadConfig} files={files} masterAesKey={masterAesKey} onFileUploaded={console.log} onCreateFolder={handleCreateFolder} initialPath=""/>
  );
};

export default Manager;
