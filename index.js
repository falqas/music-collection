const readline = require("readline");

// Initially thought I'd use a Map, but then decided to use an array as it more closely mimics the "show all" behavior (first in first out) specified in the prompt
const musicCollection = [];

function init() {
    console.clear();
    console.log("Welcome to your music collection!");
}

function addAlbum(title, artist) {}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function getUserInput(rl) {
    rl.question("> ", (input) => {
        if (input === "quit") {
            console.log("Bye!");
            rl.close();
        } else {
            getUserInput();
        }
    });
}
if (process.env.NODE_ENV !== "test") {
    getUserInput(rl);
}

module.exports = {
    getUserInput,
};
