package {
	import flash.display.Sprite;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.utils.Timer;
	
	public class Playa extends Sprite {
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
		
		private function play(playaName:String, address:String, position:Number=0):void {
			stopIfNewPlaya(playaName);
			var req:URLRequest = new URLRequest(address);
			var sound:Sound = new Sound();
			try {
				sound.load(req);
				channel = sound.play(position);
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayState(true)");
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayHead(0)");
				currentPlayaName = playaName;
				currentTrackUrl  = address;
			}
			catch (err:Error) {
				trace(err.message);
			}
			
			channel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
		}
		
		private function soundCompleteHandler(event:Event):void {
			ExternalInterface.call("Playa.get['"+currentPlayaName+"'].playNext()");
		}
		
		private function pause(playaName:String, force:Boolean=false):void {
			if(playaName == currentPlayaName || force==true){
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayState(false)");
				ExternalInterface.call("Playa.get['"+playaName+"'].setPlayHead("+channel.position+")");
				channel.stop();
			}
		}
		
		private function stop(playaName:String):void {
			if(playaName == currentPlayaName){
				ExternalInterface.call("Playa.get['"+currentPlayaName+"'].setPlayState(false)");
				ExternalInterface.call("Playa.get['"+currentPlayaName+"'].setPlayHead(0)");
				channel.stop();
				playaName = "";
				currentTrackUrl= "";
			}
		}
		
		private function ioErrorHandler(event:Event):void {
			trace("ioErrorHandler: " + event);
		}
		
		private function enterFrameHandler(event:ProgressEvent):void {
			trace("progressHandler: " + event);
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

