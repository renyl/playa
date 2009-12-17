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
          playlist: [],
          play: function(){
            if(this.state != "playing"){
              var track  = this.playlist.currentTrack()
              this.app.play(track.url, track.playhead, track.timeEstablished);
              this.state = "playing"
              this.executeCallback("play")
              Playa.startDoingWhilePlaying(this.name)
            }
          },
          pause: function(){
            if(this.state == "playing"){
              this.app.stop();
              this.state = "paused"
            }
          },
          stop: function(){
            this.playlist.currentTrack().setPlayhead(0);
            if(this.state != "stopped"){
              this.app.stop();
              this.state = "stopped"
              this.executeCallback("stop")
              Playa.stopDoingWhilePlaying();
            }
          },
          gotoNext: function(){
            var stateWas = this.state;
            this.playlist.nextTrack();
            if(stateWas == "playing"){
              this.stop();
              this.play();
            }
            this.executeCallback("activateTrack");
          },
          gotoPrevious: function(){
            var stateWas = this.state;
            this.playlist.previousTrack();
            if(stateWas == "playing"){
              this.stop();
              this.play();
            }
            this.executeCallback("activateTrack");
          },
          trackFinished: function(){
            if(this.playlist.onLastTrack() == true){
              this.executeCallback("onPlaylistEnd")
            }else{
              this.executeCallback("onTrackEnd")
            }
          },
          callback: Playa.callbackDefault,
          executeCallback: function(name, playa){
            if(!playa){ playa = this; }

            try {
              this.callback[name](playa);
            } catch(err){
              try {
                Playa.callbackDefault[name](playa);
              } catch(err){ }
            }
          }
        };

        return(instance);
      },

      setup: function(name, playlist) {             
        instance = Playa.init();
        instance.playlist = playlist;
        instance.name = name;
        instance['app'] = FlashInterface.get('Playa2');
        instance.executeCallback("activateTrack");

        Playa.add(name, instance);

        return(instance)
      },

      add: function(name, instance) { this.get[name] = instance; },
      get: {},
      pauseAll: function(){
        for(playa in this.get){
          this.get[playa].pause();
        }
      },
      playIntervalId: '',
      setCurrent: function(name){ this.current = this.get[name] },
      current: {},
      startDoingWhilePlaying: function(name){
        this.setCurrent(name)
        this.playIntervalId = setInterval(this.playheadUpdater, 100);
      },
      stopDoingWhilePlaying: function(){
        clearInterval(this.playIntervalId);
      },
      playheadUpdater: function(){
        Playa.current.playlist.currentTrack().setPlayhead(Playa.current.app.playheadPosition());
      }
    }
