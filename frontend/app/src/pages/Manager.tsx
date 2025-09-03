import FileManager from "../../../react-file-manager/src/FileManager";
import "../../../react-file-manager/dist/style.css";
import { useCallback, useEffect,  useMemo,  useState } from "react";
import './Manager.css';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { generateSHA256Hash, generateSignature, getFileSHA256Hash, importAesKey, uint8ArrayToHex } from "../services/crypto.service";
import { fromBase64, uint8ArrayToString } from "../services/helpers.service";
import axiosInstance, { aiNodeInstance } from "../services/api.service"; // Import axios instance
import encryptFile, { decryptFileName, encryptName } from "../services/encrypt.service";
import { useIonLoading, useIonToast } from '@ionic/react';
import { getMimeType, showError } from "../util";
import { RecoilState, useRecoilState } from "recoil";
import { User, userState } from "../state/user";
import { checkAllFilesSame } from "../../../react-file-manager/src/utils/checkAllFilesSame";
import { driveState, IFile, IFolder, _navState, NavState, ROOT_FOLDER } from "../state/nav";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;







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

const Manager = () => {
  const [files, setFiles] = useRecoilState(driveState);
  const [user,_] = useRecoilState<User>(userState as RecoilState<User>)
  const [navState, setNavState] = useRecoilState(_navState);
  const { currentFolder } = navState;
  const [searchQuery, setSearchQuery] = useState('');
  const [present] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [processingFiles, setProcessingFiles] = useState<{
    isProcessing: boolean;
    currentFile: string;
    progress: { current: number; total: number };
  }>({
    isProcessing: false,
    currentFile: '',
    progress: { current: 0, total: 0 }
  });
  // const [filteredFiles, setFilteredFiles] = useState<(IFile|IFolder)[]>();

  // useEffect(() => {
  //   const filtered = files.filter(file => 
  //     file.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredFiles(filtered);
  // }, [files, searchQuery]);
  const filteredFiles = useMemo(
  () => files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  ),
  [files, searchQuery]
);

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value);

  //   const filteredFiles = files.filter(file => 
  //     file.name.toLowerCase().includes(event.target.value.toLowerCase())
  //   );
  //   setFilteredFiles(filteredFiles);

  // }

  const get_path = (name:string, currentFolder: IFolder) => currentFolder.path + (currentFolder.id == 'root' ? '' : '/') + name

  const fetchFolderFiles = useCallback(
    async (currentFolder: IFolder, masterAesKey: CryptoKey) => {
      if (!user.masterAesKey) {
        return; 
      }
      try {
        const response = await axiosInstance.get(`/api/folders/${currentFolder.id}`, {
        });
        
        const data = response.data; 
        
        
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
  const handleRefresh = async () => {
    setFiles([]);
    if(!user.masterAesKey) return;
    fetchFolderFiles(currentFolder,user.masterAesKey);
  }
  
  const handleAiModeChange = async (selectedFiles: (IFile | IFolder)[], enable : boolean) => {
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
        try {
          // Filter to ensure we only have files
          const filesToProcess = selectedFiles.filter(item => !item.isDirectory) as IFile[];
          
          // Toggle files in backend first
          await axiosInstance.patch(`/api/files/toggle/`, {
            file_ids : filesToProcess.map(f => f.id),
            value: true,
          });

          // Start non-blocking AI processing (only /ingest)
          processFilesInBackground(filesToProcess);
        } catch (error) {
          console.error("Error toggling files:", error);
          present(showError());
        }
      }
      else { // Disabling AI for files
        try {
          // Filter to ensure we only have files
          const filesToProcess = selectedFiles.filter(item => !item.isDirectory) as IFile[];
          
          await presentLoading({
            message: `Disabling AI for ${filesToProcess.length} file${filesToProcess.length > 1 ? 's' : ''}...`,
            duration: 0,
          });

          console.log("Notifying backend")
          await axiosInstance.patch(`/api/files/toggle/`, {
            file_ids : filesToProcess.map(f => f.id),
            value: false,
          })
          console.log("Notified backend")

          await dismissLoading();
          await present({
            message: `AI disabled successfully for ${filesToProcess.length} file${filesToProcess.length > 1 ? 's' : ''}!`,
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
        } catch (error) {
          console.error(error);
          await dismissLoading();
          present(showError());
        }
      }
    }
    else { // Toggling AI for folders
      if(enable){
        try {
          // Filter to ensure we only have folders
          const foldersToProcess = selectedFiles.filter(item => item.isDirectory) as IFolder[];
          
          // await Promise.all(foldersToProcess.map(folder => axiosInstance.put(`/api/folders/${folder.id}/set_folder_ai/`, {
          //   value: true,
          // })));

          // Recursively get all files from selected folders and process them
          await processAllFilesInFolders(foldersToProcess);

          await present({
            message: `AI enabled successfully for ${foldersToProcess.length} folder${foldersToProcess.length > 1 ? 's' : ''}!`,
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
        } catch (error) {
          console.error("Error enabling AI for folders:", error);
          present(showError());
        }
      }
      else {
        try {
          // Filter to ensure we only have folders
          const foldersToProcess = selectedFiles.filter(item => item.isDirectory) as IFolder[];
          
          await Promise.all(foldersToProcess.map(folder => axiosInstance.put(`/api/folders/${folder.id}/set_folder_ai/`, {
            value: false,
          })));

          await present({
            message: `AI disabled successfully for ${foldersToProcess.length} folder${foldersToProcess.length > 1 ? 's' : ''}!`,
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
        } catch (error) {
          console.error("Error disabling AI for folders:", error);
          present(showError());
        }
      }
    }
    const updatedFiles = files.map((file) =>
      selectedFiles.find(f => file.path.startsWith(f === null ? "/" : f.path) && !file.isDirectory)
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
  
  // Non-blocking background processing for AI enabling (only /ingest)
  const processFilesInBackground = async (selectedFiles: IFile[]) => {
    try {
      // Set initial processing state
      setProcessingFiles({
        isProcessing: true,
        currentFile: 'Initializing...',
        progress: { current: 0, total: selectedFiles.length }
      });

      const processedFiles: IFile[] = [];
      let hasError = false;

      // Process files one by one (only /ingest)
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(i)
        try {
          // Update progress
          setProcessingFiles({
            isProcessing: true,
            currentFile: file.name,
            progress: { current: i + 1, total: selectedFiles.length }
          });

          const formData = new FormData();
          const data = {
            file_id : file.id,
          }
          
          console.log(`Decrypting file: ${file.name}...`)
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
                'Content-Type': 'multipart/form-data',
              }
            },
          )
          console.log(`Processed file: ${file.name}`)
          processedFiles.push(file);
          
        } catch (fileError: any) {
          console.error(`Error processing file ${file.name}:`, fileError);
          hasError = true;
          
          // Extract error message from the response
          let errorMessage = 'Unknown error occurred';
          if (fileError?.response?.data?.detail) {
            errorMessage = fileError.response.data.detail;
          }
              
          // Reset processing state immediately
          setProcessingFiles({
            isProcessing: false,
            currentFile: '',
            progress: { current: 0, total: 0 }
          });

          // Show specific error message
          await present({
            message: `Failed to process "${file.name}": ${errorMessage}`,
            duration: 5000,
            color: 'danger',
            position: 'bottom'
          });
          
        }
      }

      // If there was an error, revert AI state for all files that were already toggled
      if (hasError) {
        console.log("Reverting AI state due to processing error...");
        
        try {
          await axiosInstance.patch(`/api/files/toggle/`, {
            file_ids : selectedFiles.map(f => f.id),
            value: false,
          });
          
          // Update local state to reflect reverted AI status
          setFiles(prevFiles => prevFiles.map(f => {
            const toRevert = selectedFiles.find(sf => sf.id === f.id);
            return toRevert ? { ...f, ai_enabled: false } : f;
          }));
          
          console.log("Successfully reverted AI state");
          
          // Show additional revert confirmation
          await present({
            message: `AI settings have been reverted for all files.`,
            duration: 3000,
            color: 'warning',
            position: 'bottom'
          });
          
        } catch (revertError) {
          console.error("Failed to revert AI state:", revertError);
          
          // Show revert failure message
          await present({
            message: `Failed to revert AI settings. Please refresh and try again.`,
            duration: 4000,
            color: 'danger',
            position: 'bottom'
          });
        }

        return;
      }

      // Complete processing successfully
      setProcessingFiles({
        isProcessing: false,
        currentFile: '',
        progress: { current: 0, total: 0 }
      });

      // Show success message
      await present({
        message: `AI enabled successfully for ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}!`,
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });

    } catch (error: any) {
      console.error("General error in AI processing:", error);
      
      // Extract error message
      let errorMessage = 'Unknown error occurred';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Try to revert AI state for all selected files
      try {
        console.log("Reverting AI state due to general error...");
        await axiosInstance.patch(`/api/files/toggle/`, {
          file_ids : selectedFiles.map(f => f.id),
          value: false,
        });
        console.log("Successfully reverted AI state");
      } catch (revertError) {
        console.error("Failed to revert AI state:", revertError);
      }
      
      // Reset processing state
      setProcessingFiles({
        isProcessing: false,
        currentFile: '',
        progress: { current: 0, total: 0 }
      });
      
      // Show specific error message
      await present({
        message: `AI processing failed: ${errorMessage}. Settings have been reverted.`,
        duration: 5000,
        color: 'danger',
        position: 'bottom'
      });
    }
  };
  
  // Recursive function to get all files from folders and subfolders
  const getAllFilesFromFolder = async (folderId: string): Promise<IFile[]> => {
    try {
      const response = await axiosInstance.get(`/api/folders/${folderId}`);
      const data = response.data;
      
      let allFiles: IFile[] = [];
      
      // Process files in current folder
      if (data.files && data.files.length > 0) {
        const folderFiles = await Promise.all(
          data.files.map(async (file: any) => {
            const name = await decryptFileName(file.name_encrypted, user.masterAesKey);
            return {
              ...file,
              name,
              isDirectory: false,
              path: get_path(name, { ...data, id: folderId }),
              size: file.file_size,
              download_url: file.download_url,
              updatedAt: file.updated_at,
              ai_enabled: file.ai_enabled,
            } as IFile;
          })
        );
        allFiles = [...allFiles, ...folderFiles];
      }
      
      // Recursively process subfolders
      if (data.folders && data.folders.length > 0) {
        for (const subfolder of data.folders) {
          const subfolderFiles = await getAllFilesFromFolder(subfolder.id);
          allFiles = [...allFiles, ...subfolderFiles];
        }
      }
      
      return allFiles;
    } catch (error) {
      console.error(`Error fetching files from folder ${folderId}:`, error);
      return [];
    }
  };

  // Process all files in selected folders
  const processAllFilesInFolders = async (selectedFolders: IFolder[]) => {
    try {
      let allFiles: IFile[] = [];
      
      // Get all files from all selected folders recursively
      for (const folder of selectedFolders) {
        const folderFiles = await getAllFilesFromFolder(folder.id);
        allFiles = [...allFiles, ...folderFiles];
      }
      
      if (allFiles.length === 0) {
        await present({
          message: `No files found in selected folder${selectedFolders.length > 1 ? 's' : ''}.`,
          duration: 2000,
          color: 'warning',
          position: 'bottom'
        });
        return;
      }

      // Filter out files that are already AI enabled to avoid reprocessing
      const filesToProcess = allFiles.filter(file => !file.ai_enabled);
      console.log(allFiles)
      
      if (filesToProcess.length === 0) {
        await present({
          message: `All files in selected folder${selectedFolders.length > 1 ? 's' : ''} are already AI enabled.`,
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        return;
      }

      // Show initial notification
      await present({
        message: `Found ${filesToProcess.length} file${filesToProcess.length > 1 ? 's' : ''} to process from ${selectedFolders.length} folder${selectedFolders.length > 1 ? 's' : ''}.`,
        duration: 3000,
        color: 'primary',
        position: 'bottom'
      });

      // Toggle all files to AI enabled first
      await axiosInstance.patch(`/api/files/toggle/`, {
        file_ids: filesToProcess.map(f => f.id),
        value: true,
      });

      // Process all files using the existing background function
      await processFilesInBackground(filesToProcess);
      
    } catch (error) {
      console.error("Error processing files in folders:", error);
      present(showError());
    }
  };

  const handleFolderChange = () => {
    // if(folder && folder.id != currentFolder.id){
      setSearchQuery('');
    // }
  }
  const handleDelete = async (selectedFiles : (IFile|IFolder)[]) => {
    const allFiles = checkAllFilesSame(selectedFiles);
    try {
      if(allFiles){
        await axiosInstance.delete(`/api/files/bulk_delete/`, {data: {file_ids : selectedFiles.map(f => f.id)}});
      }
      else {
        await Promise.all(selectedFiles.map(file => {
          if(file.isDirectory){
            return axiosInstance.delete(`/api/folders/${file.id}/`)
          }
          else {
            return axiosInstance.delete(`/api/files/${file.id}/`)
          }
        }))
      }
      setFiles(currFiles => currFiles.filter(f => !selectedFiles.some(sf => sf.id == f.id)))
    }
    catch (error) {
      console.error("Error deleting files:", error);
      present(showError());
    }
  }
  return (
    <>
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
          files={filteredFiles}
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
          height="20vh"
          onRefresh={handleRefresh}
          onFileOpen={(file : IFile) => {
            setNavState({...navState, currentFileOpened : file})
          }}
          onFolderChange={handleFolderChange}
          searchValue={searchQuery}
          setSearchValue={setSearchQuery}

          // onModalClose={onModalClose}
          onDelete={handleDelete}
          // onModalClose={() => {
          //   if(navState.currentFileOpened != null) setNavState({...navState, currentFileOpened : null});
          // }}
        />
        
        {/* AI Processing Progress Indicator */}
        {processingFiles.isProcessing && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '280px',
            maxWidth: '350px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#5C51AB',
                marginRight: '8px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              AI Processing Files
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              marginBottom: '8px'
            }}>
              {processingFiles.currentFile}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#888'
            }}>
              <span>Progress: {processingFiles.progress.current}/{processingFiles.progress.total}</span>
              <span>{Math.round((processingFiles.progress.current / processingFiles.progress.total) * 100)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(processingFiles.progress.current / processingFiles.progress.total) * 100}%`,
                height: '100%',
                backgroundColor: '#5C51AB',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
    </>
      
  );
};

export default Manager;
