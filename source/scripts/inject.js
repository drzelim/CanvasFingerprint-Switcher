const portal = document.createElement('span');
portal.style.display = 'none';
portal.id = 'portal-kdfjkdnfmvmcvcv';
document.documentElement.append(portal);

const getRandomInt = (min, max) => (Math.floor(Math.random() * (max - min + 1) + min));
const getConvertString = (str, pad) => pad.substring(str.toString().length) + str;
const getRandomText = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters[getRandomInt(0, characters.length - 1)];
  }
  return result;
}

const getFakeWebglCoordinates = () => {
  const fakeNumber1 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber2 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber3 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber4 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber5 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber6 = getConvertString(getRandomInt(1, 99), '00');
  return [`0.45${fakeNumber1}`, `0.46${fakeNumber2}`, '0', `0.51${fakeNumber3}`, `0.51${fakeNumber4}`, '0', `0,00${fakeNumber5}`, `0.0${fakeNumber6}`, '0'];
};

const getFakeColor = () => [getRandomInt(85, 95), getRandomInt(10, 20)];

const getWebglSettings = () => {
  return [
    {
      fakeCoordinates: getFakeWebglCoordinates(),
      fakeColor: getFakeColor(),
    },
    {
      fakeCoordinates: getFakeWebglCoordinates(),
      fakeColor: getFakeColor(),
    }
  ]
};

const getSettingsForReadPixelsFunc = () => {
  const settings = {};
  for (let i = 0; i < 10; i++) {
    settings[getRandomInt(0, 250)] = getRandomInt(0, 255);
  }
  return settings;
}

const getCanvasFPSettings = () => {
  const userSettings = self.fpSettings;
  if (userSettings) return userSettings;

  return {
    text: getRandomText(getRandomInt(6, 20)),
    fontSize: getRandomInt(12, 26),
    angle: getRandomInt(10, 150) / 1000,
    fillStyle: `rgba(${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, 0.0${getRandomInt(1, 5)})`,
    x: getRandomInt(3, 15),
    y: getRandomInt(10, 30),
    settingsForReadPixelsFunc: JSON.stringify(getSettingsForReadPixelsFunc()),
    canvasWebglContextSettings: JSON.stringify(getWebglSettings()),
  }
};

const settingsAdapter = (settings) => {
  const result = {};
  const moveToTopLevel = (obj) => {
    for (let prop in obj) {
      if (typeof obj[prop] === 'object') {
        moveToTopLevel(obj[prop]);
      } else {
        Object.assign(result, {[prop]: obj[prop]});
      }
    }
  };
  moveToTopLevel(settings);
  return result;
};


Object.assign(portal.dataset, self.fpSettings);

if (!Object.keys(portal.dataset).length) {
  chrome.runtime.sendMessage({action: 'getSettings'}, function(response) {
    if (!Object.keys(portal.dataset).length) {
      const userSettings = response.userSettings || getCanvasFPSettings();
      Object.assign(portal.dataset, settingsAdapter(userSettings));
    }
  });
}
