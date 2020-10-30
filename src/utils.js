
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


export const languages_level = [
  { language_level_id: 1, label: "BASIC" },
  { language_level_id: 2, label: "INTERMEDIATE" },
  { language_level_id: 3, label: "ADVANCED" },
];