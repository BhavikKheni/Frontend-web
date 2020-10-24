
export const LOCALSTORAGE_DATA = {
  set: (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  },
  remove: () => {
    localStorage.remove();
  },
  get: (name) => ({
    data: JSON.parse(localStorage.getItem(name)),
  }),
};


