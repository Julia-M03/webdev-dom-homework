
export const API = {
  commentsURI: 'https://wedev-api.sky.pro/api/v2/julia-mangura/comments',
  userURL: 'https://wedev-api.sky.pro/api/user/login',

  token: "",

  setToken(newToken) {
    token = newToken
  },

  getComments() {
    return fetch(
      this.commentsURI, {
      method: "GET",
    })
      .then((response) => {
        return response.json()
      })
  },

  postComment(text) {
    return fetch(
      this.commentsURI,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          text: text
            .replaceAll("&", "&amp")
            .replaceAll("<", "&lt")
            .replaceAll(">", "&gt")
            .replaceAll("''", "&quot")
            .replaceAll("%BEGIN_QUOTE", "<div class='quote'>")
            .replaceAll("END_QUOTE%", "</div>"),
          forceError: true,
        })
      }
    )
      .then(response => {
        if (response.status === 201) {
          return response.json()
        } else if (response.status === 400) {
          alert("Имя и комментарий должен быть не короче 3х символов.")
        } else if (response.status === 500) {
          alert("Сервер сломался, попробуй позже.")
        }
        throw new Error("Ответ сервера не был успешным.")
      })
  },

  login(login, password) {
    let status

    return fetch(
      this.userURL, {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then((response) => {
        status = response.status

        return response.json()
      })
      .then((data) => {
        if (status >= 400)
          throw new Error(data.error)

        return data
      })
      .catch((error) => {
        if (error === "failed to fetch")
          alert("Проблема с Интернетом. Повторите попытку позже")
        else
          alert(error.message)
        
        return "error"
      })
  },
}
