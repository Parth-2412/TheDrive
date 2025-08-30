import React from 'react';
import './AIMode.action.scss'; // We'll create this for styling

const AIModeAction = () => {
  // You can access selected files here using the SelectionContext if needed
  // import { useSelection } from '../../../contexts/SelectionContext';
  // const { selectedFiles } = useSelection();

  return (
    <div className="ai-mode-container">
      <h3>✨ AI Mode Activated</h3>
      <p>Perform AI-powered actions on the selected files here.</p>
      {/* Example: Add a button to summarize a text file */}
      <button className="ai-button">Summarize Text</button>
    </div>
  );
};

export default AIModeAction;