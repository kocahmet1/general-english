import React from 'react';
import { ChevronDown, FileText, Trash2 } from 'lucide-react';

interface ExamOption {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
}

interface ExamSelectorProps {
  exams: ExamOption[];
  selectedExamId: string | null;
  onSelectExam: (examId: string) => void;
  onDeleteExam: (examId: string) => void;
  isLoading: boolean;
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  exams,
  selectedExamId,
  onSelectExam,
  onDeleteExam,
  isLoading
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedExam = exams.find(e => e.id === selectedExamId);

  const handleDeleteClick = (e: React.MouseEvent, examId: string, examName: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`"${examName}" sınavını silmek istediğinizden emin misiniz?`)) {
      onDeleteExam(examId);
      setIsOpen(false);
    }
  };

  return (
    <div className="exam-selector">
      <div className="selector-header">
        <h2>
          <FileText size={24} />
          Sınav Seçin
        </h2>
      </div>
      
      <div className="dropdown-container">
        <button 
          className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-text">Yükleniyor...</span>
          ) : selectedExam ? (
            <span className="selected-exam">
              <span className="exam-name">{selectedExam.name}</span>
              <span className="exam-count">{selectedExam.questionCount} soru</span>
            </span>
          ) : (
            <span className="placeholder">Bir sınav seçin...</span>
          )}
          <ChevronDown size={20} className={`chevron ${isOpen ? 'rotated' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            {exams.length === 0 ? (
              <div className="no-exams">
                <p>Henüz sınav eklenmemiş.</p>
                <p className="no-exams-hint">Yönetim panelinden sınav ekleyebilirsiniz.</p>
              </div>
            ) : (
              exams.map(exam => (
                <div key={exam.id} className={`dropdown-item-wrapper ${exam.id === selectedExamId ? 'selected' : ''}`}>
                  <button
                    className={`dropdown-item ${exam.id === selectedExamId ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectExam(exam.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="exam-info">
                      <span className="exam-name">{exam.name}</span>
                      {exam.description && (
                        <span className="exam-description">{exam.description}</span>
                      )}
                    </div>
                    <span className="exam-count">{exam.questionCount} soru</span>
                  </button>
                  <button
                    className="delete-exam-btn"
                    onClick={(e) => handleDeleteClick(e, exam.id, exam.name)}
                    title="Sınavı Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

