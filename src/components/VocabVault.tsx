import React, { useState } from 'react';
import { BookOpen, Trash2, Search, X, ChevronLeft } from 'lucide-react';
import { VocabWord } from '../types';

interface VocabVaultProps {
  isOpen: boolean;
  onClose: () => void;
  vocabWords: VocabWord[];
  onRemoveWord: (wordId: string) => void;
}

export const VocabVault: React.FC<VocabVaultProps> = ({
  isOpen,
  onClose,
  vocabWords,
  onRemoveWord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredWords = vocabWords.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.questionContext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (wordId: string) => {
    if (confirmDelete === wordId) {
      onRemoveWord(wordId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(wordId);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vocab-vault-panel">
      <div className="vault-header">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <h2>
          <BookOpen size={24} />
          Kelime Kasası
        </h2>
        <span className="word-count">{vocabWords.length} kelime</span>
      </div>
      
      <div className="vault-search">
        <Search size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Kelime ara..."
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="vault-content">
        {filteredWords.length === 0 ? (
          <div className="empty-vault">
            {searchTerm ? (
              <p>"{searchTerm}" için sonuç bulunamadı.</p>
            ) : (
              <>
                <BookOpen size={48} />
                <h3>Kelime Kasanız Boş</h3>
                <p>Sınavlarda yanlış yaptığınız sorulardaki kelimeleri buraya ekleyebilirsiniz.</p>
              </>
            )}
          </div>
        ) : (
          <div className="vocab-list">
            {filteredWords.map(word => (
              <div key={word.id} className="vocab-item">
                <div className="vocab-word-header">
                  <h3 className="vocab-word">{word.word}</h3>
                  <button
                    className={`delete-btn ${confirmDelete === word.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(word.id)}
                    title={confirmDelete === word.id ? 'Silmek için tekrar tıklayın' : 'Sil'}
                  >
                    {confirmDelete === word.id ? (
                      <span>Emin misiniz?</span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
                <p className="vocab-context">
                  <span className="context-label">Soru bağlamı:</span>
                  {word.questionContext}
                </p>
                <span className="vocab-date">
                  {new Date(word.addedAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


