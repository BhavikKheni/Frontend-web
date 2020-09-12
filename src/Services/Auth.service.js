import Service from '.';
import LocalStore from './LocalStore';

export const login = (email, password) => {
  const service = new Service();
  const result = new Promise((resolve, reject) => {
    service.login(email, password).then((result) => {
      resolve(result);
    }).catch((err) => reject(err));
  });
  return result;
};

export const add = (url, values) => {
  const service = new Service();
  const result = new Promise((resolve, reject) => {
    service
      .add(url, values)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
  return result;
};
export const get = (url) => {
  const service = new Service();
  const result = new Promise((resolve, reject) => {
    service
      .get(url)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
  return result;
};
export const search = (url, data) => {
  const service = new Service();
  const result = new Promise((resolve, reject) => {
    service
      .search(url, data)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return result;
};
export const onLogout = (props) => {
  const storage = new LocalStore();
  const result = new Promise((resolve, reject) => {
    storage
      .clear()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return result;
};

export const setLocalStorage = (data) => {
  const storage = new LocalStore();
  const result = new Promise((resolve, reject) => {
    storage
      .set(data)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
  return result;
};

export const getLocalStorage = () => {
  const storage = new LocalStore();
  const result = new Promise((resolve, reject) => {
    try {
      storage.get().then((res) => {
        resolve(res);
      });
    } catch (err) {
      reject(err);
    }
  });
  return result;
};
export const onIsLoggedIn = (isLogin = false) => {
  const storage = new LocalStore();
  const result = new Promise((resolve, reject) => {
    try {
      storage.get().then((res) => {
        let user = {};
        if (res && res.email) {
          isLogin = true;
          user = { ...(res || {}) };
        } else {
          isLogin = false;
        }
        resolve({ isLogin: isLogin, user });
      });
    } catch (err) {
      reject(err);
    }
  });
  return result;
};
