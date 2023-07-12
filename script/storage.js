// ----------- 2. Store date in LocalStorage -----------

function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromStorage(key, defaultValue = null) {
  return localStorage.getItem(key) ?? defaultValue;
}

export { saveToStorage, getFromStorage };
