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

// Chat Component
const Chat: React.FC = () => {
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
        <Manager />
        {isDesktop ? (<IonMenu type="overlay" side='end'>
            <div id="main" className="main-content">
            <Chat />
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