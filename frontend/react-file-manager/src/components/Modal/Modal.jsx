import { MdClose } from "react-icons/md";
import { useEffect } from "react";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./Modal.scss";

const Modal = ({
  children,
  show,
  setShow,
  heading,
  dialogWidth = "25%",
  contentClassName = "",
  closeButton = true,
  onModalClose = () => {},
}) => {
  const t = useTranslation();

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fm-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className={`fm-modal-content ${contentClassName}`}
        style={{ width: dialogWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fm-modal-header">
          <span className="fm-modal-heading">{heading}</span>
          {closeButton && (
            <MdClose
              size={18}
              onClick={() => {setShow(false); onModalClose();}}
              className="close-icon"
              title={t("close")}
            />
          )}
        </div>
        <div className="fm-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
