let tileGrid = document.querySelectorAll(".tile");
let boardDom = document.querySelector("#board");
let boardDomBackup = null;

const navBoards = document.querySelector("#nav-boards");
const menuButton = document.querySelector("#nav-menu-button");

const configPane = document.querySelector("#config");
const boardSelectCheckboxes = document.querySelectorAll("#board-select input");

const debug = document.querySelector("#debug");

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

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
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

function fillBoard(boardId) {
	board = boards[boardId];
	shuffle(board.tiles);

	boardDomBackup = boardDom.cloneNode(true);
	boardDom.parentNode.replaceChild(boardDomBackup, boardDom)

	tileGrid = document.querySelectorAll(".tile");
	boardDom = document.querySelector("#board");

	for (var i = 0; i < board.tiles.length; i++) {
		const tileObj = board.tiles[i];
		const tileDom = tileGrid[i];

		tileDom.innerHTML = null;

		tileDom.innerHTML = `
			<img class="tab-img" src="${tileObj.face}">
			<video loop muted>
				<source src="${tileObj.clips[0]}" type="video/mp4">
			</video>
		`;

		// <source src="/assets/test.mp4" type="video/mp4">

		const myCallback = () => {
			const video = tileDom.querySelector("video");
			if(tileDom.classList.contains("flipped")) {
				console.log("unflip!");
				tileDom.classList.toggle("flipped");
				/*
				video.pause();
				boardDom.style.pointerEvents = "none";
				tileDom.style.pointerEvents = null;



				window.setTimeout(function() {
					tileDom.style = null;
					positionTilesAll()
					boardDom.style.pointerEvents = null;
				}, 1000);
				*/
			} else {
				console.log("flip!");
				debug.innerHTML = "";
				/*
				positionTileAbsolute(tileDom);

				const videoSource = video.querySelector("source");
				videoSource.src = tileObj.clips[Math.floor(Math.random()*tileObj.clips.length)];
				video.load()

				boardDom.style.pointerEvents = "none";

				tileDom.style.zIndex = 5;
				*/

				window.setTimeout(function() {
					tileDom.classList.toggle("flipped");
				}, 10);
				window.setTimeout(function() {
					video.play();
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
			for (const button of navButtons) {
				button.classList.remove("selected");
			}
			fillBoard(button.getAttribute("data-board"));
			button.classList.add("selected");
			boardDom.style.display = null;
			configPane.classList.remove("menu-expanded");
			menuButton.classList.remove("menu-button-spin");
			menuButton.classList.remove("selected");
		});
	}
}

function greet() {
	boardDom.style.display = "none";

	const greetingElement = document.getElementById('greeting');
	const now = new Date();
	const hours = now.getHours();

	if (hours < 12) {
		greetingElement.innerText = 'Good morning!';
	} else if (hours < 18) {
		greetingElement.innerText = 'Good afternoon!';
	} else {
		greetingElement.innerText = 'Good evening!';
	}
}

async function main() {
	tiles = await loadTiles();
	boards = await loadBoards(tiles);
	positionTilesAll();

	menuButton.addEventListener("click", () => {
		configPane.classList.toggle("menu-expanded");
		menuButton.classList.toggle("menu-button-spin");
		menuButton.classList.toggle("selected");
	});

	boardSelectCheckboxes.forEach(checkbox => {
		if (localStorage.getItem("board-" + checkbox.id) === "true") {
			checkbox.checked = true;
		}
		checkbox.addEventListener("change", handleBoardSelection);
	});

	fillNavbar();
	greet();
}

main()
