import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="somet">
            <h3 className="otsikko">Somet</h3>
            <p><a href="#tiktok">TikTok</a></p>
            <p><a href="#YT">YouTube</a></p>
        </div>
        <div className="yhteystiedot">
            <h3>Yhteystiedot</h3>
            <p>Email: findmovie@help.com</p>
            <p>Phone: 04569696969</p>
        </div>
        <p className="copyright">
           <a href="https://github.com/Web-Programming-Application-Project/Web-Programming-Application-Project/blob/main/LICENSE" target="_blank">© 2026 Web Programming Application Project </a>
        </p>
      </div>
    </footer>
  )
}