import { useAuth } from '../components/authContext'
import './Accountpage.css'

export default function Accountpage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="account-wrapper">
      <div className="card shadow account-card">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">Oma tili</h1>

          <dl className="row mb-0">
            <dt className="col-4">Käyttäjänimi</dt>
            <dd className="col-8">{user.username}</dd>

            <dt className="col-4">Sähköposti</dt>
            <dd className="col-8 mb-0">{user.email}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
