
var Track =
  {
    init: function(args){
      var instance =
        {
          url: '',
          time: 0,
          playhead: 0,
          timeEstablished: false,
          setPlayhead: function(time) { this.playhead = time; },
          establishTime: function(time) {
            this.time = time;
            this.timeEstablished = true;
          }
        };

        instance.url = args.url;

        if(args.time){
          instance.establishTime(args.time);
        }

        if(args.playhead){
          instance.playhead = args.playhead;
        }

        return(instance)
    },

    initWithHTML: function(element){
      var instance;
      if(element.href){
        instance = Track.init({url: element.href});
      }else{
        $(element).find("a").each(function(i){
          instance = Track.init({url: this.href});
        });
      }


      $(element).find(".tracktime").each(function(){
        if(this.value){
          time = parseInt(this.value);
        }else{
          time = $(this).text().split(":");
          time = parseInt(time[0])*60 + parseInt(time[1]);
        }
      });
      return(instance);
    }
  }

