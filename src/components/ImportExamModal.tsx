import React, { useState } from 'react';
import { X, Upload, FileText, Loader2 } from 'lucide-react';

interface ImportExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (name: string, description: string, examText: string, answerKey: string) => Promise<boolean>;
}

export const ImportExamModal: React.FC<ImportExamModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [examText, setExamText] = useState('');
  const [answerKey, setAnswerKey] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    setError('');
    
    if (!examName.trim()) {
      setError('Lütfen sınav adı girin.');
      return;
    }
    if (!examText.trim()) {
      setError('Lütfen sınav sorularını yapıştırın.');
      return;
    }
    if (!answerKey.trim()) {
      setError('Lütfen cevap anahtarını yapıştırın.');
      return;
    }

    setIsImporting(true);
    
    try {
      const success = await onImport(examName, examDescription, examText, answerKey);
      if (success) {
        // Reset form
        setExamName('');
        setExamDescription('');
        setExamText('');
        setAnswerKey('');
        onClose();
      } else {
        setError('Sınav eklenirken bir hata oluştu. Lütfen format kontrolü yapın.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content import-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Upload size={24} />
            Yeni Sınav Ekle
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="examName">
              <FileText size={16} />
              Sınav Adı *
            </label>
            <input
              id="examName"
              type="text"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="Örn: Genel İngilizce Sınavı 1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="examDescription">Açıklama (İsteğe bağlı)</label>
            <input
              id="examDescription"
              type="text"
              value={examDescription}
              onChange={e => setExamDescription(e.target.value)}
              placeholder="Örn: 120 soruluk genel İngilizce testi"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="examText">
              Sınav Soruları *
              <span className="hint">Soruları aşağıdaki formatta yapıştırın</span>
            </label>
            <textarea
              id="examText"
              value={examText}
              onChange={e => setExamText(e.target.value)}
              placeholder={`1 Hello. My name _________ David.
A am
B is
C are

2 I _________ from Italy.
A come
B am
C do

...`}
              rows={12}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="answerKey">
              Cevap Anahtarı *
              <span className="hint">Cevapları herhangi bir formatta yapıştırabilirsiniz</span>
            </label>
            <textarea
              id="answerKey"
              value={answerKey}
              onChange={e => setAnswerKey(e.target.value)}
              placeholder={`1. B
2. B
3. A
...

veya

1–10: B, B, A, A, A, B, A, C, B, B
11–20: A, B, B, B, B, C, A, B, C, B`}
              rows={8}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isImporting}>
            İptal
          </button>
          <button className="import-btn" onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 size={18} className="spinner" />
                Ekleniyor...
              </>
            ) : (
              <>
                <Upload size={18} />
                Sınavı Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


