import { render, screen } from "@testing-library/react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import Login from "@/Components/Login/Desktop/Login"

describe("Desktop login component", () => {
  let userName: HTMLInputElement
  let password: HTMLInputElement
  let submitButton: HTMLInputElement
  let form: HTMLFormElement

  beforeEach(() => {
    render(<Login />)
    userName = screen.getByTestId("username-field") as HTMLInputElement
    password = screen.getByTestId("password-field") as HTMLInputElement
    submitButton = screen.getByTestId("submit-button") as HTMLInputElement
    form = screen.getByTestId("login-form") as HTMLFormElement
  })

  test("Contains a page title", () => {
    expect(screen.getByText(/Tenant Quota Dashboard/i)).toBeDefined()
  })

  test("Contains a text box with a username title", () => {
    expect(userName).toBeDefined()
    expect(userName.name).toEqual("username")
    expect(userName.type).toEqual("text")
    expect(userName.required).toBe(true)
  })

  test("Contains a password field with a password title", () => {
    expect(password).toBeDefined()
    expect(password.name).toEqual("password")
    expect(password.type).toEqual("password")
    expect(password.required).toBe(true)
  })

  test("Accepts user input in the username field", async () => {
    const user = userEvent.setup()
    await user.type(userName, "testuser")

    expect(userName.value).toEqual("testuser")
  })

  test("Accepts user input in the password field", async () => {
    const user = userEvent.setup()
    await user.type(password, "secret123")

    expect(password.value).toEqual("secret123")
  })

  describe("Submit Button", () => {
    test("Contains a submit button with value 'Authenticate'", () => {
      expect(submitButton).toBeDefined()
      expect(submitButton.value).toEqual("Authenticate")
      expect(submitButton.type).toEqual("submit")
    })

    test("Submit button is contained within the login form", () => {
      expect(form.contains(submitButton)).toBe(true)
    })
  })

  describe("Error state", () => {
    test("Does not show error message on initial render", () => {
      expect(screen.queryByText(/Wrong user name or password/i)).toBeNull()
    })
  })
})
