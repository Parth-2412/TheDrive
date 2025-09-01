import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useCallback, useEffect,  useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { generateSHA256Hash, generateSignature, getFileSHA256Hash, importAesKey, uint8ArrayToHex } from "../services/crypto.service";
import { fromBase64, uint8ArrayToString } from "../services/helpers.service";
import axiosInstance, { aiNodeInstance } from "../services/api.service"; // Import axios instance
import encryptFile, { decryptFileName, encryptName } from "../services/encrypt.service";
import { useIonToast } from '@ionic/react';
import { getMimeType, showError } from "../util";
import { RecoilState, useRecoilState } from "recoil";
import { User, userState } from "../state/user";
import { checkAllFilesSame } from "../../../react-file-manager/src/utils/checkAllFilesSame";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


interface StorageEntity {
  id : string;
  name : string;
  ai_enabled : boolean;
  created_at : string;
  updated_at : string;
  path : string;
}

interface IFile extends StorageEntity {
  file_size: number;
  file_hash : string;
  isDirectory: false;
  key_encrypted: string;
  file_iv: string;
  key_encrypted_iv: string;
  folder : string;
}
interface IFolder extends StorageEntity {
  parent: string | null;
  isDirectory: true;
}
interface NavState {
  currentFolder: IFolder;
}


const ROOT_FOLDER : IFolder = {
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

function removeDuplicates(arr : (IFile|IFolder)[]) {
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
  const [files, setFiles] = useState<(IFile|IFolder)[]>([]);
  const [user,_] = useRecoilState<User>(userState as RecoilState<User>)
  const [navState, setNavState] = useState<NavState>({ currentFolder : ROOT_FOLDER });
  const { currentFolder } = navState;
  const [present] = useIonToast();

  const get_path = (name:string, currentFolder: IFolder) => currentFolder.path + (currentFolder.id == 'root' ? '' : '/') + name

  const fetchFolderFiles = useCallback(
    async (currentFolder: IFolder, masterAesKey: CryptoKey) => {
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
                  updatedAt: folder.updated_at,
                }
              })
          );

        const sub_files = await Promise.all(
          data.files.map(async (file: any) => {
            const name  = await decryptFileName(file.name_encrypted, masterAesKey)
            return {
              ...file,
              name,
              isDirectory: false,
              path: get_path(name, currentFolder),
              size: file.file_size,
              download_url: file.download_url,
              updatedAt: file.updated_at,
              ai_enabled: file.ai_enabled,
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
  
  const sentUploadRequests = new Set();

  // Fetch root files from the backend using axios
  useEffect(() => {
    
    if(!user.masterAesKey){ 
      return;
    };
    fetchFolderFiles(currentFolder,user.masterAesKey);
  }, [user.masterAesKey,  currentFolder]);

  const handleFileRename = async (file: IFile | IFolder, newName: string) => {
    
    if(!user.masterAesKey){
      present(showError());
      return;
    }

    const newPath = file.path.split('/').slice(0,-1).concat(newName).join('/')
    const updatedFiles = files.map(f => {
      if(f.id == file.id){
        const updatedFile = { ...f, name: newName, path : newPath};
        return updatedFile;
      }
      if (f.path.startsWith(file.path)) {
        const updatedFile = { ...f, path: f.path.replace(file.path,newPath) }; // Update name and path
        return updatedFile;
      }
      return f;
  });
  const reverted_files = files;
  setFiles(updatedFiles);
  const new_name_hash = await generateSHA256Hash(newName)
  const encryptedName = await encryptName(newName, user.masterAesKey)
  try {
    let response;
    if(file.isDirectory){
      response = await axiosInstance.patch(`/api/folders/${file.id}/rename/`, {name_encrypted: encryptedName, folder_name_hash : new_name_hash});
    }
    else {
      response = await axiosInstance.patch(`/api/files/${file.id}/rename/`, {name_encrypted: encryptedName, file_name_hash : new_name_hash});
    }
    
    }
    catch (error) {
      setFiles(reverted_files);
      present(showError());
    }
  }

  async function handleUpload(fileData: {  file : File}, currentFolder : IFolder) {
    if(sentUploadRequests.has(fileData.file.name)) return;
    sentUploadRequests.add(fileData.file.name);
    if(!currentFolder) currentFolder = ROOT_FOLDER;
    const encryptedData = await encryptFile(fileData.file, user.masterAesKey)

    const payload = {
      file_data: encryptedData.ciphertext,
      file_iv: encryptedData.file_iv,
      key_encrypted: encryptedData.wrapped_key,
      key_encrypted_iv: encryptedData.wrap_iv,
      name_encrypted: encryptedData.filename,
      file_name_hash : await generateSHA256Hash(fileData.file.name),
      file_hash : await getFileSHA256Hash(fileData.file),
      folder: currentFolder.id,
      ai_enabled : false,
    };

    // Use Axios to send the encrypted data
    try {
      const response = await axiosInstance
        .post(fileUploadConfig?.url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      const file : IFile = {
        ...response.data,
        path : get_path(fileData.file.name, currentFolder),
        name : fileData.file.name,
        isDirectory: false,
        updatedAt: new Date().toISOString(),
        size: fileData.file.size,
        ai_enabled: false,
      }
    
      setFiles(currFiles => [...currFiles, file ])          
    }
    catch (error){
      throw error;
    }
    finally {
      sentUploadRequests.delete(fileData.file.name);
    }
             
  }
  const handleCreateFolder = async (newName: string, currentFolder : IFolder | null) => {

    if(!currentFolder){
      currentFolder = ROOT_FOLDER;
    }
    const encryptedName = await encryptName(newName, user.masterAesKey)
    console.log(encryptedName)
    try {
      const response = await axiosInstance.post('/api/folders/', {name_encrypted: encryptedName, folder_name_hash : await generateSHA256Hash(newName), parent: currentFolder.id, ai_enabled: false});
      const newFolder : IFolder = {
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

  const handleAiModeChange = async (selectedFiles: IFile[], enable : boolean) => {
    if(selectedFiles[0] == null){
      if(enable){
        // PURE DRIVE KO ENABLE KIYA HAI
        // await axiosInstance.put(`/api/folders/root/enable_ai`)
        // TODO handle the whole drive
      }
      else {
        await axiosInstance.put(`/api/folders/root/disable_ai/`)
      }
    }
    else if(!selectedFiles[0].isDirectory) {
      if(enable){
        console.log("Notifying backend")
        await axiosInstance.patch(`/api/files/toggle/`, {
          file_ids : selectedFiles.map(f => f.id),
          value: true,
        })

        console.log("Notified backend")
        for(const file of selectedFiles){
          const formData = new FormData();
          const data = {
            file_id : file.id,
          }
          console.log("Decrypting file...")
          const file_data = await handleDecryption(file);
          console.log("File decrypted")
  
          console.log(`File type: ${getMimeType(file.name)}`)
          formData.append('file', new Blob([file_data], { type: getMimeType(file.name) }) , file.name);
          formData.append('signed_request', JSON.stringify({ data, public_key : uint8ArrayToHex(user.publicKey) , signature : await generateSignature(user.privateKey, JSON.stringify(data)) }))
          console.log("Signed request")
          console.log("Processing file...")
          
          await aiNodeInstance.post('/ingest',formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',  // Set content type to multipart/form-data
              }
            },
          )
          console.log("Processed file")
        }
        
      }
      else {
        
        console.log("Notifying backend")
        await axiosInstance.patch(`/api/files/toggle/`, {
          file_ids : selectedFiles.map(f => f.id),
          value: false,
        })
        console.log("Notified backend")

      }
    }
    else {
      if(enable){
        //TODO: handle multiple folders for enable

      }
      else {
        await Promise.all(selectedFiles.map(folder => axiosInstance.patch(`/api/folders/${folder.id}/disable_ai/`, {
          file_ids : selectedFiles.map(f => f.id),
          value: false,
        })))
      }
    }
    const updatedFiles = files.map((file) =>
      selectedFiles.find(f => file.path.startsWith(f === null ? "/" : f.path))
            ? { ...file, ai_enabled: enable }
            : file
        );
    setFiles(updatedFiles);
  };

  const handleDecryption = async (file: IFile): Promise<ArrayBuffer> => {
    const response = await axiosInstance.get(`/api/files/${file.id}/download/`);
    const fileData = fromBase64(response.data.file_data)
    const iv = fromBase64(file.file_iv)
    const wrap_iv = fromBase64(file.key_encrypted_iv)
    const wrapped_key = fromBase64(file.key_encrypted)
    
    const decryptedKey = await crypto.subtle.decrypt(
      {name: "AES-GCM", iv: wrap_iv},
      user.masterAesKey,
      wrapped_key
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      await importAesKey(new Uint8Array(decryptedKey)),
      fileData
    );
    
    return decryptedData;
  }

  const handleDownload = async (files : IFile[]) => {
    files.map(async (file) => {
      console.log(file)
      try {
        const decryptedData = await handleDecryption(file);
        const blob = new Blob([decryptedData]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
        present(showError());
      }
    })
  }
  const handleRefresh = async () => {
    setFiles([]);
    if(!user.masterAesKey) return;
    fetchFolderFiles(currentFolder,user.masterAesKey);
  }
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
      //@ts-expect-error
      onFileUpload={handleUpload}
      onAiModeChange={handleAiModeChange}
      onDownload={handleDownload}
      filePreviewPath={import.meta.env.VITE_API_FILES_BASE_URL}
      onDecryption={handleDecryption}
      height="100vh"
      onRefresh={handleRefresh}
    />
  );
};

export default Manager;
