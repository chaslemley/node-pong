var sys = require("sys");

player_one = null;
player_two = null;
game_ready = false;
ball_x = 395;
ball_y = 235;
ball_dx = 1;
ball_dy = -1;
player_one_top = 0;
player_two_top = 0;
player_one_score = 0;
player_two_score = 0;
volley_length = 0;

var Module = this.Module = function(){
	this.server = null;
	
	this.sendMessageToPlayers = function(message) {

	};
	
	this.interval = setInterval(function() {		
		if(ball_x == 0 || ball_x > 790) {
			ball_dx = ball_dx * -1;
		}
		
		if(ball_y == 0 || ball_y > 470)
			ball_dy = ball_dy * -1;
			
			
		if(ball_x == 12 && player_one_top <= ball_y && player_one_top + 60 >= ball_y) {
			sys.puts("boing!!!");
			volley_length++;
			ball_dx = ball_dx * -1;
			if(game_ready)
			{
				player_one.send(JSON.stringify({message: 'volley', volley_length: volley_length}));
				player_two.send(JSON.stringify({message: 'volley', volley_length: volley_length}));
			}
		}
		
		if(ball_x == 778 && player_two_top <= ball_y && player_two_top + 60 >= ball_y) {
			sys.puts("boing!!!");
			volley_length++;
			ball_dx = ball_dx * -1;
			if(game_ready)
			{
				player_one.send(JSON.stringify({message: 'volley', volley_length: volley_length}));
				player_two.send(JSON.stringify({message: 'volley', volley_length: volley_length}));
			}
		}
		
		if(ball_x == 0) {
			player_two_score++;
			volley_length = 0;
			var msg = JSON.stringify({ message: 'score_update', player_one_score: player_one_score, player_two_score: player_two_score });		

			if(game_ready)
			{
				player_one.send(msg);
				player_two.send(msg);
			}
			ball_x = 395;
			ball_y = 235;
		}
		else if(ball_x == 790) {
			player_one_score++;
			volley_length = 0;
			var msg = JSON.stringify({ message: 'score_update', player_one_score: player_one_score, player_two_score: player_two_score });		

			if(game_ready)
			{
				player_one.send(msg);
				player_two.send(msg);
			}
			ball_x = 395;
			ball_y = 235;
		}
		
		ball_x = ball_x + ball_dx;
		ball_y = ball_y + ball_dy;
	
		var msg = JSON.stringify({ message: 'ball_movement', x: ball_x, y: ball_y });		
		
		if(game_ready)
		{
			player_one.send(msg);
			player_two.send(msg);
		}
		
	}, 15);
};


Module.prototype.onData = function(data, connection){
 	if(data.match(/^new-player$/))
	{
		if(player_one == null)
		{
			player_one = connection;
			sys.puts("Player One Connected");
			player_one.send(JSON.stringify({message:'activate',player:"one"}))
		}
		else if(player_two == null)
		{
			player_two = connection;
			sys.puts("Player Two Connected");
			player_two.send(JSON.stringify({message:'activate',player:"two"}))
			game_ready = true;
		}
	}
	
	if(data.match(/^(one|two)(.*)$/)) {
		direction = data.substr(4);
		player_number = data.substr(0, 3);
			
		if(direction == "up" && player_one_top > 0 && player_number == "one")
			player_one_top -= 60;
		if(direction == "down" && player_one_top < 420 && player_number == "one")
			player_one_top += 60;
			
		if(direction == "up" && player_two_top > 0 && player_number == "two")
			player_two_top -= 60;
		if(direction == "down" && player_two_top < 420 && player_number == "two")
			player_two_top += 60;
		
		if(game_ready)
		{
			if(player_number == "one")
				msg = JSON.stringify({message:"player_" + player_number + "_move", top:player_one_top})
			else
				msg = JSON.stringify({message:"player_" + player_number + "_move", top:player_two_top})
				
			player_one.send(msg);
			player_two.send(msg);
		}
	}
};

Module.prototype.onDisconnect = function(connection){
	this.removeConnection(connection);
};