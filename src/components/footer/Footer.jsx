import './Footer.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function Footer() {
  return (
    <footer className="footer mt-auto py-4 bg-body-tertiary border-top">
      <div className="container">
        {/*
        <div className="somet">
          <h5 className="otsikko">Somet</h5>
          <p><a href="#tiktok">TikTok</a></p>
          <p><a href="#YT">YouTube</a></p>
        </div>
        */}
        <div className="row align-items-center gy-3 text-center text-md-start">
          <div className="col-md-6 yhteystiedot">
            <h5 className="otsikko h6 fw-semibold mb-2">Contact Us</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="link-secondary link-underline-opacity-0" href="mailto:email@findmovie.help">
                  <i className="bi bi-envelope me-2"></i>email@findmovie.help
                </a>
              </li>
              <li>
                <a className="link-secondary link-underline-opacity-0" href="tel:+358401234567">
                  <i className="bi bi-telephone me-2"></i>+358 40 123 4567
                </a>
              </li>
            </ul>
          </div>
          <p className="col-md-6 text-md-end mb-0 copyright">
            <a className="link-secondary link-underline-opacity-0" href="https://github.com/Web-Programming-Application-Project/Web-Programming-Application-Project/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">© 2026 Web Programming Application Project</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
