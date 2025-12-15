import React, { useState, useEffect } from 'react';

export default function CoinTap() {
  const [screen, setScreen] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('register');
  const [users, setUsers] = useState({});
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mult, setMult] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [time, setTime] = useState(0);
  const [shop, setShop] = useState(false);
  const [donate, setDonate] = useState(false);
  const [donAmt, setDonAmt] = useState('');
  const [maxClicks, setMaxClicks] = useState(100);
  const [msg, setMsg] = useState('');
  const [withdrawNum, setWithdrawNum] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');

  const ADMIN_PHONE = '+998770077762';
  const ADMIN_PASSWORD = 'admin';

  useEffect(() => {
    const stored = localStorage.getItem('coinTapUsers');
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      localStorage.setItem('coinTapUsers', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (!cooldown || time <= 0) return;
    const timer = setTimeout(() => {
      setTime(t => {
        if (t <= 1) {
          setCooldown(false);
          setClicks(0);
          setMsg('✅ Tayyor!');
          setTimeout(() => setMsg(''), 2000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown, time]);

  const register = () => {
    if (!phone.trim() || phone.length < 9 || !password.trim() || password.length < 4 || users[phone]) {
      alert('❌ Xato malumot!');
      return;
    }
    const newUser = { phone, password, balance: 0, mult: 1, clicks: 0, maxClicks: 100 };
    setUsers({ ...users, [phone]: newUser });
    setUser(phone);
    setBalance(0);
    setMult(1);
    setClicks(0);
    setMaxClicks(100);
    setScreen('game');
  };

  const login = () => {
    if (!phone.trim() || !password.trim()) {
      alert('❌ Malumotlarni toldiring!');
      return;
    }
    
    if (phone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
      setUser(ADMIN_PHONE);
      setBalance(999999999);
      setMult(400000);
      setMaxClicks(999999);
      setScreen('game');
      return;
    }
    
    if (!users[phone] || users[phone].password !== password) {
      alert('❌ Login yoki parol xato!');
      return;
    }
    setUser(phone);
    setBalance(users[phone].balance || 0);
    setMult(users[phone].mult || 1);
    setClicks(users[phone].clicks || 0);
    setMaxClicks(users[phone].maxClicks || 100);
    setScreen('game');
  };

  const handleClick = () => {
    if (cooldown) return;
    const newClicks = clicks + 1;
    const newBal = balance + mult;
    setClicks(newClicks);
    setBalance(newBal);
    const u = { ...users };
    u[user] = { ...u[user], balance: newBal, clicks: newClicks };
    setUsers(u);
    if (newClicks >= maxClicks) {
      setCooldown(true);
      setTime(120);
    }
  };

  const buyUpgrade = () => {
    const cost = 500 * mult;
    if (balance >= cost) {
      setBalance(balance - cost);
      setMult(mult + 1);
      const u = { ...users };
      u[user] = { ...u[user], balance: balance - cost, mult: mult + 1 };
      setUsers(u);
      setShop(false);
    } else {
      alert(`❌ ${cost} tanga kerak`);
    }
  };

  const buyTaps = () => {
    const cost = 10000;
    if (balance >= cost) {
      const newMax = maxClicks + 50;
      setBalance(balance - cost);
      setMaxClicks(newMax);
      const u = { ...users };
      u[user] = { ...u[user], balance: balance - cost, maxClicks: newMax };
      setUsers(u);
      setShop(false);
    } else {
      alert(`❌ ${cost} tanga kerak`);
    }
  };

  const donateFunds = () => {
    if (!donAmt) {
      alert('❌ Miqdorni kiriting!');
      return;
    }
    const amt = parseInt(donAmt);
    if (amt <= 0 || balance < amt) {
      alert('❌ Xato miqdor!');
      return;
    }
    setBalance(balance - amt);
    const u = { ...users };
    u[user].balance = balance - amt;
    setUsers(u);
    setMsg(`✅ ${amt} tanga yuborildi!`);
    setDonAmt('');
    setDonate(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const sendCoins = () => {
    if (!withdrawNum.trim() || !withdrawAmt || !users[withdrawNum]) {
      alert('❌ Xato malumot!');
      return;
    }
    const amt = parseInt(withdrawAmt);
    if (amt <= 0 || balance < amt) {
      alert('❌ Xato miqdor!');
      return;
    }
    setBalance(balance - amt);
    const u = { ...users };
    u[user].balance = balance - amt;
    u[withdrawNum].balance = (u[withdrawNum].balance || 0) + amt;
    setUsers(u);
    setMsg(`✅ ${amt} tanga yuborildi!`);
    setWithdrawNum('');
    setWithdrawAmt('');
    setTimeout(() => setMsg(''), 3000);
  };

  const logout = () => {
    setUser(null);
    setScreen('login');
    setBalance(0);
    setMult(1);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;

  const bgGradient = { background: 'linear-gradient(135deg, #1e293b, #581c87, #1e293b)' };
  const btnStyle = { padding: '10px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

  if (screen === 'login') {
    return (
      <div style={{ ...bgGradient, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'system-ui', padding: '20px', width: '100vw' }}>
        <div style={{ width: '100vw', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>⚡</div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: '#facc15' }}>COIN TAP</h1>
            <p style={{ color: '#d8b4fe' }}>Tapping Oyini</p>
          </div>

          <div style={{ background: '#6b21a8', padding: '30px', borderRadius: '20px', border: '2px solid #c084fc', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => { setMode('register'); setPhone(''); setPassword(''); }} style={{ ...btnStyle, flex: 1, backgroundColor: mode === 'register' ? '#22c55e' : '#374151', color: 'white' }}>ROYXAT</button>
              <button onClick={() => { setMode('login'); setPhone(''); setPassword(''); }} style={{ ...btnStyle, flex: 1, backgroundColor: mode === 'login' ? '#3b82f6' : '#374151', color: 'white' }}>KIRISH</button>
            </div>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon raqam" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #a855f7', borderRadius: '8px', backgroundColor: '#334155', color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parol" style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '2px solid #a855f7', borderRadius: '8px', backgroundColor: '#334155', color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            <button onClick={mode === 'register' ? register : login} style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #22c55e, #059669)', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', color: 'white' }}>
              {mode === 'register' ? 'ROYXATDAN OTISH' : 'KIRISH'}
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '30px' }}>Foydalanuvchilar: {Object.keys(users).length}</p>
        </div>
      </div>
    );
  }

  if (screen === 'game' && user) {
    return (
      <div style={{ ...bgGradient, minHeight: '100vh', color: 'white', paddingBottom: '200px', fontFamily: 'system-ui', width: '100vw' }}>
        <div style={{ background: 'linear-gradient(90deg, #581c87, #4f46e5)', padding: '16px', borderBottom: '2px solid #c084fc', position: 'sticky', top: 0, zIndex: 20, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '100%' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#d8b4fe', margin: 0 }}>📱 {user}</p>
              <div style={{ background: 'linear-gradient(90deg, #ca8a04, #ea580c)', borderRadius: '8px', padding: '6px 12px', display: 'inline-block', marginTop: '8px' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>💰 {Math.floor(balance).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={logout} style={{ ...btnStyle, backgroundColor: '#dc2626', color: 'white' }}>Chiqish</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 'calc(100vh - 80px)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px', width: '100%' }}>
            <p style={{ color: '#c4b5fd', marginBottom: '10px' }}>Har bir bosish:</p>
            <div style={{ background: 'linear-gradient(135deg, #6b21a8, #4c1d95)', border: '2px solid #a855f7', borderRadius: '16px', padding: '24px', maxWidth: '300px', margin: '0 auto' }}>
              <p style={{ fontSize: '44px', fontWeight: 'bold', color: '#facc15', margin: 0 }}>{mult.toLocaleString()}x</p>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '320px', marginBottom: '30px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>Bosishlar: {clicks}/{maxClicks}</p>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden', border: '2px solid #a855f7' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #06b6d4)', width: `${(clicks / maxClicks) * 100}%`, transition: 'width 0.3s' }}></div>
            </div>
          </div>

          {cooldown ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>⏸️</div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', margin: 0 }}>⏱️ {fmt(time)}</p>
            </div>
          ) : (
            <button onClick={handleClick} style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(135deg, #facc15, #f97316, #ec4899)', border: '4px solid #fcd34d', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>⭐</button>
          )}

          <div style={{ marginTop: '30px', width: '100%', maxWidth: '280px' }}>
            <div style={{ background: 'linear-gradient(135deg, #15803d, #059669)', border: '2px solid #22c55e', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#86efac', margin: 0 }}>Ko'paytiruvchi</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80', margin: '8px 0 0 0' }}>{mult.toLocaleString()}x</p>
            </div>
          </div>
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(15,23,42,0.95))', borderTop: '2px solid #a855f7', padding: '12px', zIndex: 30, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 12px' }}>
            <div style={{ background: 'linear-gradient(90deg, #ca8a04, #ea580c)', borderRadius: '12px', padding: '14px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px', width: '100%', boxSizing: 'border-box' }}>💰 {Math.floor(balance).toLocaleString()}</div>
            {msg && <div style={{ background: 'linear-gradient(90deg, #16a34a, #059669)', padding: '8px', borderRadius: '8px', textAlign: 'center', marginBottom: '8px', fontWeight: 'bold' }}>{msg}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
              <button onClick={() => setShop(!shop)} style={{ ...btnStyle, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', width: '100%' }}>🛍️ DO'KON</button>
              <button onClick={() => setScreen('withdraw')} style={{ ...btnStyle, background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', width: '100%' }}>💸 YUBORISH</button>
              <button onClick={() => setDonate(!donate)} style={{ ...btnStyle, background: 'linear-gradient(135deg, #dc2626, #be123c)', color: 'white', width: '100%' }}>❤️ XAYRIYA</button>
            </div>
          </div>
        </div>

        {donate && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', border: '3px solid #ef4444', borderRadius: '16px', padding: '24px', maxWidth: '350px', width: '90%' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>❤️ XAYRIYA</h2>
              <input type="number" value={donAmt} onChange={(e) => setDonAmt(e.target.value)} placeholder="Miqdor" style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '2px solid #ef4444', borderRadius: '8px', backgroundColor: '#334155', color: 'white', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {[100, 500, 1000].map(a => <button key={a} onClick={() => setDonAmt(String(a))} style={{ ...btnStyle, background: '#dc2626', color: 'white' }}>{a}</button>)}
              </div>
              <button onClick={donateFunds} style={{ width: '100%', ...btnStyle, background: 'linear-gradient(90deg, #dc2626, #991b1b)', color: 'white', marginBottom: '8px' }}>YUBORISH</button>
              <button onClick={() => setDonate(false)} style={{ width: '100%', ...btnStyle, background: '#374151', color: 'white' }}>YOPISH</button>
            </div>
          </div>
        )}

        {shop && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ background: 'linear-gradient(135deg, #5b21b6, #3b0764)', border: '3px solid #c084fc', borderRadius: '16px', padding: '24px', maxWidth: '350px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>🛍️ DO'KON</h2>
              <div style={{ marginBottom: '12px', padding: '12px', background: '#334155', border: '2px solid #06b6d4', borderRadius: '8px' }}>
                <h3 style={{ color: '#67e8f9', fontSize: '14px', margin: 0 }}>⚡ YANGILASH</h3>
                <p style={{ fontSize: '12px', color: '#e5e7eb', margin: '8px 0' }}>{mult}x → {mult + 1}x</p>
                <p style={{ color: '#facc15', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{(500 * mult).toLocaleString()} tanga</p>
                <button onClick={buyUpgrade} disabled={balance < 500 * mult} style={{ width: '100%', ...btnStyle, background: balance >= 500 * mult ? '#06b6d4' : '#6b7280', color: 'white', marginTop: '8px' }}>SOTIB OLISH</button>
              </div>
              <div style={{ marginBottom: '12px', padding: '12px', background: '#334155', border: '2px solid #f59e0b', borderRadius: '8px' }}>
                <h3 style={{ color: '#fbbf24', fontSize: '14px', margin: 0 }}>📈 BOSISHLAR</h3>
                <p style={{ fontSize: '12px', color: '#e5e7eb', margin: '8px 0' }}>{maxClicks} → {maxClicks + 50}</p>
                <p style={{ color: '#facc15', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>10,000 tanga</p>
                <button onClick={buyTaps} disabled={balance < 10000} style={{ width: '100%', ...btnStyle, background: balance >= 10000 ? '#f59e0b' : '#6b7280', color: 'white', marginTop: '8px' }}>SOTIB OLISH</button>
              </div>
              <button onClick={() => setShop(false)} style={{ width: '100%', ...btnStyle, background: '#374151', color: 'white' }}>YOPISH</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'withdraw' && user) {
    return (
      <div style={{ ...bgGradient, minHeight: '100vh', color: 'white', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#6b21a8', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#facc15', margin: 0 }}>💰 {Math.floor(balance).toLocaleString()}</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '350px', background: '#6b21a8', border: '2px solid #a855f7', padding: '24px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>💸 YUBORISH</h2>
            {msg && <div style={{ background: '#16a34a', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '12px', fontWeight: 'bold' }}>{msg}</div>}
            <input type="tel" value={withdrawNum} onChange={(e) => setWithdrawNum(e.target.value)} placeholder="Telefon raqam" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #a855f7', borderRadius: '8px', backgroundColor: '#334155', color: 'white', boxSizing: 'border-box' }} />
            <input type="number" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} placeholder="Miqdor" style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '2px solid #a855f7', borderRadius: '8px', backgroundColor: '#334155', color: 'white', boxSizing: 'border-box' }} />
            <button onClick={sendCoins} style={{ width: '100%', ...btnStyle, background: '#16a34a', color: 'white', marginBottom: '8px' }}>YUBORISH</button>
            <button onClick={() => setScreen('game')} style={{ width: '100%', ...btnStyle, background: '#374151', color: 'white' }}>ORQAGA</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}