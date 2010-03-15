$(function() {
	var moveIncrement = 60;
	var boardHeight = 480;
	var paddleHeight = 60;
	var animationDuration = "fast";
	var whichPlayer = null;
	
	$(document).keydown(function(event) {
		
		switch(event.which) {
			case 38: //up
				webSocket.send(whichPlayer + "_" + "up");
			break;
			case 40: //down
				webSocket.send(whichPlayer + "_" + "down");
			break;
		}
	});
	
	var webSocket = new WebSocket('ws://localhost:8080/pong');

  webSocket.onopen = function(event){
      webSocket.send('new-player');
  };

  webSocket.onmessage = function(event){
    var response = JSON.parse(event.data);

		if(response.message.match(/^ball_movement$/)) {			
			$('#puck').css('left', response.x).css('top', response.y);
		}
		
		if(response.message.match(/^activate$/)) {
			whichPlayer = response.player;
		}
		
		if(response.message.match(/^player_one_move$/)) {
			var player = $('#left');
			player.animate({
				top: response.top + "px"
			}, 100);
		}
		
		if(response.message.match(/^player_two_move$/)) {
			var player = $('#right');
			player.animate({
				top: response.top + "px"
			}, 100);
		}
		
		if(response.message.match(/^score_update$/)) {
			var score = response.player_one_score + " : " + response.player_two_score;
			$('#message').html(score);
		}
  };

  webSocket.onclose = function(event){
    
  };
	
});