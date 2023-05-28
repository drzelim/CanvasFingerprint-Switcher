{
  self.addMutationObserver = (element, cb) => {
    const config = {attributes: true, childList: true, subtree: true};

    const callback = function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList'
          && mutation.addedNodes.length
          && mutation.addedNodes[0].tagName === 'IFRAME') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const frame = mutation.addedNodes[i];
            try {
              cb(frame.contentWindow);
            } catch {}
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(element, config);
  };
}
