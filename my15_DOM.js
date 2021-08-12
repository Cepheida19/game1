
//--------------------------------------------------------------
//  ---------------------------game-----------------------------


//------------------- Представлениe-----------------------------
//------------------lesson15, 16, 17, 18---------------------------
var view = {
	displayMessage: function(msg){
		var messageArea = document.querySelector("#messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

//------------------ Модель поведения игры---------------------

	var model = {
		boardSize: 7,      // размер игрового поля 7 х 7
		numShips: 3,       // количество кораблей в игре
		shipLength: 3,     // длина корабля в клетках
		shipsSunk: 0,      // количество потопленных кораблей
		ships: [
			    { locations: [0, 0, 0], hits: ["", "", ""] },
	            { locations: [0, 0, 0], hits: ["", "", ""] },
	            { locations: [0, 0, 0], hits: ["", "", ""] } 
		],
		fire: function(guess){         // получает координаты выстрела
			for(var i = 0; i < this.numShips; i++){
				var ship = this.ships[i];

				/* location = ship.location;
				   var index = location.indexOf(guess); */

				var index = ship.locations.indexOf(guess);
				if (ship.hits[index] === "hit") {
					view.displayMessage("Oops, you already hit that location!");
					return true;
				} else if (index >= 0) {
					ship.hits[index] = "hit";
					view.displayHit(guess);
					view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
				}
			}
			view.displayMiss(guess);
			view.displayMessage("You missed!");
			return false;
		},
		isSunk: function(ship){
			for(var i=0; i < this.shipLength; i++){
				if(ship.hits[i] !== "hit"){
					return false;
				}
			}
			return true;
		},
		// -----------генерация кораблей------

		generateShipLocations: function(){
			var locations;
			for(var i=0; i < this.numShips; i++){ // генерируем набор позиций для каждого корабля
				do{
					locations = this.generateShip();
				} while(this.collision(locations));
				this.ships[i].locations = locations;
			}
			 console.log("Ships array: ");
			 console.log(this.ships);
		},
		generateShip: function(){
			var direction = Math.floor(Math.random()*2);
			var row, col;

			if(direction === 1){
				// сгенерировать начальн позицию для гориз-го корабля
				row = Math.floor(Math.random() * this.boardSize);
				col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			} else {
				// сгенерировать начальн позицию для верт-го корабля	
				row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
				col = Math.floor(Math.random() * this.boardSize);
			}
			var newShipLocations = [];

			for(var i=0; i < this.shipLength; i++){
				if(direction === 1){
					// добавить в массив для горизониального корабля
					newShipLocations.push(row + "" + (col + i));
				} else{
					// добавить в массив для верт-го корабля
					newShipLocations.push((row + i) + "" + col);
				}
			}
			return newShipLocations;
		},

		collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
					}
				}
			}
			return false;
		}

	};

//------------------------Контроллер-----------------------------
	var controller = {
		gusses: 0,
		processGuess: function(guess){
			var location = parceGuess(guess);
			if(location){
				this.gusses++;
				var hit = model.fire(location);
				if(hit && model.shipsSunk === model.numShips){
					view.displayMessage("Вы потопили все корабли за " + this.gusses + " выстрелов");
				}
			}

		}
	};

	function parceGuess(guess){
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
		if(guess === null || guess.length !== 2){
			alert("Вы ввели неверные координаты");
		} else{
			firstChar = guess.charAt(0);             // извлекаем со строки первый символ
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);

			if(isNaN(row) || isNaN(column)){
				alert("Вы ввели неверные координаты");
			} else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
				alert("Вы ввели неверные координаты");
			} else{
				return row + column;
			}
		}
		return null;
	}

	function init(){
		var fireButton = document.getElementById("fireButton");
		fireButton.onclick = handleFireButton;
		var guessInput = document.getElementById("guessInput");        // с клавишей Enter
		guessInput.onkeypress = handleKeyPress;

		model.generateShipLocations();
	}

	function handleFireButton(){
		var guessInput = document.getElementById("guessInput");
		var guess = guessInput.value;
		controller.processGuess(guess);

		guessInput.value = "";
	}

	function handleKeyPress(e){
		var fireButton = document.getElementById("fireButton");
		// console.log(e.keyCode);
		if(e.keyCode === 13){
			fireButton.click();
			return false;
		}
	}

	window.onload = init;
