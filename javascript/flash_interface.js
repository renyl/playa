var FlashInterface =
  {
    jsReady: false,  
    isReady: function() {
      return(this.jsReady);
    },
    pageInit: function() {
      this.jsReady = true;
    },
    get:  function(name){
        alert(window['Playa'])
      if (navigator.appName.indexOf("Microsoft") != -1) {
        return(window[name]);
      } else {
        return(document[name]);
      }
    }
  };

