import { useEffect, useState } from 'react';
import IOSDevice from './components/IOSDevice.jsx';
import { useTracker } from './state/useTracker.js';
import { muted } from './lib/format.js';

// Below this width there's no room (or reason) for the desktop "phone
// mockup in a page" preview — the real device frame IS the viewport, so it
// fills it edge to edge instead of overflowing a fixed 402px frame into it.
const MOBILE_QUERY = '(max-width: 480px)';
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

import HomeTab from './screens/HomeTab.jsx';
import TransactionsTab from './screens/TransactionsTab.jsx';
import CardsTab from './screens/CardsTab.jsx';
import BudgetsTab from './screens/BudgetsTab.jsx';
import SettingsTab from './screens/SettingsTab.jsx';
import AddScreen from './screens/AddScreen.jsx';
import SmsScreen from './screens/SmsScreen.jsx';
import NotificationsScreen from './screens/NotificationsScreen.jsx';
import CardDetailScreen from './screens/CardDetailScreen.jsx';
import BillsScreen from './screens/BillsScreen.jsx';
import LoansScreen from './screens/LoansScreen.jsx';
import ExportScreen from './screens/ExportScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import EmisScreen from './screens/EmisScreen.jsx';
import AddEmiScreen from './screens/AddEmiScreen.jsx';
import ImportScreen from './screens/ImportScreen.jsx';
import AddAccountScreen from './screens/AddAccountScreen.jsx';
import RestoreBackupScreen from './screens/RestoreBackupScreen.jsx';
import CategoriesScreen from './screens/CategoriesScreen.jsx';

const TABS = {
  home: HomeTab,
  transactions: TransactionsTab,
  cards: CardsTab,
  budgets: BudgetsTab,
  more: SettingsTab,
};

const SCREENS = {
  add: AddScreen,
  sms: SmsScreen,
  notifications: NotificationsScreen,
  cardDetail: CardDetailScreen,
  bills: BillsScreen,
  loans: LoansScreen,
  export: ExportScreen,
  emis: EmisScreen,
  addEmi: AddEmiScreen,
  import: ImportScreen,
  addAccount: AddAccountScreen,
  restoreBackup: RestoreBackupScreen,
  categories: CategoriesScreen,
};

const ICONS = {
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="2.75" strokeLinejoin="round" />
    </>
  ),
  transactions: (
    <>
      <path d="M6 4h12v17l-3-2-3 2-3-2-3 2V4Z" stroke="currentColor" strokeWidth="2.75" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  cards: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="2.75" />
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="2.75" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2.75" />
      <path d="M12 3.5v3M12 17.5v3M20.5 12h-3M6.5 12h-3M18 6l-2.1 2.1M8.1 15.9 6 18M18 18l-2.1-2.1M8.1 8.1 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

function TabButton({ id, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{ color: active ? 'var(--color-accent)' : muted(45) }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">{ICONS[id]}</svg>
      <span>{label}</span>
    </button>
  );
}

function TabBar({ t }) {
  return (
    <nav className="om-tabbar" aria-label="Main">
      <TabButton id="home" label="Home" active={t.tab === 'home'} onClick={() => t.setTab('home')} />
      <TabButton id="transactions" label="Activity" active={t.tab === 'transactions'} onClick={() => t.setTab('transactions')} />
      <button type="button" onClick={() => t.openScreen('import')} aria-label="Add entry" style={{ justifyContent: 'center', marginTop: -18 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 999, background: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="var(--color-bg)" strokeWidth="2.75" strokeLinecap="round" />
          </svg>
        </div>
      </button>
      <TabButton id="cards" label="Cards" active={t.tab === 'cards'} onClick={() => t.setTab('cards')} />
      <TabButton id="more" label="More" active={t.tab === 'more'} onClick={() => t.setTab('more')} />
    </nav>
  );
}

export default function App() {
  const t = useTracker();
  const isMobile = useIsMobile();
  const Tab = TABS[t.tab] || HomeTab;
  const Screen = t.screen ? SCREENS[t.screen] : null;
  const loggedIn = t.data.profile.loggedIn;

  return (
    <div className={`om-page${isMobile ? ' is-frameless' : ''}`}>
      {!isMobile && (
        <div className="om-page-intro">
          <h1>Family Expense Tracker</h1>
          <p>
            {loggedIn
              ? `One shared app for both of you — Android reads payment SMS directly; iPhone forwards bank texts in
                 (Settings has both). Every expense is tagged by person so ${t.youName} and ${t.partnerName} can see
                 combined or individual spend anywhere.`
              : `One shared app for both of you — Android reads payment SMS directly; iPhone forwards bank texts in
                 (Settings has both). Every expense is tagged by person so you can see combined or individual spend
                 anywhere.`}
          </p>
        </div>
      )}

      <IOSDevice frameless={isMobile}>
        <div style={{
          flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          background: 'var(--color-bg)', color: 'var(--color-text)',
          position: 'relative', fontFamily: 'var(--font-body)',
        }}>
          {!loggedIn ? (
            <LoginScreen t={t} />
          ) : Screen ? (
            <Screen t={t} />
          ) : (
            <>
              <div className="om-screen"><Tab t={t} /></div>
              <TabBar t={t} />
            </>
          )}
        </div>
      </IOSDevice>

      {!isMobile && (
        <div className="om-page-foot">
          Prototype — SMS parsing, bank sync and payments are simulated for the demo.
        </div>
      )}
    </div>
  );
}
