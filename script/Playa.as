package {
	import flash.display.Sprite;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.utils.Timer;
	
	public class Playa extends Sprite {
		private var currentSound:Sound;
		private var channel:SoundChannel;
		private var currentTrackUrl:String;
		private var currentPlayaName:String;
		
		
		
		
		public function Playa() {			
			if (ExternalInterface.available) {
				try {
					trace("Adding callbacks...");
					ExternalInterface.addCallback("play", play);
					ExternalInterface.addCallback("pause", pause);
					ExternalInterface.addCallback("stop", stop);
					ExternalInterface.addCallback("playheadPosition", playheadPosition);
		
					
					if (checkJavaScriptReady()) {
						trace("JavaScript is ready.");
					} else {
						trace("JavaScript is not ready, creating timer.");
						var readyTimer:Timer = new Timer(100, 0);
						readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);
						readyTimer.start();
					}
				} catch (error:SecurityError) {
					trace("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					trace("An Error occurred: " + error.message);
				}
			} else {
				trace("External interface is not available for this container.");
		
			}
			
		}
		
		private function stopIfNewPlaya(playaName:String):void {
			try{
			  if(playaName != currentPlayaName)
				  pause(currentPlayaName, true);
			} catch(error:Error) {}
		}
		
		private function playheadPosition():Number{
			return(channel.position);
		}
		
		private function soundCompleteHandler(event:Event):void {
			ExternalInterface.call("Playa.get['"+currentPlayaName+"'].playNext()");
		}
		
		private function updateTrackTime(timer:TimerEvent):void{
			var duration:Number = (currentSound.bytesTotal / (currentSound.bytesLoaded / currentSound.length));
			ExternalInterface.call("Playa.get['"+currentPlayaName+"'].setTrackTime("+currentSound.length+")");
		}
		
		private function play(playaName:String, address:String, position:Number=0):Boolean {
			stopIfNewPlaya(playaName);
			var req:URLRequest = new URLRequest(address);
			var sound:Sound = new Sound();
			try {
				sound.load(req);	
				
				channel = sound.play(position);
				
				currentPlayaName = playaName;
				currentTrackUrl  = address;
				currentSound     = sound;
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayState(true)");
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayhead(0)");
				ExternalInterface.call("Playa.setCurrent('"+playaName+"')");
				
				var readyTimer:Timer = new Timer(500);
				readyTimer.addEventListener(TimerEvent.TIMER, updateTrackTime);
				readyTimer.start();
				
				
			}
			
			catch (err:Error) {
				trace(err.message);
			}
			
			channel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
			return(true);
		}
		
		private function pause(playaName:String, force:Boolean=false):Boolean {
			if(playaName == currentPlayaName || force==true){
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayState(false)");
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayhead("+channel.position+")");
				channel.stop();
				return(true);
			}else{
				return(false);
			}
		}
		
		private function stop(playaName:String):Boolean {
			if(playaName == currentPlayaName){
				ExternalInterface.call("Playa.get['"+currentPlayaName+"'].setPlayState(false)");
				ExternalInterface.call("Playa.get['"+currentPlayaName+"'].setPlayhead(0)");
				channel.stop();
				playaName = "";
				currentTrackUrl= "";
				return(true);
			}else{
				return(false);
			}
		}
		
		private function ioErrorHandler(event:Event):void {
			trace("ioErrorHandler: " + event);
		}
		
		
		private function checkJavaScriptReady():Boolean {
			var isReady:Boolean = ExternalInterface.call("FlashInterface.isReady()");
			return isReady;
		}
		
		private function timerHandler(event:TimerEvent):void {
			var isReady:Boolean = checkJavaScriptReady();
			if (isReady) {
				Timer(event.target).stop();
			}
		}
		
	}
}

