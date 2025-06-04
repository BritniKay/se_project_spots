export default class Api {
  constructor({ baseUrl, headers, timeout = 5000 }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._timeout = timeout;
    this._showGlobalError = this._showGlobalError.bind(this);
  }

  _checkResponse(res) {
    if (!res.ok) {
      return res
        .json()
        .catch(() =>
          Promise.reject(
            new Error(`Network response was not ok: ${res.status}`)
          )
        )
        .then((err) => {
          throw new Error(
            `Error ${res.status}: ${err.message || res.statusText}`
          );
        });
    }
    return res
      .json()
      .catch(() =>
        Promise.reject(new Error("Failed to parse response as JSON"))
      );
  }

  _fetchWithTimeout(url, options) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), this._timeout)
      ),
    ]);
  }

  _showGlobalError(message) {
    const errorBox = document.getElementById("global-error");
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.add("visible");
      setTimeout(() => errorBox.classList.remove("visible"), 5000);
    }
  }

  _handleRequest(promise) {
    return promise.catch((err) => {
      this._showGlobalError(err.message);
      return Promise.reject(err);
    });
  }

  getUserInfo() {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/users/me`, {
        headers: this._headers,
      }).then(this._checkResponse)
    );
  }

  updateUserInfo({ name, about }) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ name, about }),
      }).then(this._checkResponse)
    );
  }

  updateProfileAvatar(avatarUrl) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ avatar: avatarUrl }),
      })
        .then(this._checkResponse)
        .then(() => this.getUserInfo())
    );
  }

  getInitialCards() {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/cards`, {
        headers: this._headers,
      }).then(this._checkResponse)
    );
  }

  addNewCard({ name, link }) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({ name, link }),
      }).then(this._checkResponse)
    );
  }

  removeCard(cardId) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      }).then(this._checkResponse)
    );
  }

  likeCard(cardId) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: this._headers,
      }).then(this._checkResponse)
    );
  }

  unlikeCard(cardId) {
    return this._handleRequest(
      this._fetchWithTimeout(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: this._headers,
      }).then(this._checkResponse)
    );
  }

  getAppData(placeholderName = "Placeholder name") {
    return this._handleRequest(
      Promise.all([this.getUserInfo(), this.getInitialCards()]).then(
        ([userData, cards]) => {
          if (!userData || userData.name === placeholderName) {
            console.warn("Warning: API is returning placeholder data!");
          }
          return { userData, cards };
        }
      )
    );
  }
}
