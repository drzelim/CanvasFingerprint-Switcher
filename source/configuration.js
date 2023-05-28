
const configurate = (...functions) => {
  return new Promise(resolve => chrome.storage.local.get('userSettings', userSettings => {
    for (const func of functions) {
      func(userSettings);
    }
    resolve();
  }));
}
