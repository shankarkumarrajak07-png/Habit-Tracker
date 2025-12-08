export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Habitus</h2>
          <p>
            Track your daily routines, stay consistent,<br />
            and turn goals into habits — all in one beautiful app.
          </p>

          <div className="footer-icons">
            <i className="fab fa-linkedin"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">FAQ</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>

      <p className="footer-bottom">© 2025 Habitus. All rights reserved.</p>
    </footer>
  );
}
