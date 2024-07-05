import { API } from "./api.js"
import { renderLogin } from "./loginPage.js"

export const DOM = {
    appElement: document.getElementById("app"),
    buttonElement: document.getElementById("add-form-button"),
    listElement: document.getElementById("list"),
    nameInputElement: document.getElementById("add-form-name"),
    textInputElement: document.getElementById("add-form-text"),

    userName: "",
    comments: [],

    state: {
        isAutorized: false,
        isAutorizing: false,
        isSending: false,
    },

    getComments() {
        const loadingElement = document.getElementById("loading")
        // loadingElement.style.display = 'block'
        console.log (loadingElement)

        API.getComments().then((responseData) => {
            this.comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleDateString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit' }) + ' ' + new Date(comment.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    comment: comment.text,
                    likesCounter: comment.likes,
                    isLiked: false,
                }
            })

            console.log(this.comments)
            this.render()
            // loadingElement.style.display = 'none'
        }).catch( (error) => {
            alert(error.message)
        })
    },

    handleInputListeners() {
        this.textInputElement.addEventListener("input", () => {
            if (this.textInputElement.value.charAt(0) === ' ') {
                this.textInputElement.value = ''
            }
            this.buttonElement.disabled = false
        })
    },

    handlePostButton() {
        this.buttonElement.addEventListener("click", () => {
            console.log (this.textInputElement)
            if (this.textInputElement.value === "") {
                
                this.textInputElement.classList.add("errorinput")
                return
            }

            this.state.isSending = true
            API.postComment(this.textInputElement.value)
                .then(() => {
                     this.getComments ()
                })
                .then(() => {
                    this.textInputElement.value = ""
                    this.buttonElement.disabled = true

                    this.state.isSending = false

                    this.render()
                })
                .catch(error => {
                    if (error.message === "Failed to fetch") {
                        console.error('Возникла проблема с операцией fetch:', error)
                        alert("Кажется, у Вас не работает интернет, попробуйте позже.")
                    }
                })
            
            this.textInputElement.classList.remove("errorinput")
        })
    },

    handleLikeButtons() {
        const likeButtonElements = document.querySelectorAll(".like-button")
        likeButtonElements.forEach((likeButtonElement) => {
            likeButtonElement.addEventListener('click', (event) => {
                event.stopPropagation()
                const index = likeButtonElement.dataset.index
                const comment = this.comments[index]

                if (comment.isLiked === false) {
                    comment.likesCounter = comment.likesCounter + 1
                    comment.isLiked = true
                } else {
                    comment.isLiked = false
                    comment.likesCounter = comment.likesCounter - 1
                }

                this.renderComments()
            })
        })
    },

    render() {

        if (this.state.isAutorizing) {
            this.listElement.innerHTML = ``

            renderLogin()
        }
        else {
            this.renderComments()

            if (this.state.isAutorized && this.state.isSending) {
                this.appElement.innerHTML = `
                <div id="loading-comment" style="display: none;">Комментарий добавляется...</div>
                `
            }
            else if (this.state.isAutorized) {
                this.appElement.innerHTML = `
                <div class="add-form">
                    <input id="add-form-name" type="text" class="add-form-name" placeholder="Введите ваше имя" value="${this.userName}" readonly />
                    <textarea id="add-form-text" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
                    <div class="add-form-row">
                        <button id="add-form-button" class="add-form-button">Написать</button>
                    </div>
                </div>
                `

                this.buttonElement = document.getElementById("add-form-button")
                this.listElement = document.getElementById("list")
                this.textInputElement = document.getElementById("add-form-text")

                this.handleInputListeners()
                this.handlePostButton()
            }
            else {
                this.appElement.innerHTML = `
                <p>Вам нужно <a href="#" id="link-to-login">авторизоваться на сайте</a>!</p>
                `
                document.getElementById("link-to-login").addEventListener("click", () => {
                    this.state.isAutorizing = true

                    this.render()
                })
            }
        }
    },

    renderComments() {
        this.listElement.innerHTML = this.comments.map((comment, index) => {
            const classButton = comment.isLiked ? "-active-like" : ""

            return `<li class="comment" data-index="${index}">
          <div class="comment-header">
            <div>${comment.name.replaceAll("&", "&amp")
                .replaceAll("<", "&lt")
                .replaceAll(">", "&gt")
                .replaceAll("''", "&quot")}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <p class ="" data-index="${index}"></p>
            <div class="comment-text" data-index="${index}">
              ${comment.comment}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter" data-index="${index}">${comment.likesCounter}</span>
              <button class="like-button ${classButton}" data-index="${index}"></button>
            </div> 
          </div>
        </li>`
        }).join("")

        if (this.userName) {
            this.handleLikeButtons()

        // ответ на комментарий
        const commentTexts = document.querySelectorAll('.comment-text')
        commentTexts.forEach((textElement) => {
            textElement.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index')
                const comment = this.comments[index]
                const quote = comment.comment
                    .replaceAll("&quot", "''")
                    .replaceAll("&gt", ">")
                    .replaceAll("&lt", "<")
                    .replaceAll("&amp", "&")

                this.textInputElement.value = `> ${quote}: ${comment.name}`
                this.textInputElement.focus()
            })
        })}
    },

    start() {
        this.getComments()
    },
}
