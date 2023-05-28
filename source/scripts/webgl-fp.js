{
  const userFPSettings =  self.userFPSettings;
  const changeWebGLFP = function (object) {
    if (userFPSettings.isWebglEnable === 'false') return;
    if (!object) object = self;

    const originalFunction = object.WebGLRenderingContext.prototype.getParameter;
    object.WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalFunction.apply(this, arguments);
    };

    const originalFunction2 = object.WebGL2RenderingContext.prototype.getParameter;
    object.WebGL2RenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37446) return userFPSettings.renderer || 'Intel Iris OpenGL Engine';
      if (parameter === 37445) return userFPSettings.vendor || 'Intel Inc.';
      return originalFunction2.apply(this, arguments);
    };
  }

  changeWebGLFP(window);
  self.addMutationObserver(document, changeWebGLFP);
}
