const testForm = document.getElementById("test");
const testInput = document.getElementById("test-input")
const retrieveButton = document.getElementById("retrieve")
const output = document.getElementById("output")


testForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = testInput.value;

	localStorage.setItem("test", text);
});

retrieveButton.addEventListener("click", () => {
	output.innerText = localStorage.getItem("test");


});