import { Link } from 'react-router-dom';

/** Switch between the IELTS listening tests (/listening) and TOEFL listening practice (/listening/toefl). */
export function ListeningFormatTabs({ active }: { active: 'ielts' | 'toefl' }) {
  return (
    <nav className="listening-format-tabs" aria-label="Dinleme sınavı türü">
      <Link to="/listening" className={active === 'ielts' ? 'is-active' : undefined} aria-current={active === 'ielts' ? 'page' : undefined}>IELTS</Link>
      <Link to="/listening/toefl" className={active === 'toefl' ? 'is-active' : undefined} aria-current={active === 'toefl' ? 'page' : undefined}>TOEFL</Link>
    </nav>
  );
}
