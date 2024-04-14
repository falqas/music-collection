const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/* Initially thought I'd use a Map for O(1) album lookup, but then decided to use an array
   as it more closely mimics the "show all" behavior (first in first out) in the prompt. Also
   I'm not too worried about performance given the expected size of a typical music collection.
   I'd change this if we're looking at 100,000+ sized music libraries
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

function parseUserInput(formattedInput) {
    if (formattedInput.startsWith("add")) {
        const parsedInput = formattedInput
            .slice(3) // Ignore the "add " portion
            .split('"')
            .filter((part) => part.trim() !== "")
            .map((part) => part);
        const [title, artist] = parsedInput;
        addAlbum(artist, title);
    } else if (formattedInput.startsWith("play")) {
        const parsedInput = formattedInput
            .slice(4) // Ignore the "play " portion
            .split('"')
            .filter((part) => part.trim() !== "")
            .map((part) => part);
        const title = parsedInput[0];
        playAlbum(title);
    } else if (formattedInput.startsWith("show")) {
        const parts = formattedInput.split(" ");
        const showType = parts[1];
        const hasOptionalArtist = parts[2] === "by";
        const optionalArtist = hasOptionalArtist
            ? parts
                  .slice(3) //
                  .join(" ")
                  .split('"')
                  .filter((part) => part.trim() !== "")[0]
            : null;

        if (showType === "all") {
            showAll(optionalArtist);
        } else if (showType === "unplayed") {
            showUnplayed(optionalArtist);
        }
    } else {
        console.log("Invalid command");
    }
}

function playDemo() {
    const demoStrings = [
        'add "Ride the Lightning" "Metallica"',
        'add "Licensed to Ill" "Beastie Boys"',
        'add "Pauls Boutique" "Beastie Boys"',
        'add "The Dark Side of the Moon" "Pink Floyd"',
        "show all",
        'play "Licensed to Ill"',
        'play "The Dark Side of the Moon"',
        "show all",
        "show unplayed",
        'show all by "Beastie Boys"',
        'show unplayed by "Beastie Boys"',
    ];

    let index = 0;
    const interval = setInterval(() => {
        const str = demoStrings[index];
        console.log(`\n> ${str}\n`);
        parseUserInput(str);
        index++;
        if (index >= demoStrings.length) {
            clearInterval(interval);
            console.log("Done!");
            console.log("Music collection state:", musicCollection);
            getUserInput(rl);
        }
    }, 1000);
}
function getUserInput(rl) {
    rl.question("> ", (input) => {
        console.log(""); // Empty new line for better readability
        const formattedInput = input.trim();
        if (formattedInput === "quit") {
            console.log("Bye!\n");
            rl.close();
        } else if (formattedInput === "demo") {
            playDemo();
        } else {
            parseUserInput(formattedInput);
            console.log(""); // Empty new line for better readability
            getUserInput(rl);
        }
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
