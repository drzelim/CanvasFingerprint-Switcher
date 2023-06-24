{
  const userFPSettings = self.userFPSettings;

  const originalGetParameterFunction = WebGLRenderingContext.prototype.getParameter;
  const originalGetParameterFunction2 = WebGL2RenderingContext.prototype.getParameter;
  const originalReadPixelsFunction = WebGLRenderingContext.prototype.readPixels;
  const originalReadPixelsFunction2 = WebGL2RenderingContext.prototype.readPixels;

   const changeWebGLFP = function (object) {

    if (!object) object = self;

    object.WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (userFPSettings.isWebglEnable === 'false') {
        return originalGetParameterFunction.apply(this, arguments);
      }

      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalGetParameterFunction.apply(this, arguments);
    };

    object.WebGL2RenderingContext.prototype.getParameter = function (parameter) {
      if (userFPSettings.isWebglEnable === 'false') {
        return originalGetParameterFunction2.apply(this, arguments);
      }

      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalGetParameterFunction2.apply(this, arguments);
    };

     object.WebGLRenderingContext.prototype.readPixels = function () {
       originalReadPixelsFunction.apply(this, arguments);

       if (userFPSettings.isWebglEnable === 'false') return;

       const readPixelsSettings = JSON.parse(userFPSettings.settingsForReadPixelsFunc);
       Object.keys(readPixelsSettings).forEach(key => arguments[6][key] = readPixelsSettings[key]);
     }

     object.WebGL2RenderingContext.prototype.readPixels = function () {
       originalReadPixelsFunction2.apply(this, arguments);

       if (userFPSettings.isWebglEnable === 'false') return;

       const readPixelsSettings = JSON.parse(userFPSettings.settingsForReadPixelsFunc);
       Object.keys(readPixelsSettings).forEach(key => arguments[6][key] = readPixelsSettings[key]);
     }
  };

  changeWebGLFP(window);
  self.addMutationObserver(document, changeWebGLFP);
}
