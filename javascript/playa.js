var Playa =
  {
    init: function(name){
      var instance = 
        {
          name: "",
          playlist:{},
          currentTrack: 0,
          totalTracks: 0,
          playHead: 0,
          playing: false,
          id3Info: {},
          setPlayState: function(state){ this.playing = state; },
          setPlayHead: function(time){ this.playHead = time; },
          setCurrentTrack: function(track){
            if(!track)
              track = this.currentTrack;

            var playa = this;
            this.currentTrack = track;
            $("#"+this.name +" .track").each(function(i){
              if(i == playa.currentTrack){
                $(this).addClass("active");
              }else{
                $(this).removeClass("active");
              }
            })
          },
          gotoNext: function(){
            this.setPlayHead(0)

            if(this.currentTrack != this.totalTracks-1)
              this.setCurrentTrack(this.currentTrack += 1);

            return(this.currentTrack);
          },
          gotoPrevious: function(){
            this.setPlayHead(0)

            if(this.currentTrack != 0)
              this.setCurrentTrack(this.currentTrack -= 1);

            return(this.currentTrack);
          },
          playNext: function(){
            this.stop();

            if(this.currentTrack != this.gotoNext())
              this.play(); 
          },
          playPrevious: function(){
            this.stop();

            if(this.currentTrack != this.gotoPrevious())
               this.play(); 
          },
          currentTrackUrl: function(){
            var item = this.playlist[this.currentTrack];

            if(typeof item != 'string')
              { item = item.url };

            return(item);
          },
          play: function(url){
            if(!url)
              url = this.currentTrackUrl();

            if(this.playing == false)
              this.setCurrentTrack()
              this.app.play(this.name, url, this.playHead);
          },
          pause: function(){ this.app.pause(this.name); },
          stop: function(){ this.app.stop(this.name); },
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
    get: {}
  };

$(document).ready(function(){
  $(".playa").each(function(i){
    var element = this;
    var playa; 
    $(this).find(".playlist").each(function(){
      if(this == "[object HTMLInputElement]"){
        playa = Playa.setup(element.id, this.value);
      }else{
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


