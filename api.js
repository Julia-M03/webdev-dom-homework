
export const API = {
  commentsURI: 'https://wedev-api.sky.pro/api/v1/julia-mangura/comments',

  getComments() {
    return fetch(
      this.commentsURI, {
      method: "GET",
    })
      .then((response) => {
        return response.json()
      })
  },

  postComment({ name, text }) {
    return fetch(
      this.commentsURI,
      {
        method: "POST",
        body: JSON.stringify({
          name: name
            .replaceAll("&", "&amp")
            .replaceAll("<", "&lt")
            .replaceAll(">", "&gt")
            .replaceAll("''", "&quot"),
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
}
