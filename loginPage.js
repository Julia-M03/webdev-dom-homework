import { API } from "./api.js"
import { DOM } from "./dom.js"

export const renderLogin = () => {
    DOM.appElement.innerHTML = `
    <div class="container">
        <div class="add-form">
            <h2>Форма входа</h2>
            <input type="text" id="login-input" class="add-form-text" placeholder="Введите логин">
            <input type="text" id="password-input" class="add-form-text" placeholder="Введите пароль">
            <div class="add-form-row">
                <button id="login-button" class="add-form-button">Войти</button>
              </div>
        </div>
    </div>
    `

    const buttonElement = document.getElementById("login-button")
    const loginInputElement = document.getElementById("login-input")
    const passwordInputElement = document.getElementById("password-input")

    buttonElement.addEventListener("click", () => {
        if (!loginInputElement.value.trim() || !passwordInputElement.value.trim()) return alert("Заполнить поля")
            
        API.login(loginInputElement.value, passwordInputElement.value)
            .then((data) => {
                if (data === "error")
                    return

                console.log(API.token)
                API.token    = data.user.token
                DOM.userName = data.user.name
                console.log(API.token)

                if (!API.token)
                    return

                DOM.state.isAutorized  = true
                DOM.state.isAutorizing = false

                DOM.render()
            })
    })
}
