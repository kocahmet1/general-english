import React from 'react';
import { Settings, Plus, Trash2, FileText, ArrowLeft, Database, Upload } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
}

interface AdminPageProps {
  exams: Exam[];
  onBack: () => void;
  onImportExam: () => void;
  onDeleteExam: (examId: string) => void;
  onLoadSampleExam: () => void;
  useFirebase: boolean;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  exams,
  onBack,
  onImportExam,
  onDeleteExam,
  onLoadSampleExam,
  useFirebase
}) => {
  const handleDeleteClick = (examId: string, examName: string) => {
    if (window.confirm(`"${examName}" sınavını silmek istediğinizden emin misiniz?`)) {
      onDeleteExam(examId);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Geri Dön</span>
        </button>
        <div className="admin-title">
          <Settings size={28} />
          <h1>Yönetim Paneli</h1>
        </div>
      </div>

      <div className="admin-content">
        {/* Add Exam Section */}
        <section className="admin-section">
          <div className="section-header">
            <div className="section-title">
              <Upload size={22} />
              <h2>Sınav Ekle</h2>
            </div>
            <p className="section-description">
              Yeni sınav ekleyerek öğrencilerin pratik yapmasını sağlayın.
            </p>
          </div>

          <div className="action-cards">
            <button className="action-card primary" onClick={onImportExam}>
              <div className="action-icon">
                <Plus size={32} />
              </div>
              <div className="action-content">
                <h3>Sınav Ekle</h3>
                <p>Metin formatında sınav sorularını içe aktarın</p>
              </div>
            </button>

            <button className="action-card secondary" onClick={onLoadSampleExam}>
              <div className="action-icon">
                <Database size={32} />
              </div>
              <div className="action-content">
                <h3>Örnek Sınav Yükle</h3>
                <p>120 soruluk hazır örnek sınavı yükleyin</p>
              </div>
            </button>
          </div>
        </section>

        {/* Exam Management Section */}
        <section className="admin-section">
          <div className="section-header">
            <div className="section-title">
              <FileText size={22} />
              <h2>Sınav Yönetimi</h2>
            </div>
            <p className="section-description">
              Mevcut sınavları görüntüleyin ve yönetin. 
              <span className="storage-badge">
                {useFirebase ? '☁️ Firebase' : '💾 Yerel Depolama'}
              </span>
            </p>
          </div>

          {exams.length === 0 ? (
            <div className="empty-exams">
              <FileText size={48} />
              <p>Henüz sınav eklenmemiş</p>
              <button onClick={onImportExam}>İlk Sınavı Ekle</button>
            </div>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => (
                <div key={exam.id} className="exam-item">
                  <div className="exam-info">
                    <div className="exam-name">{exam.name}</div>
                    {exam.description && (
                      <div className="exam-description">{exam.description}</div>
                    )}
                    <div className="exam-meta">
                      <span className="question-count">{exam.questionCount} soru</span>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(exam.id, exam.name)}
                    title="Sınavı Sil"
                  >
                    <Trash2 size={18} />
                    <span>Sil</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="admin-section stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{exams.length}</div>
              <div className="stat-label">Toplam Sınav</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {exams.reduce((acc, exam) => acc + exam.questionCount, 0)}
              </div>
              <div className="stat-label">Toplam Soru</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {useFirebase ? 'Bulut' : 'Yerel'}
              </div>
              <div className="stat-label">Depolama</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

