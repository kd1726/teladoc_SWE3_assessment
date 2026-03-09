import { render, screen } from "@testing-library/react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import Login from "@/Components/Login/Mobile/Login"


describe("Mobile login compoenent", () => {
  let userName: HTMLInputElement;
  let password: HTMLInputElement;
  let submitButton: HTMLInputElement;
  let form: HTMLFormElement;

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
  })

  test("Contains a password field with a password title", () => {

    expect(password).toBeDefined()
    expect(password.name).toEqual("password")
  })

  describe("Submit Button", () => {
    test("Contains a submit button with value 'Authenticate", () => {
      expect(submitButton).toBeDefined()
      expect(submitButton.value).toEqual("Authenticate")
    })

    test("On click it triggers 'handleSubmit", async () => {
      let onSubmitSpy = vi.fn((e) => { e.preventDefault() })
      if (form) form.onsubmit = onSubmitSpy

      let user = userEvent.setup()

      await user.type(userName, "username")
      await user.type(password, "test123456")
      await user.click(submitButton)

      expect(onSubmitSpy).toHaveBeenCalled()
    })
  })
})