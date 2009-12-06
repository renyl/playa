     /* Playa written by Evan Short 2009 */

/* available at http://github.com/whtevn/playa */

/* distributed under the mit standard license  */

/************ Sharing is caring ****************/
//                                             //
// if you have changes to make to this project //
//    fork it on github,                       //
//        and the whole world will love you    //
//                            forever and ever.//
//                                             //
/***********************************************/

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
          setTrackTime: function(time) { this.trackTime = time; },
          setPlayState: function(state){ this.playing = state; },
          setPlayhead: function(time){ this.playhead = time; },
          updatePlayhead: function() { this.setPlayhead(this.app.playheadPosition()); },
          setCurrentTrack: function(track){
            if(!track)
              track = this.currentTrack;

            var playa = this;
            this.currentTrack = track;
            $("#"+this.name +" .track").each(function(i){
              var active_track = (i == playa.currentTrack)
              if(active_track){
                $(this).addClass("active");
              }else{
                $(this).removeClass("active");
              }
              this.doOnActivateTrack(this, active_track);
            })
          },
          gotoNext: function(){
            this.setPlayhead(0)

            if(this.currentTrack != this.totalTracks-1)
              this.setCurrentTrack(this.currentTrack += 1);

            return(this.currentTrack);
          },
          gotoPrevious: function(){
            this.setPlayhead(0)

            if(this.currentTrack != 0)
              this.setCurrentTrack(this.currentTrack -= 1);

            return(this.currentTrack);
          },
          playNext: function(){
            this.stop();
            if(this.currentTrack != this.gotoNext()){
              this.play(); 
              this.doOnPlayNext();
            }
          },
          playPrevious: function(){
            this.stop();
            if(this.currentTrac != this.gotoPrevious()){
               this.play(); 
               this.doOnPlayPrevious();
            }
          },
          currentTrackUrl: function(){
            var item = this.playlist[this.currentTrack];

            if(typeof item != 'string')
              { item = item.url };

            return(item);
          },
          play: function(url, time){
            if(!url)
              url = this.currentTrackUrl();
            
            if(!time)
              time = this.playhead

            if(this.playing == false){
              this.setCurrentTrack()
              if(this.app.play(this.name, url, time)==true){
                this.doOnPlay();
                this.startDoingWhilePlaying();
              }
            }
          },
          pause: function(){
            if(this.playing==true && this.app.pause(this.name)==true){
              this.doOnPause();
              this.stopDoingWhilePlaying();
            }
          },
          stop: function(){
            if(this.app.stop(this.name)==true){
              this.stopDoingWhilePlaying();
            }
            this.doOnStop();
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
            Playa.current.updatePlayhead();
            Playa.current.doWhilePlaying();
          },
          doOnPlay: function(){},
          doOnPause: function(){},
          doOnStop: function(){
            this.updateDisplay("0/"+(this.trackTime/1000).toFixed(0));
          },
          doOnPlayNext: function(){},
          doOnPlayPrevious: function(){},
          doOnActivateTrack: function(element, active){};
          doWhilePlaying: function(){
            var playheadDisplay = (this.playhead/1000)
            playheadDisplay = playheadDisplay.toFixed(0)
            playheadDisplay = playheadDisplay +"/"+(this.trackTime/1000).toFixed(0);
            this.updateDisplay(playheadDisplay); 
          },
          startDoingWhilePlaying: function(){
            this.playIntervalId = setInterval(this.playheadUpdater, 100);
          },
          stopDoingWhilePlaying: function(){
            clearInterval(this.playIntervalId);
          },
          updateDisplay: function(text){
            $("#"+this.name +" .display").each(function(i){
              $(this).text(text);
            })
          }

        };
      instance.name = name;
      return(instance);
    },

    setup: function(name, playlist) {             
      if(typeof playlist == "string")
        playlist = eval('('+playlist+')');

      instance = Playa.init(name);
      instance.playlist = playlist;
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
    setCurrent: function(name){ this.current = this.get[name]; }
  };

$(document).ready(function(){
  $(".playa").each(function(i){
    var element = this;
    var playa; 
    $(this).find(".playlist").each(function(){
      if(!this.value){
        var playlist = []
        $(this).find(".track").each(function(i){
          var href 
          if(!this.href){
            $(this).find("a").each(function(i){
              if(i==0)
                href = this.href
            });
          }else{
            href = this.href;
          }
          playlist.push(href)
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
    $(this).find(".display").each(function(){
      playa["display"] = this;
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


