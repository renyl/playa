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
              this.state = "playing"
              this.app.play(track.url, track.playhead, track.timeEstablished);
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
          },
          gotoPrevious: function(){
            var stateWas = this.state;
            this.playlist.previousTrack();
            if(stateWas == "playing"){
              this.stop();
              this.play();
            }
          },
          continueState: function(){
          },
          callbacks: Playa.callbackDefault
        };

        return(instance);
      },

      setup: function(name, playlist) {             
        instance = Playa.init();
        instance.playlist = playlist;
        instance.name = name;
        instance['app'] = FlashInterface.get('Playa2');

        //instance.executeCallback("activateTrack");
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
      currentName: '',
      current: function(){ return(this.get[this.currentName]) },
      startDoingWhilePlaying: function(name){
        this.currentName = name
        this.playIntervalId = setInterval(this.playheadUpdater, 100);
      },
      stopDoingWhilePlaying: function(){
        this.currentName = ''
        clearInterval(this.playIntervalId);
      },
      playheadUpdater: function(){
        if(Playa.current()){
          Playa.current().playlist.currentTrack().setPlayhead(Playa.current().app.playheadPosition());
        }
      }
    }
