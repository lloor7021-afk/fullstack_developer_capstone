import React, {useState} from "react";
import Header from "../Header/Header";

export default function Register() {
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    await fetch("/djangoapp/get_dealers");
    const token = document.cookie.split("; ").find(c => c.startsWith("csrftoken="))?.split("=")[1];
    const response = await fetch("/djangoapp/register", {
      method: "POST",
      headers: {"Content-Type": "application/json", "X-CSRFToken": token},
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) { setError(result.error); return; }
    sessionStorage.setItem("username", result.userName);
    window.location.href = "/";
  }
  return <><Header/><main className="container py-4">
    <h1>Sign Up</h1><p role="alert">{error}</p>
    <form onSubmit={submit}>
      <label>Username<input className="form-control" name="userName" required autoComplete="username"/></label><br/>
      <label>First Name<input className="form-control" name="firstName" required autoComplete="given-name"/></label><br/>
      <label>Last Name<input className="form-control" name="lastName" required autoComplete="family-name"/></label><br/>
      <label>Email<input className="form-control" name="email" type="email" required autoComplete="email"/></label><br/>
      <label>Password<input className="form-control" name="password" type="password" minLength={10} required autoComplete="new-password"/></label><br/>
      <button className="btn btn-primary" type="submit">Register</button>
    </form></main></>;
}
