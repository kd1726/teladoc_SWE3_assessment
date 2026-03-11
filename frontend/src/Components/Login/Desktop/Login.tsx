import { JSX, useState } from "react";
import { AuthClient } from "@/Components/Clients/Auth/authClient";
import { AuthType } from "@/Types/authTypes";
import { REACT_BASE_URL } from "@/Config/config";
import { jwtDecode } from "jwt-decode";
import { JWTToken } from "@/Types/authTypes";

export default function Login(): JSX.Element {
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  const handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData: AuthType = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value
    }

    AuthClient(loginData).then((res) => {
      let { access_token, token_type } = res.data
      access_token && localStorage.setItem("accessToken", access_token)
      token_type && localStorage.setItem("tokenType", token_type)

      let { role, tenant_id } = jwtDecode<JWTToken>(access_token)

      role && localStorage.setItem("role", role)
      tenant_id && localStorage.setItem("tenantId", tenant_id)
      return role
    }).then(role => {
      if (role == "admin") {
        window.location.href = `${REACT_BASE_URL}/dashboard/admin`
      } else {
        window.location.href = `${REACT_BASE_URL}/dashboard`
      }
    }).catch((ers) => {
      setAuthFailed(true)
      console.log(ers)
    })
  }

  return <div className="desktop-login-container">
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
          {authFailed && <p className="text-red-500">Wrong user name or password</p>}
          <input type="submit" role="button" data-testid="submit-button" value="Authenticate" />
        </article>
      </form>
    </main>
  </div>
}