    // Playa written by Evan Short 2009  //
    //          ,,,=^_^=,,,              //

/* available at http://github.com/whtevn/playa */

/* distributed under the mit standard license  */

/************ Sharing is Caring ****************/
//                                             //
// if you have changes to make to this project //
//    fork it on github,                       //
//        and the whole world will love you    //
//                            forever and ever.//
//                                             //
/***********************************************/


var Playa = 
  {
    init: function(args) {
      var instance = 
        {
          name: '',
          state: '',
          playlist: {},
          play: function(){
            track = this.playlist.currentTrack()
            Playa.app().play(track.url, track.playhead, track.timeEstablished);
            this.state = "playing"
          },
          pause: function(){
            if(this.state == "playing"){
              Playa.app().pause(this.name);
              this.state = "paused"
            }
          },
          stop: function(){
            this.playlist.currentTrack().setPlayhead(0);
            if(this.state != "stopped"){
              Playa.app().stop(this.name);
              this.state = "stopped"
            }
          },
          gotoNext: function(){
            var stateWas = this.state;
            this.stop();
            this.playlist.nextTrack();
            if(stateWas == "playing"){
              this.play();
            }
          },
          gotoPrevious: function(){
            var stateWas = this.state;
            this.stop();
            this.playlist.previousTrack();
            if(stateWas == "playing"){
              this.play();
            }
          },
          playIntervalId: '',
          startDoingWhilePlaying: function(){
            this.playIntervalId = setInterval(this.playheadUpdater, 100);
          },
          stopDoingWhilePlaying: function(){
            clearInterval(this.playIntervalId);
          },
          playheadUpdater: function(){
            Playa.current.currentTrack().updatePlayhead(Playa.current);
            Playa.current.executeCallback("playing", Playa.current);
          },
          callbacks: Playa.callbackDefault
        };

        return(instance);
      },

      setup: function(name, playlist) {             
        instance = Playa.init(name);
        instance.playlist = playlist;
        //instance.executeCallback("activateTrack");
        Playa.add(name, instance);

        return(instance)
      },

      add: function(name, instance) { this.get[name] = instance; },
      get: {},
      app: function(){FlashInterface.get('Playa')}
    }
