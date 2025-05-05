class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => {
      throw new Error(`Error ${res.status}: ${err.message || res.statusText}`);
    });
  }

  _handleError(error) {
    console.error("API Request Failed:", error);
    return Promise.reject(error);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, { headers: this._headers })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  updateUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    })
      .then(this._checkResponse)
      .catch((error) => console.error("Error updating profile:", error));
  }

  updateProfileAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    })
      .then(this._checkResponse)
      .then(() => this.getUserInfo()) // Fetch latest user data
      .catch(console.error);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers })
      .then(this._checkResponse)
      .catch(this._handleError);
  }

  addNewCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    })
      .then(this._checkResponse)
      .catch((error) => console.error("Error adding new card:", error));
  }

  removeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch((error) => console.error("Error deleting card:", error));
  }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch((error) => console.error("Error liking card:", error));
  }

  unlikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch((error) => console.error("Error unliking card:", error));
  }

  getAppData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
      .then(([userData, cards]) => {
        if (!userData || userData.name === "Placeholder name") {
          console.warn("Warning: API is returning placeholder data!");
        }
        return { userData, cards };
      })
      .catch(this._handleError);
  }
}

export default Api;
