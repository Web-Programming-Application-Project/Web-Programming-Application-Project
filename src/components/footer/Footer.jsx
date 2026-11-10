import './Footer.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/*
        <div className="somet">
          <h5 className="otsikko">Somet</h5>
          <p><a href="#tiktok">TikTok</a></p>
          <p><a href="#YT">YouTube</a></p>
        </div>
        */}
        <div className="yhteystiedot">
          <h5 className="otsikko">Contact Us</h5>
          <p><i class="bi bi-envelope"></i>  email@findmovie.help</p>
          <p><i class="bi bi-telephone"></i> +358 40 123 4567</p>
        </div>
        <p className="copyright">
          <a href="https://github.com/Web-Programming-Application-Project/Web-Programming-Application-Project/blob/main/LICENSE" target="_blank">© 2026 Web Programming Application Project </a>
        </p>
      </div>
    </footer>
  )
}
