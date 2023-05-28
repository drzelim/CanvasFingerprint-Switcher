const portal = document.createElement('span');
portal.style.display = 'none';
portal.id = 'portal-kdfjkdnfmvmcvcv';
document.documentElement.append(portal);

const getRandomInt = (min, max) => (Math.floor(Math.random() * (max - min + 1) + min));
const getRandomText = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters[getRandomInt(0, characters.length - 1)];
  }
  return result;
}
const getCanvasFPSettings = () => {
  let userSettings = self.fpSettings;
  if (userSettings) return userSettings;

  return {
    text: getRandomText(getRandomInt(6, 20)),
    fontSize: getRandomInt(12, 26),
    angle: getRandomInt(10, 150) / 1000,
    fillStyle: `rgba(${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, 0.0${getRandomInt(1, 5)})`,
    x: getRandomInt(3, 15),
    y: getRandomInt(10, 30)
  }
};


Object.assign(portal.dataset, self.fpSettings);

if (!Object.keys(portal.dataset).length) {
  chrome.runtime.sendMessage({action: 'getSettings'}, function(response) {
    if (!Object.keys(portal.dataset).length) {
      const userSettings = response.userSettings || getCanvasFPSettings();
      Object.assign(portal.dataset, userSettings);
    }
  });
}
