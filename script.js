const testForm = document.getElementById("test");
const testInput = document.getElementById("test-input");
const retrieveButton = document.getElementById("retrieve");
const output = document.getElementById("output");

const debugButton = document.getElementById("debug-button");


const tileGrid = document.querySelectorAll(".tile");
const boardDom = document.querySelector("#board");

const navBoards = document.querySelector("#nav-boards");
const menuButton = document.querySelector("#nav-menu-button");

const configPane = document.querySelector("#config");
const boardSelectCheckboxes = document.querySelectorAll("#board-select input");

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

/*
testForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = testInput.value;

	localStorage.setItem("test", text);
});

*/
/*
retrieveButton.addEventListener("click", () => {
	output.innerText = localStorage.getItem("test");


});

*/

debugButton.addEventListener("click", () => {
	fillBoard("animals")

});
// let myCallback = () => {};
function fillBoard(boardId) {
	board = boards[boardId];
	for (var i = 0; i < board.tiles.length; i++) {
		const tileObj = board.tiles[i];
		const tileDom = tileGrid[i];

		tileDom.innerHTML = null;

		tileDom.innerHTML = `
			<img class="tab-img" src="${tileObj.face}">
			<video>
				<source src="${tileObj.clips[Math.floor(Math.random()*tileObj.clips.length)]}" type="video/mp4">
			</video>
		`;

		const myCallback = () => {
			const video = tileDom.querySelector("video");
			if(tileDom.classList.contains("flipped")) {
				console.log("unflip!");
				video.pause();
				boardDom.style.pointerEvents = "none";
				tileDom.style.pointerEvents = null;

				tileDom.classList.toggle("flipped");

				window.setTimeout(function() {
					tileDom.style = null;
					positionTilesAll()
					boardDom.style.pointerEvents = null;
				}, 1000);
			} else {
				console.log("flip!");
				positionTileAbsolute(tileDom);

				const videoSource = video.querySelector("source");
				videoSource.src = tileObj.clips[Math.floor(Math.random()*tileObj.clips.length)];
				video.load()

				boardDom.style.pointerEvents = "none";

				tileDom.style.zIndex = 5;

				window.setTimeout(function() {
					tileDom.classList.toggle("flipped");
				}, 10);
				window.setTimeout(function() {
					video.play();
					// boardDom.style.pointerEvents = null;
					tileDom.style.pointerEvents = "all";
				}, 1000);
			}
		}

		tileDom.removeEventListener("click", myCallback);
		tileDom.addEventListener("click", myCallback);

	}
}

function positionTilesAll() {
	let rows = 4;
	let cols = 6;
	if(window.innerWidth < window.innerHeight) {
		rows = 6;
		cols = 4;
	}
	document.body.style.setProperty("--row-count", rows);
	document.body.style.setProperty("--col-count", cols);
	for (var i = 0; i < tileGrid.length; i++) {
		const y = Math.floor(i / cols) + 1;
		const x = (i % cols) + 1;
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

function handleBoardSelection(event) {
	localStorage.setItem("board-" + event.target.name, event.target.checked);
	fillNavbar();
}

function fillNavbar() {
	navBoards.innerHTML = null;
	for (const [name, board] of Object.entries(boards)) {
		isEnabled = localStorage.getItem("board-" + name);
		if (isEnabled === "true") {
			navBoards.innerHTML += `
				<div class="tab-button" data-board="${name}">
					<img class="tab-img" src="/assets/board_${name}.svg" width="64" height="64">
				</div>
			`;
		}
	}
	const navButtons = navBoards.querySelectorAll(".tab-button");
	for (const button of navButtons) {
		button.addEventListener("click", () => {
			fillBoard(button.getAttribute("data-board"));
		});
	}
}


async function main() {
	tiles = await loadTiles();
	boards = await loadBoards(tiles);
	positionTilesAll();

	menuButton.addEventListener("click", () => {
		configPane.classList.toggle("menu-expanded");
	});

	boardSelectCheckboxes.forEach(checkbox => {
		if (localStorage.getItem("board-" + checkbox.id) === "true") {
			checkbox.checked = true;
		}
		checkbox.addEventListener("change", handleBoardSelection);
	});

	fillNavbar();
}

main()
