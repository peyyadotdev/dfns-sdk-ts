import { FormEvent } from 'react'

import '../globals.css'
import useAuth from '../hooks/useAuth'

export default function Login(): JSX.Element {
  const { login, loading, error } = useAuth()

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    login(formData.get('username') as string, process.env.REACT_APP_DFNS_ORG_ID!)
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="w-full p-10">
        <h1 className="text-2x">Login</h1>

        <div className="flex items-center gap-2">
          <input className="input" id="username" name="username" placeholder="username" />

          <button className="btn" disabled={loading} type="submit">
            Login
          </button>
        </div>

        {!!error && <div className="text-red-700">{error.message}</div>}

        <p>
          You can login if your Dfns user already has a Passkey Credential registered on this domain. If you don't, you
          first need to <a href="/credential">create a new Credential</a>.
        </p>
      </div>
    </form>
  )
}
