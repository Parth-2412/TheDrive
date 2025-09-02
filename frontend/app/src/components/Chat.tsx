import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonSplitPane,
  IonLabel,
} from '@ionic/react';
import { 
  chatbubbleEllipsesOutline, 
  closeOutline, 
  ellipsisVerticalOutline
} from 'ionicons/icons';
import '@ionic/react/css/core.css';
import { ProChat } from '@ant-design/pro-chat';
import Manager from '../pages/Manager';
import './Chat.css'
import { createGesture } from '@ionic/react';
import { set } from 'js-cookie';

// Chat Component
const Chat = ({currentContext, currentFolderPath, onSwitchToCurrentContext}: {
  currentContext: string;
  currentFolderPath: string;
  onSwitchToCurrentContext: () => void;
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>AI Assistant</IonTitle>
          <IonButtons slot="end">
            <IonButton shape='round' fill="clear">
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        <div className="context-container">
          <div className="context-row">
            <IonLabel className="context-label">
              Current Folder:
            </IonLabel>
            <span className="context-value">{currentFolderPath}</span>
          </div>
          
          <div className="context-row">
            <IonLabel className="context-label">
              AI Context:
            </IonLabel>
            <span className="context-value">{currentContext}</span>
            {currentContext !== currentFolderPath ? <IonButton 
              className="context-switch-button" 
              size="small" 
              fill="outline"
              onClick={onSwitchToCurrentContext}
            >
              Switch to Current
            </IonButton> : ''}
          </div>
        </div>
      </IonHeader>
      
      <IonContent>
        <ProChat
          request={async (messages) => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return "bakchod"; // Your actual implementation here
          }}
          locale='en-US'
          displayMode='chat'
        />
      </IonContent>
    </IonPage>
  );
};

// Main App Component with Responsive Chat
const ChatApp: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentContext, setCurrentContext] = useState('/');
  const [currentFolderPath, setCurrentFolderPath] = useState('/');
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!dragRef.current) return;
    const gesture = createGesture({
      el: dragRef.current,
      gestureName: 'drag-chat',
      direction: 'y',
      threshold: 15,
      onMove: (event) => {
        if (event.deltaY > 40) {
          setIsChatOpen(false)
        }
      },
      onEnd: () => {
        // Optional: Add logic to handle the end of the gesture
      },
    });

    gesture.enable();

    return () => {
      gesture.destroy();
    };
  }, [dragRef.current]);
  
  const handleSetCurrentContext = (context: string) => {
    setCurrentContext(context);
  };

  const handleSwitchToCurrentContext = () => {
    setCurrentContext(currentFolderPath);
  };

  const handleFolderChange = (folder: any) => {
    console.log('Folder changed:', folder);
    if (folder && folder.path) {
      setCurrentFolderPath(folder.path);
    }
  };

  return (
    <>
      {!isDesktop && isChatOpen &&  <style>
        {`
          @media (max-width: 768px) {
              .file-explorer {
              height: calc(100vh - var(--chat-height)) !important;
            }
          }
        `}
        </style>}
      <IonSplitPane  when="md">
        <Manager 
          currentFolderPath={currentContext} 
          onFolderChange={handleFolderChange}
        />
        {isDesktop ? (<IonMenu type="overlay" side='end'>
            <div id="main" className="main-content">
            <Chat 
              currentContext={currentContext}
              currentFolderPath={currentFolderPath}
              onSwitchToCurrentContext={handleSwitchToCurrentContext}
            />
            </div>
        </IonMenu>) : (

            <>
            
            <div className={`chat-mobile ${isChatOpen ? 'open' : ''}`}>
                <div className="chat-mobile-handle" ref={dragRef}>
                  <span />
                </div>
                <div className="chat-header">
                  <span className="chat-header-title">AI Assistant</span>
                  <button className="close-button" onClick={toggleChat}>
                      <IonIcon icon={closeOutline} />
                  </button>
                </div>
                
                <div className="context-container-mobile">
                  <div className="context-row-mobile">
                    <span className="context-label-mobile">Folder:</span>
                    <span className="context-value-mobile">{currentFolderPath}</span>
                  </div>
                  <div className="context-row-mobile">
                    <span className="context-label-mobile">Context:</span>
                    <span className="context-value-mobile">{currentContext}</span>
                    {currentContext !== currentFolderPath && (
                      <button 
                        className="context-switch-button-mobile" 
                        onClick={handleSwitchToCurrentContext}
                      >
                        Switch
                      </button>
                    )}
                  </div>
                </div>
                
                <ProChat
                request={async (messages) => {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return "bakchod";
                }}
                locale='en-US'
                displayMode='chat'
                style={{ height : "100%"}}
                />
            </div>

            <button className="fab-chat" onClick={toggleChat}>
                <IonIcon icon={chatbubbleEllipsesOutline} size="large" />
            </button>
        </>
        )}
        
      </IonSplitPane>
      
      

    </>
  );
};

export default ChatApp;