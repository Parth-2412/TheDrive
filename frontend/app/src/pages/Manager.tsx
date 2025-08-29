import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useEffect, useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { importAesKey } from "../services/crypto.service";
import { actualstringToUint8Array, stringToUint8Array } from "../services/helpers.service";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Manager: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [masterAesKey, setMasterAesKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    // Fetch the master AES key from secure storage
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

  useEffect(() => {
    const fetchRootFiles = async () => {
      try {
        const authToken = localStorage.getItem('access_token');  // Get the auth token from local storage
        const response = await fetch(`${BACKEND_URL}/api/folders/root`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Map the response data to the format needed for FileManager
          const folders = data.folders.map((folder: any) => ({
            name: folder.name_encrypted,  // Decrypt this as needed
            isDirectory: true,
            path: folder.id,
            updatedAt: folder.updated_at,
          }));

          const files = data.files.map((file: any) => ({
            name: file.name_encrypted,  // Decrypt this as needed
            isDirectory: false,
            path: file.folder,  // Assuming folder path or structure here
            updatedAt: file.updated_at,
            size: file.file_size,
            downloadUrl: file.download_url,  // If you want to use it for file download
          }));

          setFiles([...folders, ...files]);  // Combine folders and files into one array
        } else {
          console.error("Failed to fetch root files:", data);
        }
      } catch (error) {
        console.error("Error fetching root files:", error);
      }
    };

    fetchRootFiles();
  }, []);

  return (
    <FileManager files={files} masterAesKey={masterAesKey} />
  );
};

export default Manager;
