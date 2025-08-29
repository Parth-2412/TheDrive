import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useEffect, useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { importAesKey } from "../services/crypto.service";
import { actualstringToUint8Array, stringToUint8Array } from "../services/helpers.service";



const Manager: React.FC = () => {

    const [files, setFiles] = useState([
        {
          name: "Documents",
          isDirectory: true,
          path: "/Documents", 
          updatedAt: "2024-09-09T10:30:00Z", 
        },
        {
          name: "Pictures",
          isDirectory: true,
          path: "/Pictures", 
          updatedAt: "2024-09-09T11:00:00Z",
        },
        {
          name: "Pic.png",
          isDirectory: false, 
          path: "/Pictures/Pic.png", 
          updatedAt: "2024-09-08T16:45:00Z",
          size: 2048,
        },
      ]);

  const [masterAesKey, setMasterAesKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const fetchMasterKey = async () => {
      try {
        const { value } = await SecureStoragePlugin.get({ key: "masterKey" });
        // console.log(value)
        const master = await importAesKey(stringToUint8Array(value));
        setMasterAesKey(master);
      } catch (error) {
        console.error("Failed to get master key:", error);
      }
    };

    fetchMasterKey();
  }, []);

    return (
       <FileManager files={files} masterAesKey={masterAesKey}/> 
    );
};

export default Manager;
