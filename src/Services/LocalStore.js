/**
 * Local Storage wrapper class to store/retrieve data from localStorage
 * it accept name of store during object construction,
 * provide helper methods to manipulate that store.
 */
export class LocalStore {
  constructor(name) {
    this.datastore = null;
    this.name = 'userInfo';
  }
  get() {
    return new Promise((resolve, reject) => {
      try {
        const result = JSON.parse(localStorage.getItem(this.name));
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
  // save data in storage
  set(item) {
    return new Promise((resolve, reject) => {
      this.datastore = item;
      try {
        localStorage.setItem(this.name, JSON.stringify(this.datastore));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  // remove data from storage
  clear() {
    return new Promise((resolve, reject) => {
      try {
        localStorage.clear();
        this.datastore = null;
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default LocalStore;