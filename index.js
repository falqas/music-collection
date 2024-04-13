const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/* Initially thought I'd use a Map for O(1) album lookup, but then decided to use an array
   as it more closely mimics the "show all" behavior (first in first out) in the prompt
*/
const musicCollection = [];

init();

function init() {
    console.clear();
    console.log("Welcome to your music collection!");
}

function isDuplicateTitle(title) {
    return musicCollection.some((album) => {
        return album.title.toLowerCase() === title.toLowerCase();
    });
}

function addAlbum(artist, title) {
    if (!isDuplicateTitle(title)) {
        musicCollection.push({
            artist,
            title,
            isPlayed: false,
        });
        console.log(`Added "${title}" by "${artist}"`);
    } else {
        console.log(`Title "${title}" already exists`);
    }
}
function playAlbum(title) {
    console.log("musicCollection", musicCollection);
    console.log("title", title);

    const albumIndex = musicCollection.findIndex(
        (album) => album.title.toLowerCase() === title.toLowerCase()
    );

    if (albumIndex !== -1) {
        musicCollection[albumIndex].isPlayed = true;
        console.log(`You're listening to "${title}"`);
    } else {
        console.log(`"${title}" not found`);
    }
}

function showAll(optionalArtist) {
    if (optionalArtist) {
        const albums = musicCollection.filter(
            (album) =>
                album.artist.toLowerCase() === optionalArtist.toLowerCase()
        );
        albums.forEach((album) => {
            console.log(
                `${album.title} by ${album.artist} (${
                    album.isPlayed ? "played" : "unplayed"
                })`
            );
        });
    } else {
        musicCollection.forEach((album) => {
            console.log(
                `${album.title} by ${album.artist} (${
                    album.isPlayed ? "played" : "unplayed"
                })`
            );
        });
    }
}

function showUnplayed(optionalArtist) {
    if (optionalArtist) {
        const albums = musicCollection.filter(
            (album) =>
                album.artist.toLowerCase() === optionalArtist.toLowerCase() &&
                album.isPlayed === false
        );
        albums.forEach((album) => {
            console.log(`${album.title} by ${album.artist}`);
        });
    } else {
        const unplayed = musicCollection.filter(
            (album) => album.isPlayed === false
        );
        unplayed.forEach((album) => {
            console.log(`${album.title} by ${album.artist}`);
        });
    }
}

function getUserInput(rl) {
    rl.question("> ", (input) => {
        // TODO trim input
        if (input === "quit") {
            console.log("Bye!");
            rl.close();
        } else if (input.startsWith("add")) {
            const parsedInput = input
                .slice(3) // Ignore the "add " portion
                .split('"')
                .filter((part) => part.trim() !== "")
                .map((part) => part);
            const [title, artist] = parsedInput;
            addAlbum(artist, title);
        } else if (input.startsWith("play")) {
            const parsedInput = input
                .slice(4) // Ignore the "play " portion
                .split('"')
                .filter((part) => part.trim() !== "")
                .map((part) => part);
            const title = parsedInput[0];
            playAlbum(title);
        } else if (input.startsWith("show")) {
            const parts = input.split(" ");
            const showType = parts[1];
            const artist = parts.slice(2).join(" ").trim().replace(/"/g, "");
            // TODO show all by
            // TODO show unplayed by
            if (showType === "all" && artist) {
                showAll(artist);
            } else if (showType === "unplayed" && artist) {
                showUnplayed(artist);
            } else if (showType === "all") {
                showAll();
            } else if (showType === "unplayed") {
                showUnplayed();
            }
        }
        getUserInput(rl);
    });
}
if (process.env.NODE_ENV !== "test") {
    getUserInput(rl);
}

module.exports = {
    getUserInput,
    addAlbum,
    playAlbum,
    musicCollection,
    showAll,
    showUnplayed,
};
