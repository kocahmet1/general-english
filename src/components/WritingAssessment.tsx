import { Award, CheckCircle, Target } from 'lucide-react';
import type { WritingExamAssessment, WritingCriterion } from '../types';

const LABELS: Record<WritingCriterion['id'], string> = {
  taskResponse: 'İçerik ve Soruya Uygunluk',
  coherence: 'Organizasyon ve Fikir Akışı',
  vocabulary: 'Kelime Kullanımı ve Üslup',
  grammar: 'Dilbilgisi ve Cümle Çeşitliliği',
};

export function WritingAssessment({ assessment }: { assessment: WritingExamAssessment }) {
  return (
    <section className="writing-exam-assessment" aria-label="Sınav ölçütlerine göre değerlendirme">
      <h3><Award size={22} />{assessment.examType.toUpperCase()} Ölçütlerine Göre Değerlendirme</h3>
      <p className="writing-assessment-note">Puanlar 100 üzerinden pratik göstergeleridir; resmi IELTS veya TOEFL sınav puanı değildir.</p>
      {!assessment.hasPrompt && <p className="writing-no-prompt">Soru verilmediği için yanıtın soruya uygunluğu değerlendirilemedi. Aşağıdaki analiz dil ve anlatıma odaklanır.</p>}
      <div className="writing-criteria-grid">
        {assessment.criteria.map(criterion => (
          <article key={criterion.id} className="writing-criterion">
            <div className="writing-criterion-title"><h4>{LABELS[criterion.id]}</h4><strong>{criterion.score === null ? '—' : `${criterion.score}/100`}</strong></div>
            <p>{criterion.feedback}</p>
            <div className="writing-criterion-evidence"><strong>Yanıtınızdaki durum</strong><p>{criterion.evidence}</p></div>
            <div className="writing-criterion-improvement"><strong>Nasıl geliştirebilirsiniz?</strong><p>{criterion.improvement}</p></div>
          </article>
        ))}
      </div>
      {assessment.hasPrompt && (
        <div className="writing-coverage-grid">
          <div><h4><CheckCircle size={18} />Karşıladığınız Noktalar</h4>
            {assessment.addressedPoints.length ? <ul>{assessment.addressedPoints.map((point, index) => <li key={index}>{point}</li>)}</ul> : <p>Sorunun gerekliliklerini karşılayan belirgin bir nokta bulunamadı.</p>}
          </div>
          <div><h4><Target size={18} />Eksik veya Geliştirilecek Noktalar</h4>
            {assessment.missingPoints.length ? <ul>{assessment.missingPoints.map((point, index) => <li key={index}>{point}</li>)}</ul> : <p>Belirgin bir içerik eksiği tespit edilmedi.</p>}
          </div>
        </div>
      )}
      {assessment.strengths.length > 0 && <div className="writing-strengths"><h4>Güçlü Yönleriniz</h4><ul>{assessment.strengths.map((point, index) => <li key={index}>{point}</li>)}</ul></div>}
      <details className="writing-model-answer">
        <summary>{assessment.hasPrompt ? 'Daha Güçlü Bir Yanıt Örneği' : 'Fikirlerinizi Geliştiren Bir Örnek'}</summary>
        <p className="writing-model-explanation">{assessment.modelAnswerExplanation}</p>
        <div className="text-box corrected" lang="en"><p>{assessment.modelAnswer}</p></div>
      </details>
    </section>
  );
}
