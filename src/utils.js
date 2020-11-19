
export const LOCALSTORAGE_DATA = {
  set: (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  },
  remove: (name) => {
    localStorage.removeItem(name);
    localStorage.clear();
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
export const scrollToSection = (sectionName) => {
  var elementCalendar = document.getElementsByClassName(sectionName);
  if (elementCalendar[0]) {
    elementCalendar[0].scrollIntoView();
  }
};
export function countdown(elementName, minutes, seconds) {
  var element, endTime, hours, mins, msLeft, time;

  function twoDigits(n) {
    return n <= 9 ? "0" + n : n;
  }

  function updateTimer() {
    msLeft = endTime - +new Date();
    if (msLeft < 1000) {
    } else {
      time = new Date(msLeft);
      hours = time.getUTCHours();
      mins = time.getUTCMinutes();
      element.innerHTML =
        (hours ? hours + ":" + twoDigits(mins) : mins) +
        ":" +
        twoDigits(time.getUTCSeconds());
      setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
    }
  }

  element = document.getElementById(elementName);
  endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
  if(element){
    updateTimer();
  }
}