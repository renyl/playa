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
          gotoTrack: function(number){
            var stateWas = this.state;
            if(number || number == 0){
              this.playlist.gotoTrack(number)  
            }
            if(stateWas == "playing"){
              this.stop();
              this.play();
            }
            this.executeCallback("activateTrack");
          },
          gotoNext: function(){
            // need some way to say beforeGotoNext and
            // if it returns false
            // make these next two lines not execute
            this.playlist.nextTrack()
            this.gotoTrack();
          },
          gotoPrevious: function(){
            this.playlist.previousTrack()
            this.gotoTrack();
          },
          trackFinished: function(){
            if(this.playlist.onLastTrack() == true){
              this.executeCallback("onPlaylistEnd")
            }else{
              this.executeCallback("onTrackEnd")
            }
          },
          setTrackTime: function(time){
            this.playlist.currentTrack().setTrackTime(time)
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
        instance['app'] = FlashInterface.get('Playa');
        instance.executeCallback("activateTrack");

        Playa.add(name, instance);

        return(instance)
      },

      add: function(name, instance) { this.get[name] = instance; },
      get: {},
      pauseAll: function(){
        for(playa in this.get){ this.get[playa].pause(); }
      },
      stopAll: function(){
        for(playa in this.get){ this.get[playa].stop(); }
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
        Playa.current.executeCallback("playing", Playa.current);
      },
    }
