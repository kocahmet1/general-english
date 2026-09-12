import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, ChevronRight, FileText, Headphones, House, Languages, LogOut, Menu, Mic, Moon, PenLine, Sun, X } from 'lucide-react';

export const learningSections = [
  { path: '/exams', title: 'Sınav', description: 'Gramer ve kelime bilgini test et', icon: BookOpen, color: 'blue' },
  { path: '/grammar', title: 'Gramer', description: 'Dilbilgisi kurallarını öğren ve pratik yap', icon: BookOpen, color: 'violet' },
  { path: '/reading', title: 'Okuma', description: 'Akademik metinleri anlama pratiği yap', icon: FileText, color: 'green' },
  { path: '/speaking', title: 'Konuşma', description: 'Speaking sınavına hazırlan', icon: Mic, color: 'pink' },
  { path: '/listening', title: 'Dinleme', description: 'Listening bölümüne hazırlan', icon: Headphones, color: 'orange' },
  { path: '/writing', title: 'Yazma', description: 'Essay ve task yazımını geliştir', icon: PenLine, color: 'blue' },
];

const navigation = [
  { path: '/', title: 'Ana Sayfa', icon: House },
  { path: '/sentence-lab', title: 'Sentence Lab', icon: Languages },
  ...learningSections,
];
const utilities = [
  { path: '/performance', title: 'Performans', icon: BarChart3 },
  { path: '/vocabulary', title: 'Kelime Kasası', icon: BookOpen },
];

interface LearningLayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  email?: string | null;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  vocabCount: number;
}

export function LearningLayout({ children, isDarkMode, onToggleTheme, email, onLogout, onLogin, onRegister, vocabCount }: LearningLayoutProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const current = [...navigation, ...utilities].find(item => item.path !== '/' && location.pathname.startsWith(item.path));
  const title = current?.title || 'Ana Sayfa';

  useEffect(() => {
    setMenuOpen(false);
    document.title = `${title} · Veritas English Prep App`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname, location.search, title]);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  return (
    <div className="learning-app">
      <a className="skip-link" href="#learning-main">İçeriğe geç</a>
      <aside className={`learning-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link className="learning-brand" to="/" aria-label="Veritas English Prep App — Ana Sayfa">
          <span className="brand-mark"><BookOpen size={25} strokeWidth={1.8} /></span>
          <span><strong>Veritas</strong><small>English Prep App</small></span>
        </Link>
        <nav id="learning-navigation" className="learning-navigation" aria-label="Ana menü">
          <div className="navigation-primary">
            {navigation.map(({ path, title: label, icon: Icon }) => (
              <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `learning-nav-link ${isActive ? 'is-active' : ''}`}>
                <Icon size={20} strokeWidth={1.8} /><span>{label}</span>
              </NavLink>
            ))}
          </div>
          <div className="navigation-utilities">
            {utilities.map(({ path, title: label, icon: Icon }) => (
              <NavLink key={path} to={path} className={({ isActive }) => `learning-nav-link ${isActive ? 'is-active' : ''}`}>
                <Icon size={20} strokeWidth={1.8} /><span>{label}</span>
                {path === '/vocabulary' && vocabCount > 0 && <span className="nav-count">{vocabCount}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="sidebar-account">
          {email ? <>
            <span className="account-avatar" aria-hidden="true">{email.charAt(0).toUpperCase()}</span>
            <div><span className="account-name">{email.split('@')[0]}</span><button onClick={onLogout}><LogOut size={14} />Çıkış Yap</button></div>
          </> : <>
            <button className="account-login" onClick={onLogin}>Giriş Yap</button>
            <button className="account-register" onClick={onRegister}>Kayıt Ol</button>
          </>}
        </div>
      </aside>
      <div className="learning-workspace">
        <header className="learning-topbar">
          <button ref={menuButtonRef} className="mobile-menu-button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} aria-controls="learning-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className="learning-breadcrumb" aria-label="Sayfa yolu">
            {current ? <><Link to="/">Ana Sayfa</Link><ChevronRight size={15} /><span aria-current="page">{title}</span></> : <span aria-current="page">Ana Sayfa</span>}
          </nav>
          <button className="learning-theme-button" onClick={onToggleTheme} title={isDarkMode ? 'Açık tema' : 'Koyu tema'} aria-label={isDarkMode ? 'Açık tema' : 'Koyu tema'}>
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </header>
        <main id="learning-main" className="learning-main" aria-label={title} ref={mainRef} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function LearningHome() {
  return (
    <div className="learning-home">
      <div className="home-heading"><h1>Ana Sayfa</h1><span>Veritas English Prep App</span></div>
      <Link to="/sentence-lab" className="featured-practice">
        <div className="featured-copy">
          <span className="featured-badge">NEW</span>
          <h2>Sentence Lab</h2>
          <p>Kucuk cumlelerle yapi, grammar ve punctuation calis</p>
          <span className="featured-action">Start practice <ArrowRight size={18} /></span>
        </div>
        <span className="featured-symbol" aria-hidden="true"><Languages size={88} strokeWidth={1.3} /></span>
      </Link>
      <div className="learning-skills">
        {learningSections.map(({ path, title, description, icon: Icon, color }) => (
          <Link className={`learning-skill skill-${color}`} key={path} to={path}>
            <span className="learning-skill-icon"><Icon size={27} strokeWidth={1.7} /></span>
            <div className="learning-skill-copy"><h2>{title}</h2><p>{description}</p></div>
            <ArrowRight size={20} className="learning-skill-arrow" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className="home-utilities">
        {utilities.map(({ path, title, icon: Icon }) => <Link to={path} key={path}><Icon size={21} /><span>{title}</span><ChevronRight size={18} /></Link>)}
      </div>
    </div>
  );
}

export function PageBack({ onClick, label = 'Ana Sayfa' }: { onClick: () => void; label?: string }) {
  return <button type="button" className="page-back" onClick={onClick}><ChevronRight size={17} /><span>{label}</span></button>;
}
