var words = ["boat", "cat", "dog", "rabbit", "crow", "cow", "cheese", "jquery", "javascript", "lol", "no", "idea", "more", "koodaa", "it", "generator", "soon", "or", "else", "go", "nerves", "school", "course", "internet", "summer", "sauna", "beer", "party", "job", "screen", "car", "semester", "payment", "yahoo", "card", "sticker", "thread", "monkey", "bar", "cheddar", "dvd", "elektro", "pharaoh", "gorilla", "acre", "indie", "christmas", "cocoa", "suburb", "monday", "witch", "opera", "pastasauce", "quesadilla", "rally", "television", "unique", "old", "guitar", "environment", "zorro", "buffy", "confused", "over", "magnet", "board", "table", "form"];
var wordsVisible = [];
var points = 0;

$(document).ready(function(){

/*	Select the text input with jQuery and add an event handler that checks the input against the words in the game*/
	var $answerBox = $('#answer');

	$answerBox.keyup(function(){

		if(deleteWord($answerBox.val().toLowerCase()) === true){
			$answerBox.val("");
		}
		
	});

	$('#answerform').submit(function(){
		return false;
	});

/*	Create the game area, add first one to the area and then start running the game*/
 	createGameArea();
 	addWordToGame();
 	runGame();

 });

/*Selects the div "gamearea" with jQuery and adds 200 divs with the class "square" into it.
Each square has a unique id number ranging from 1 to 200. These are used to locate the squares. Each row has 20 squares and there are 10 rows
TO-DO: Contain each row inside its own div*/

function createGameArea(){

	for( var j = 0; j < 10; j++){
		$('#gamearea').append('<div id="row' + j + '" class="row"></div>');

	 	for(var i = j * 20; i < (j * 20 + 20); i++){
 			$('#row' + j).append('<div id="' + (i + 1) + '" class="square"></div>');

		}
 	}
}


/*Adds a new word to the top row at random location. The divs with the letters of that row are given a class named after that word.
Checks if the word is already in the game and if it is, it selects another random word until there isn't to prevent duplicates.
Adds the new word to array wordsVisible, which holds all the words visible in the game at that moment.
Also, if there is no space available for the word at the random location, it will try another location for 15 times after which it gives up and returns false.
TO-DO: Check whether there is any duplicate code with detectCollision and if there is, make this function use that instead*/
 function addWordToGame(){

	var word;
	var enoughSpace = false;
	var x_pos = 0;

 	do{
		word = words[Math.floor(Math.random() * words.length)];
 	}while(wordsVisible.indexOf(word) !== -1);

 	wordsVisible.push(word);

 	var end = 0;

 	do{
 		x_pos = Math.floor(Math.random() * 20 + 2) - word.length;

 		for(var i = x_pos; i <= 20; i++){
 			if($('#' + i).html() !== ""){
 				enoughSpace = false;
 				break;
 			}
 			else{
 				enoughSpace = true;
 			}
 		}
 		end++;
 	}while((x_pos <= 0 || (enoughSpace === false)) && end < 15);

	if(enoughSpace === true){
	 	for(var i = 0; i < word.length; i++){
			var $letter = $('#' + (x_pos + i));

	 		$letter.html(word[i]);
	 		$letter.addClass(word);
		}
 	}else{
 		return false;
 	}
 }

/*Moves the word passed as argument one row down if there is room. Function detectCollision is used to check whether there is.
If there is room below, the squares now attended are made empty, their class based on the word is removed and those are added to square divs one row below.*/
 function descendWord(wordToMove){
 	var $wordToMove = $('.' + wordToMove);
	

 	if(parseInt($wordToMove.attr('id')) <= 180){

		if(detectCollision($wordToMove) === false){
			$wordToMove.each(function(){

				var id = parseInt($(this).attr('id'));

 				var $squareBelow = $('#' + (id + 20));

				$squareBelow.html($(this).html());
				$squareBelow.addClass(wordToMove);

				$(this).removeClass(wordToMove);
				$(this).html("");
			});
		}
 	}
 	
 }

/*Checks whether the squares below the given word are all empty. Returns true if they are and false if they aren't.*/
 function detectCollision($wordToMove){
 	var collisions = [];

 		$wordToMove.each(function(){
			var id = parseInt($(this).attr('id'));

 			var $squareBelow = $('#' + (id + 20));

 			if($squareBelow.html() !== ""){
 				collisions.push(true);
 			}

 		});

	if(collisions.length === 0){
		return false;
	}else{
		return true;
	}
 }

/*Runs the game. Adds a new word and moves existing ones down every second(or whatever the interval is set to). 
If addWordTogame returns false, then the intervalID is cleared, answerBox is disabled and the game ends.*/
function runGame(){

	var intervalID = window.setInterval(function(){

	 	for(var i = 0; i < wordsVisible.length; i++){
	 		descendWord(wordsVisible[i]);
	 	}

	 	if(addWordToGame() === false){
	 		clearInterval(intervalID);

			alert("Game Over!");
	 		
	 		var $answerBox = $('#answer');
	 		
	 		$answerBox.off();
	 		$answerBox.val("");
	 		$answerBox.attr("disabled", "disabled")
	 	}
	}, 1200);
}

/*If the parameter word is found in the array wordsVisible, it is deleted from the gamearea and the array.
Also the class based on the word in square divs is removed.
If the word is found, calculatePoints(word) is called to add points for the in question.*/
function deleteWord(word){
	
	if(wordsVisible.indexOf(word) === -1){
		console.log("Word \"" + word + "\" not found");
		return false;

	}else{

		var $wordToDelete = $('.' + word);

		$wordToDelete.removeClass(word);
		$wordToDelete.html("");
		wordsVisible.splice(wordsVisible.indexOf(word), 1);
		console.log("Word \"" + word + "\" deleted");

		calculatePoints(word);

		return true;

	}
}

/*Adds points based on the length of the word*/
function calculatePoints(word){

	points += word.length;

	$('#score').html(points);
}