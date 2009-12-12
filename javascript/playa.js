
    /* Playa written by Evan Short 2009  *
     *          ,,,=^_^=,,,              */

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


// really need to get together an api reference
// and a changelog
// yuck.
var Playa =
  {
    init: function(name){
      var instance = 
        {
          name: "",
          playlist:{},
          currentTrack: 0,
          totalTracks: 0,
          playhead: 0,
          playing: false,
          id3Info: {},
          trackTime: 0,
          setTrackTime: function(time) {
            if(time.toFixed(0) != NaN){
              this.trackTime = time.toFixed(0);
            }
          },
          setPlayState: function(state){ this.playing = state; },
          setPlayhead: function(time){ this.playhead = time.toFixed(0); },
          updatePlayhead: function() { this.setPlayhead(this.app.playheadPosition()); },
          setCurrentTrack: function(track){
            if(!track){
              track = this.currentTrack;
            }

            try {
              this.trackTime = this.playlist[this.currentTrack].tracktime;
            } catch(err) { }
            this.executeCallback("activateTrack");
          },
          gotoNext: function(){
            this.setPlayhead(0);

            if(this.currentTrack != this.totalTracks-1){ 
              this.setCurrentTrack(this.currentTrack += 1);
              this.executeCallback("gotoNext");
            }

            return(this.currentTrack);
          },
          gotoPrevious: function(){
            this.setPlayhead(0);

            if(this.currentTrack != 0){
              this.setCurrentTrack(this.currentTrack -= 1);
              this.executeCallback("gotoPrevious");
            }

            return(this.currentTrack);
          },
          playNext: function(){
            this.stop();
            if(this.currentTrack != this.gotoNext()){
              this.play(); 
              this.executeCallback("playNext");
            }
          },
          playPrevious: function(){
            this.stop();
            if(this.currentTrac != this.gotoPrevious()){
               this.play(); 
               this.executeCallback("playPrevious");
            }
          },
          currentTrackUrl: function(){
            var item = this.playlist[this.currentTrack];

            if(typeof item != 'string'){
              item = item.url;
            }

            return(item);
          },
          play: function(url, time){
            if(!url){
              url = this.currentTrackUrl();
           }
            
            if(!time){
              time = this.playhead;
            }

            if(this.playing == false){
              if(this.app.play(this.name, url, time)==true){
                this.executeCallback("play");
                this.startDoingWhilePlaying();
              }
            }
          },
          pause: function(){
            if(this.playing==true && this.app.pause(this.name)==true){
              this.executeCallback("pause");
              this.stopDoingWhilePlaying();
            }
          },
          stop: function(){
            if(this.app.stop(this.name)==true){
              this.stopDoingWhilePlaying();
            }

            this.executeCallback("stop");
          },
          playIntervalId: '',
          playheadUpdater: function(){
            /*
             * setInterval re-scopes everything to window
             * Playa only has a .current because of that
             * it is very disspointing to me that these
             * functions have to be called this way. 
             * very dissapointing, indeed.
             */
            Playa.current.updatePlayhead(Playa.current);
            Playa.current.executeCallback("playing", Playa.current);
          },
          doOn: Playa.callbackDefault,
          executeCallback: function(name, playa){
            if(!playa){
              playa = this;
            }

            try {
              this.doOn[name](playa);
            } catch(err){ try { Playa.callbackDefault[name](playa);
              } catch(err){ }
            }
          },
          startDoingWhilePlaying: function(){
            this.playIntervalId = setInterval(this.playheadUpdater, 100);
          },
          stopDoingWhilePlaying: function(){
            clearInterval(this.playIntervalId);
          },

        };
      instance.name = name;
      return(instance);
    },

    setup: function(name, playlist) {             
      if(typeof playlist == "string"){
        playlist = eval('('+playlist+')');
      }

      // need to go through the playlist
      // and make a track instance for each member
      // and then store it in the playlist as a track

      // need to pull all track logic out of here
      // and put it in there

      instance = Playa.init(name);
      instance.playlist = playlist;

      // this should be a method that actually returns
      // the length of the playlist
      instance.totalTracks = Playa.countTracks(playlist);


      instance.setCurrentTrack(0);
      instance['app'] = FlashInterface.get('Playa');
      Playa.add(name, instance);

      return(instance)
    },

    countTracks: function(playlist){ return(playlist.length) },
    add: function(name, instance) { this.get[name] = instance; },
    get: {},
    current: {},
    setCurrent: function(name){ this.current = this.get[name]; },
    callbackDefault: {}
  };


// this needs to be extracted into something worthwhile
// like a module with functions to get what is needed

// i think this is what is meant as "self-documenting code"

$(document).ready(function(){
  $(".playa").each(function(i){
    var element = this;
    var playa; 
    $(this).find(".playlist").each(function(){
      if(!this.value){
        var playlist = []
        $(this).find(".track").each(function(i){
          var href;
          var time;
          if(!this.href){
            $(this).find("a").each(function(i){
              if(i==0)
                href = this.href
            });
          }else{
            href = this.href;
          }

          $(this).find(".tracktime").each(function(){
            if(this.value){
              time = parseInt(this.value);
            }else{
              time = $(this).text().split(":");
              time = parseInt(time[0])*60 + parseInt(time[1])
            }
          });
          if(!time){ time = 0}
          playlist.push({url: href, tracktime: time})
        });
        playa = Playa.setup(element.id, playlist);
          $(this).find(".track").each(function(i){
            $(this).bind("click", function(e){
              playa.stop();
              playa.currentTrack = i;
              playa.play(this.href);
              e.preventDefault()
            });
        });
      }else{
        playa = Playa.setup(element.id, this.value);
      }
    });
    $(this).find(".play").each(function(){
      $(this).bind("click", function(e){
        playa.play();
      });
    });
    $(this).find(".pause").each(function(){
      $(this).bind("click", function(e){
        playa.pause();
      });
    });
    $(this).find(".stop").each(function(){
      $(this).bind("click", function(e){
        playa.stop(); 
      });
    });
    $(this).find(".next").each(function(){
      $(this).bind("click", function(e){
        if(playa.playing==true){
          playa.playNext(); 
        }else{
          playa.gotoNext();
        }
      });
    });
    $(this).find(".previous").each(function(){
      $(this).bind("click", function(e){
        if(playa.playing==true){
          playa.playPrevious(); 
        }else{
          playa.gotoPrevious();
        }
      });
    });
  });
  FlashInterface.pageInit();
});


