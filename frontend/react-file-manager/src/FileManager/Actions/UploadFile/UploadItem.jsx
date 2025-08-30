import { AiOutlineClose } from "react-icons/ai";
import Progress from "../../../components/Progress/Progress";
import { getFileExtension } from "../../../utils/getFileExtension";
import { useFileIcons } from "../../../hooks/useFileIcons";
import { FaRegFile } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { getDataSize } from "../../../utils/getDataSize";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useFiles } from "../../../contexts/FilesContext";
import { useTranslation } from "../../../contexts/TranslationProvider";
import axiosInstance from "../../../../../app/src/services/api.service"; // Import your Axios instance
import encryptFile from '../../../../../app/src/services/encrypt.service';

const UploadItem = ({
  index,
  fileData,
  setFiles,
  setIsUploading,
  fileUploadConfig,
  onFileUploaded,
  handleFileRemove,
  masterAesKey,
  onFileUpload // New prop to handle file upload outside this component
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const fileIcons = useFileIcons(33);
  const { onError } = useFiles();
  const t = useTranslation();

  const handleUploadError = (error) => {
    setUploadProgress(0);
    setIsUploading((prev) => ({
      ...prev,
      [index]: false,
    }));
    const errorMessage = {
      type: "upload",
      message: t("uploadFail"),
      error: error,
    };

    setFiles((prev) =>
      prev.map((file, i) => {
        if (index === i) {
          return {
            ...file,
            error: errorMessage.message,
          };
        }
        return file;
      })
    );

    setUploadFailed(true);
    onError(errorMessage, fileData.file);
  };

  const fileUpload = (fileData) => {
    if (!!fileData.error) return;

    setIsUploading((prev) => ({
      ...prev,
      [index]: true,
    }));

    // Encrypt the file and send the encrypted data as JSON payload
    encryptFile(fileData.file, masterAesKey)
      .then((encryptedData) => {
        const payload = {
          file_data: encryptedData.ciphertext,
          file_iv: encryptedData.file_iv,
          key_encrypted: encryptedData.wrapped_key,
          key_encrypted_iv: encryptedData.wrap_iv,
          name_encrypted: encryptedData.filename,
          mime: encryptedData.mime,
        };
        const jsonData = JSON.stringify(payload);

        // Use Axios to send the encrypted data
        axiosInstance
          .post(fileUploadConfig?.url, jsonData, {
            headers: {
              "Content-Type": "application/json",
              ...fileUploadConfig?.headers, // Add any other headers
            },
          })
          .then((response) => {
            setIsUploaded(true);
            onFileUploaded(response.data);
            setIsUploading((prev) => ({
              ...prev,
              [index]: false,
            }));
          })
          .catch((error) => {
            setIsUploading((prev) => ({
              ...prev,
              [index]: false,
            }));
            handleUploadError(error);
          });
      })
      .catch((error) => {
        setIsUploading((prev) => ({
          ...prev,
          [index]: false,
        }));
        handleUploadError(error);
      });
  };

  useEffect(() => {
    fileUpload(fileData);
  }, []);

  const handleAbortUpload = () => {
    // Handle cancel logic if needed
    setIsUploading((prev) => ({
      ...prev,
      [index]: false,
    }));
    setIsCanceled(true);
    setUploadProgress(0);
  };

  const handleRetry = () => {
    if (fileData?.file) {
      setFiles((prev) =>
        prev.map((file, i) => {
          if (index === i) {
            return {
              ...file,
              error: false,
            };
          }
          return file;
        })
      );
      fileUpload({ ...fileData, error: false });
      setIsCanceled(false);
      setUploadFailed(false);
    }
  };

  // File was removed by the user because it was unsupported or exceeds file size limit.
  if (!!fileData.removed) {
    return null;
  }

  return (
    <li>
      <div className="file-icon">
        {fileIcons[getFileExtension(fileData.file?.name)] ?? <FaRegFile size={33} />}
      </div>
      <div className="file">
        <div className="file-details">
          <div className="file-info">
            <span className="file-name text-truncate" title={fileData.file?.name}>
              {fileData.file?.name}
            </span>
            <span className="file-size">{getDataSize(fileData.file?.size)}</span>
          </div>
          {isUploaded ? (
            <FaRegCheckCircle title={t("uploaded")} className="upload-success" />
          ) : isCanceled || uploadFailed ? (
            <IoMdRefresh className="retry-upload" title="Retry" onClick={handleRetry} />
          ) : (
            <div
              className="rm-file"
              title={`${!!fileData.error ? t("Remove") : t("abortUpload")}`}
              onClick={!!fileData.error ? () => handleFileRemove(index) : handleAbortUpload}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>
        <Progress
          percent={uploadProgress}
          isCanceled={isCanceled}
          isCompleted={isUploaded}
          error={fileData.error}
        />
      </div>
    </li>
  );
};

export default UploadItem;
