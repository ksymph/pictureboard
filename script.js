const testForm = document.getElementById("test");
const testInput = document.getElementById("test-input");
const retrieveButton = document.getElementById("retrieve");
const output = document.getElementById("output");

const debugButton = document.getElementById("debug-button");

const tileGrid = document.querySelectorAll(".tile");

let tiles = {};
let boards = {};

class Tile {
	constructor(jsonData) {
		this.face = jsonData["face"];
		this.title = jsonData["title"];
		this.clips = jsonData["clips"];
	}
}

async function loadTiles() {
	const response = await fetch("tiles.json");
	const tilesJson = await response.json();
	let tiles = {};

	for (const [name, tile] of Object.entries(tilesJson)) {
		let tileTemp = new Tile(tile);
		tiles[name] = tileTemp;
	}
	return tiles;
}

async function loadBoards(tiles) {
	const response = await fetch("boards.json");
	const boardsJson = await response.json();
	let boards = [];
	for (const [name, board] of Object.entries(boardsJson)) {
		let boardObj = {
			title: board["title"],
			icon: board["icon"],
			tiles: []
		};
		for (const tile of board["tiles"]) {
			boardObj.tiles.push(tiles[tile]);
		}
		boards[name] = boardObj;
	}
	return boards;
}


testForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = testInput.value;

	localStorage.setItem("test", text);
});

retrieveButton.addEventListener("click", () => {
	output.innerText = localStorage.getItem("test");


});

debugButton.addEventListener("click", () => {
	fillBoard("animals")

})

function fillBoard(boardId) {
	board = boards[boardId];
	console.log(board);
	for (var i = 0; i < board.tiles.length; i++) {
		const tileObj = board.tiles[i];
		const tileDom = tileGrid[i];
		// tileGrid[i].id = tile.title;
		tileDom.innerHTML = `
			<img class="tab-img" src="${tileObj.face}">
			<video class="hidden">
				<source src="${tileObj.clips[Math.floor(Math.random()*tileObj.clips.length)]}" type="video/mp4">
			</video>
		`;


		tileDom.addEventListener("click", () => {
			if(tileDom.classList.contains("flipped")) {
				console.log("unflip!");


				tileDom.classList.toggle("flipped");

				window.setTimeout(function() {
					tileDom.style = null;
					positionTilesAll()
				}, 1000);
			} else {
				console.log("flip!");
				positionTileAbsolute(tileDom);

				tileDom.style.zIndex = 5;

				window.setTimeout(function() {
					tileDom.classList.toggle("flipped");
				}, 10);
			}

		});

	}
}

function positionTilesAll() {
	for (var i = 0; i < tileGrid.length; i++) {
		const y = Math.floor(i / 6) + 1;
		const x = (i % 6) + 1;
		tileGrid[i].style.gridColumn = x;
		tileGrid[i].style.gridRow = y;
	}
}

function clearTileStyle() {
	for (var i = tileGrid.length-1; i >= 0; i--) {
		tileGrid[i].style = null;
	}
}

function positionTileAbsolute(tile) {
	let rect = tile.getBoundingClientRect();

	tile.style.position = "absolute";
	tile.style.gridArea = null;
	tile.style.left = rect.left + "px";
	tile.style.top = rect.top + "px";
	tile.style.width = rect.width + "px";
	tile.style.height = rect.height + "px";
	tile.style.margin = 0;
}


async function main() {
	tiles = await loadTiles();
	boards = await loadBoards(tiles);
	positionTilesAll();
}

main()
