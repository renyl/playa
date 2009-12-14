
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
          currentTrackNumber: 0,
          playing: false,
          currentTrack: function(){ return(this.playlist[this.currentTrackNumber]); },
          totalTracks: function(){ return(this.playlist.length - 1); },
          setPlayState: function(state){ this.playing = state; },
          gotoNext: function(){
            if(this.currentTrackNumber != this.totalTracks()){ 
              this.currentTrackNumber += 1;
              this.executeCallback("gotoNext");
              this.executeCallback("activateTrack");
            }

            return(this.currentTrackNumber);
          },
          gotoPrevious: function(){
            if(this.currentTrackNumber != 0){
              this.currentTrackNumber -= 1;
              this.executeCallback("gotoPrevious");
              this.executeCallback("activateTrack");
            }

            return(this.currentTrackNumber);
          },
          playNext: function(){
            this.stop();
            if(this.currentTrackNumber != this.gotoNext()){
              this.play(); 
              this.executeCallback("playNext");
            }
          },
          playPrevious: function(){
            this.stop();
            if(this.currentTrackNumber != this.gotoPrevious()){
               this.play(); 
               this.executeCallback("playPrevious");
            }
          },
          play: function(track, time){
            if(!track){
              track = this.currentTrack();
           }

            if(this.playing == false){
              if(Playa.app().play(this.name, track.url, track.time)==true){
                this.executeCallback("play");
                this.startDoingWhilePlaying();
              }
            }
          },
          pause: function(){
            if(this.playing==true && Playa.app().pause(this.name)==true){
              this.executeCallback("pause");
              this.stopDoingWhilePlaying();
            }
          },
          stop: function(){
            if(Playa.app().stop(this.name)==true){
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
            Playa.current.currentTrack().updatePlayhead(Playa.current);
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
        var finalList = []
        playlist = eval('('+playlist+')')
        for(track in playlist){
          finalList.push(Track.init(playlist[track]))
        };
        playlist = finalList;
      }

      instance = Playa.init(name);
      instance.playlist = playlist;
      instance.executeCallback("activateTrack");
      Playa.add(name, instance);

      return(instance)
    },

    add: function(name, instance) { this.get[name] = instance; },
    get: {},
    current: {},
    setCurrent: function(name){ this.current = this.get[name]; },
    app: function(){FlashInterface.get('Playa')},
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
      if(this.value){
        playa = Playa.setup(element.id, this.value);
      }else{
        var playlist = []
        $(this).find(".track").each(function(i){
          var href;
          var time;
          if(this.href){
            href = this.href;
          }else{
            $(this).find("a").each(function(i){
              if(i==0)
                href = this.href
            });
          }

          $(this).find(".tracktime").each(function(){
            if(this.value){
              time = parseInt(this.value);
            }else{
              time = $(this).text().split(":");
              time = parseInt(time[0])*60 + parseInt(time[1])
            }
          });
          playlist.push(Track.init({url: href, tracktime: time}))
        });
        playa = Playa.setup(element.id, playlist);
          $(this).find(".track").each(function(i){
            $(this).bind("click", function(e){
              playa.stop();
              playa.currentTrackNumber = i;
              playa.play(this.href);
              e.preventDefault()
            });
        });
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


