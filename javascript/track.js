
var Track =
  {
    init: function(args){
      var instance =
        {
          url: '',
          time: 0,
          playhead: 0,
          timeEstablished: false,
          setPlayhead: function(time) {time=parseInt(time); this.playhead = time; },
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
      var args = {};
      if(element.href){
        args['url'] = element.href;
      }else{
        $(element).find("a").each(function(i){
          args['url'] = this.href;
        });
      }


      $(element).find(".tracktime").each(function(){
        if(this.value){
          args['time'] = parseInt(this.value);
        }else{
          args['time'] = $(this).text().split(":");
          args['time'] = parseInt(args['time'][0])*60 + parseInt(args['time'][1]);
        }
      });
      instance = Track.init(args)
      return(instance);
    }
  }

