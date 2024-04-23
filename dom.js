import { API } from "./api.js"

export const DOM = {
    buttonElement: document.getElementById("add-form-button"),
    listElement: document.getElementById("list"),
    nameInputElement: document.getElementById("add-form-name"),
    textInputElement: document.getElementById("add-form-text"),

    comments: [],

    getComments() {
        const loadingElement = document.getElementById("loading")
        loadingElement.style.display = 'block'

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
            this.renderComments()
            loadingElement.style.display = 'none'
        })
    },

    handleInputListeners() {
        this.nameInputElement.addEventListener("input", () => {
            if (this.nameInputElement.value.charAt(0) === ' ') {
                this.nameInputElement.value = ''
            }
            this.buttonElement.disabled = false
        })

        this.textInputElement.addEventListener("input", () => {
            if (this.textInputElement.value.charAt(0) === ' ') {
                this.textInputElement.value = ''
            }
            this.buttonElement.disabled = false
        })
    },

    handlePostButton() {
        this.buttonElement.addEventListener("click", () => {
            if (this.nameInputElement.value === "" && this.textInputElement.value === "") {
                this.nameInputElement.classList.add("errorinput")
                this.textInputElement.classList.add("errorinput")
                return
            } else if (this.nameInputElement.value === "") {
                this.nameInputElement.classList.add("errorinput")
                return
            } else if (this.textInputElement.value === "") {
                this.textInputElement.classList.add("errorinput")
                return
            }

            const loadingCommentElement = document.getElementById("loading-comment")
            loadingCommentElement.style.display = 'block'

            const commentFormElement = document.querySelector('.add-form')
            commentFormElement.style.display = 'none'

            API.postComment({
                name: this.nameInputElement.value,
                text: this.textInputElement.value,
            })
                .then(() => {
                    return this.getComments()
                })
                .then(() => {
                    this.nameInputElement.value = ""
                    this.textInputElement.value = ""
                    this.buttonElement.disabled = true
                })
                .catch(error => {
                    if (error.message === "Failed to fetch") {
                        console.error('Возникла проблема с операцией fetch:', error)
                        alert("Кажется, у Вас не работает интернет, попробуйте позже.")
                    }
                })
                .finally(() => {
                    loadingCommentElement.style.display = 'none'
                    commentFormElement.style.display = 'flex'
                })

            this.nameInputElement.classList.remove("errorinput")
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

    renderComments() {
        this.listElement.innerHTML = this.comments.map((comment, index) => {
            const classButton = comment.isLiked ? "-active-like" : ""

            return `<li class="comment" data-index="${index}">
          <div class="comment-header">
            <div>${comment.name}</div>
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
        })
    },

    start() {
        this.buttonElement.disabled = true

        this.getComments()
        this.handleInputListeners()
        this.handlePostButton()
    },
}
