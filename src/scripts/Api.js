class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "402df489-8b33-4cc5-a119-272d843e9751",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}
export default Api;
