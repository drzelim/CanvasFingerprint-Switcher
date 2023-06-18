{
  const userFPSettings = self.userFPSettings;

  const originalFunction = WebGLRenderingContext.prototype.getParameter;
  const originalFunction2 = WebGL2RenderingContext.prototype.getParameter;

  const changeWebGLFP = function (object) {

    if (!object) object = self;

    object.WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (userFPSettings.isWebglEnable === 'false') {
        return originalFunction.apply(this, arguments);
      }

      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalFunction.apply(this, arguments);
    };

    object.WebGL2RenderingContext.prototype.getParameter = function (parameter) {
      if (userFPSettings.isWebglEnable === 'false') {
        return originalFunction2.apply(this, arguments);
      }

      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalFunction2.apply(this, arguments);
    };
  };

  changeWebGLFP(window);
  self.addMutationObserver(document, changeWebGLFP);
}
