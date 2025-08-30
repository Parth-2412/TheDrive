import React, { useEffect, useState } from 'react';
import { IonButton, IonInput, IonLabel, IonItem, IonText, IonSpinner, IonIcon } from '@ionic/react';
import { clipboard } from 'ionicons/icons';  // Import IonIcon for copy
import { showError } from '../util';  // Assuming showError is a utility function
import './MnemonicForm.css';

const MnemonicForm: React.FC<{
    onClick ?: (mnemonic: string[], passphrase: string) => any;
    loading ?: boolean;
    initialMnemonic ?: string[];
    buttonText : string;
    copy?: boolean;
}> = ({ onClick = () => {}, loading = false, initialMnemonic = new Array(12).fill(''), buttonText, copy = false} ) => {
  const [mnemonic, setMnemonic] = useState<string[]>(initialMnemonic);
  const [passphrase, setPassphrase] = useState('');
  const [index, setIndex] = useState(0);

  // Ensure mnemonic state updates when initialMnemonic changes
  useEffect(() => {
      setMnemonic(initialMnemonic);
  }, [initialMnemonic.join(' ')]);

  // Handle mnemonic change and auto-focus behavior
  const handleMnemonicChange = (index: number, value: string) => {
    // Clean up the input by trimming whitespace and removing extra spaces
    const cleanValue = value.trim().replace(/\s+/g, ' ');
    const newMnemonic = [...mnemonic];
    newMnemonic[index] = cleanValue;
    setMnemonic(newMnemonic);
  };

  // Handle copy to clipboard for the entire mnemonic
  const handleCopyMnemonic = () => {
    const mnemonicString = mnemonic.join(' ');  // Join all words to form the mnemonic string
    navigator.clipboard.writeText(mnemonicString)  // Use Clipboard API to copy the mnemonic
      .then(() => showError('Mnemonic copied to clipboard!'))  // Show success message
      .catch((err) => showError('Failed to copy mnemonic: ' + err));  // Handle any errors
  };

  // Handle keydown events for space and enter to shift focus
  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      if(index == 11) return;
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    //@ts-expect-error
      document.getElementById(`word-${index}`)?.setFocus()
  }, [index])
  const handlePaste = (event : React.ClipboardEvent<Element>) => {
    event.preventDefault()
    const new_arr = event.clipboardData.getData('text').split(' ');
    if(new_arr.length != 12) return;
    setMnemonic(new_arr)
  }
  return (
    <div className="mnemonic-container">
      <IonItem onPaste={handlePaste} >
        <IonLabel position="floating">12-Word Mnemonic</IonLabel>
        <div
          className="mnemonic-grid"
        >
          {mnemonic.map((word, index) => (
            <IonInput
              key={index}
              id={`word-${index}`}
              value={word}
              onIonInput={(e) => handleMnemonicChange(index, e.detail.value!)}
              onKeyDown={(e) => handleKeyDown(index, e)}  // Handle space/enter keydown events
              onFocus={() => setIndex(index)}
              placeholder={`Word ${index + 1}`}
              maxlength={12}  // Limit to 12 characters per word
              style={{ textAlign: 'center' }}
              onPaste={handlePaste}
            />
          ))}
        </div>
      </IonItem>

      {copy && <IonButton className='copy_mnemonic' fill='clear' expand='block' onClick={handleCopyMnemonic} disabled={loading}>
        <IonIcon slot="start" icon={clipboard} /> {/* Add the copy icon */}
        Copy Mnemonic
      </IonButton>}
      <IonItem className='placeholder_item'>
        <IonInput
          type="password"
          value={passphrase}
          onIonChange={(e) => setPassphrase(e.detail.value!)}
          placeholder="Enter passphrase"
          class="placeholder"
        />
      </IonItem>

      {/* Add a button to copy the entire mnemonic */}

      <IonButton expand='block' onClick={() => onClick(mnemonic, passphrase)} disabled={loading}>
        {loading ? (
          <IonSpinner name="crescent" /> // Show spinner inside the button when loading
        ) : (
          buttonText
        )}
      </IonButton>
    </div>
  );
};

export default MnemonicForm;
