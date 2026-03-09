import { JSX } from "react";

export default function Login(): JSX.Element {

  const handleSubmit: (e: React.SubmitEvent) => void = (e: React.SubmitEvent) => {
    e.preventDefault()
  }

  return <div className="mobile-login-container">
    <main className="login-container">
      <section className="title">
        <h1>Tenant Quota Dashboard</h1>
      </section>
      <form className="credentials" onSubmit={handleSubmit} data-testid="login-form">
        <article className="field-container">
          <label>User Name:</label>
          <input type="text" name="username" data-testid="username-field" required />
        </article>
        <article className="field-container">
          <label>Password:</label>
          <input type="password" name="password" data-testid="password-field" required />
        </article>
        <article className="submit-container">
          <input type="submit" role="button" data-testid="submit-button" value="Authenticate" />
        </article>
      </form>
    </main>
  </div>
}