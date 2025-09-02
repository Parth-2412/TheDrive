import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { 
  chatbubbleEllipsesOutline, 
  closeOutline, 
  ellipsisVerticalOutline,
  sendOutline
} from 'ionicons/icons';
import '@ionic/react/css/core.css';
import { ChatMessage, ProChat } from '@ant-design/pro-chat';
import Manager from '../pages/Manager';
import './Chat.css'
import { createGesture } from '@ionic/react';
import { aiNodeInstance } from '../services/api.service'; // Assume this is your configured axios instance
import { useRecoilState } from 'recoil';
import { _navState, driveState, IFile, IFolder } from '../state/nav';

// Types


interface Citation {
  source_id: number;
  file_name: string;
  file_id: string;
  chunk_index: number;
  char_start: number;
  char_end: number;
  similarity: number;
  chunk_content: string;
}

interface ChatResponse {
  session_id: string;
  query: string;
  answer: string;
  citations: Citation[];
  context_chunks_used: number;
}

interface SessionResponse {
  session_id: string;
  chunks_loaded: number;
}

// Custom hook for chat session management
const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(async (entity : IFile | IFolder) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = entity.isDirectory ? {
        files: [],
        folder_id : entity.id,
      } : {
        files : [entity.id],
        folder_id : "",
      }
      const response = await aiNodeInstance.post<SessionResponse>('/chat/start',payload);
      
      setSessionId(response.data.session_id);
      return response.data;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Failed to start chat session';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeSession = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      await aiNodeInstance.post('/chat/close', {
        session_id: sessionId
      });
      setSessionId(null);
    } catch (err) {
      console.error('Failed to close session:', err);
    }
  }, [sessionId]);

  const sendMessage = useCallback(async (message: string): Promise<ChatResponse> => {
    if (!sessionId) {
      throw new Error('No active chat session');
    }

    const response = await aiNodeInstance.post<ChatResponse>('/chat', {
      session_id: sessionId,
      query: message
    });

    return response.data;
  }, [sessionId]);

  return {
    sessionId,
    isLoading,
    error,
    startSession,
    closeSession,
    sendMessage,
    clearError: () => setError(null)
  };
};

// Chat Component
const Chat = () => {

  const [{ currentFolder, currentFileOpened }]= useRecoilState(_navState)
  const [currentContext, setCurrentContext] = useState<IFile | IFolder | null>(null);
  const currentPath = currentFileOpened || currentFolder;

  const {
    sessionId,
    isLoading: sessionLoading,
    error: sessionError,
    startSession,
    closeSession,
    sendMessage,
    clearError
  } = useChatSession();

  const [isTyping, setIsTyping] = useState(false);

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        closeSession();
      }
    };
  }, [sessionId, closeSession]);

  const handleSendMessage = async (content: ChatMessage[]): Promise<any> => {
  

    setIsTyping(true);
    console.log(content)
    try {
      if(!currentContext){
        await startSession(currentPath)
        setCurrentContext(currentPath)
      }
      const response = await sendMessage(content[-1].content?.toString() as string);
      
      // Format response with citations if available
      let formattedResponse = response.answer;
      if (response.citations && response.citations.length > 0) {
        formattedResponse += '\n\n**Sources:**\n';
        response.citations.forEach((citation, index) => {
          formattedResponse += `${index + 1}. ${citation.file_name} (similarity: ${(citation.similarity * 100).toFixed(1)}%)\n`;
        });
      }
      
      return {
        id: Date.now().toString(),
        content: formattedResponse,
        createAt: Date.now(),
        role: 'assistant' as const
      };
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg = error?.response?.data?.detail || error.message || 'Failed to send message';
      return {
        id: Date.now().toString(),
        content: `❌ Error: ${errorMsg}`,
        createAt: Date.now(),
        role: 'assistant' as const
      };
    } finally {
      setIsTyping(false);
    }
  };
  console.log(isTyping);
  const getHelloMessage = () => {
    if (sessionLoading) {
      return "Initializing chat session...";
    }
    if (sessionError) {
      return `Error: ${sessionError}`;
    }
    if (!sessionId) {
      return "Start chatting!";
    }
  };

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
              {currentContext && currentContext !== currentPath && (
                <IonButton 
                  className="context-switch-button" 
                  size="small" 
                  fill="clear"
                  onClick={async () => {
                      await startSession(currentPath)
                      setCurrentContext(currentPath)
                  }}
                >
                  Switch to Current
                </IonButton>
              )}
            </IonButton>
            <IonButton shape="round">

                <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        <div className="context-container">
          <span className='context-row'>Context: </span>
          <span className="context-value">{currentContext?.path}</span>
          {sessionLoading && <IonSpinner name="crescent" />}
        </div>
      </IonHeader>
      
      <IonContent>
        <ProChat
          request={handleSendMessage}
          locale='en-US'
          displayMode='chat'
          helloMessage={getHelloMessage()}
          //@ts-expect-error
          disabled={!sessionId || sessionLoading}
          placeholder={
            sessionLoading ? "Initializing..." : 
            "Start chatting!"
          }
        />
      </IonContent>
      
      <IonToast
        isOpen={!!sessionError}
        message={sessionError || ''}
        duration={5000}
        color="danger"
        onDidDismiss={clearError}
        buttons={[
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ]}
      />
    </IonPage>
  );
};

// Main App Component with Responsive Chat
const ChatApp: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Setup drag gesture for mobile
  useEffect(() => {
    if (!dragRef.current) return;
    
    const gesture = createGesture({
      el: dragRef.current,
      gestureName: 'drag-chat',
      direction: 'y',
      threshold: 15,
      onMove: (event) => {
        if (event.deltaY > 40) {
          setIsChatOpen(false);
        }
      }
    });

    gesture.enable();
    return () => gesture.destroy();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };


  return (
    <>
      {!isDesktop && isChatOpen && (
        <style>
          {`
            @media (max-width: 768px) {
              .file-explorer {
                height: calc(100vh - var(--chat-height)) !important;
              }
            }
          `}
        </style>
      )}
      
      <IonSplitPane when="md">
        <Manager />
        
        {isDesktop ? (
          <IonMenu type="overlay" side='end'>
            <div id="main" className="main-content">
              <Chat />
            </div>
          </IonMenu>
        ) : (
          <>
            <div className={`chat-mobile ${isChatOpen ? 'open' : ''}`}>
              <div className="chat-mobile-handle" ref={dragRef}>
                <span />
              </div>
              
              
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Chat />
              </div>
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