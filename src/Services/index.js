const offline = false;
let customURL;

if (process.env.NODE_ENV === "development") {
  customURL = process.env.REACT_APP_DEVELOPMENT_URL;
} else {
  customURL = process.env.REACT_APP_PRODUCTION_URL;
}

const url = offline ? "http://127.0.0.1:8000" : customURL;
function readToken() {
  const result = JSON.parse(localStorage.getItem("token"));
  return result && (result || null);
}
class Service {
  constructor(props) {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Credentials", true);

    this.state = {
      baseURL: url,
    };

    this.headers = headers;
  }

  fetch(url, options) {
    return fetch(url, options);
  }

  upload(url, data) {
    const uploadUrl = `${this.state.baseURL}${url}`;
    let headers = new Headers();
    headers.append("token", readToken());

    return fetch(uploadUrl, {
      method: "POST",
      body: data,
      headers: headers,
    });
  }

  request(url, config = {}, data = {}) {
    let headers = this.headers;
    if (readToken() !== null) {
      headers.append("token", readToken());
    }
    const options = Object.assign(
      {
        method: "POST",
        headers: this.headers,
        mode: "cors",
        body: JSON.stringify(data),
      },
      config
    );

    if (config.method === "GET") {
      delete options.body;
    }

    return this.fetch(url, options);
  }

  login(email, password) {
    const url = `${this.state.baseURL}/login`;
    const data = {
      email,
      password,
    };
    const config = {
      method: "POST",
    };
    return this.request(url, config, data).then((res) => res.json());
  }

  add(url, data) {
    const config = {
      method: "POST",
    };
    const newUrl = `${this.state.baseURL}${url}`;
    return this.request(newUrl, config, data).then((res) => res.json());
  }

  get(url) {
    const config = {
      method: "GET",
    };
    const newUrl = `${this.state.baseURL}${url}`;
    return this.request(newUrl, config, {}).then((res) => res.json());
  }

  delete(url, data) {
    const config = {
      method: "DELETE",
    };
    const newUrl = `${this.state.baseURL}${url}/delete`;
    return this.request(newUrl, config, data);
  }

  search(url, data) {
    const newUrl = `${this.state.baseURL}${url}`;
    const config = {
      method: "POST",
    };
    return this.request(newUrl, config, data).then((res) => res.json());
  }
  logout() {
    const newUrl = `${this.state.baseURL}/logout`;
    const config = {
      method: "POST",
    };
    return this.request(newUrl, config).then((res) => res.json());
  }
}

export default Service;
