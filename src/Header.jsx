function Header({ onLogout }) {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="header">
      <div className="logo">
        🎟️ EventHub
      </div>

      {isLoggedIn && (
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
