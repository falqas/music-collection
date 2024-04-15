import readline from 'readline';
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
  console.log('Welcome to your music collection!\n');
}

function isDuplicateTitle(title) {
  return musicCollection.some((album) => {
    /* Assuming there can never be two albums with the same title (even if by different artists)
        as per the requirements. I opted to use a case-insensitive comparison, which is a bit stricter.
        Apologies in advance to fans of both Revolver by The Beatles and rEVOLVEr by T-Pain.
    */
    return album.title.toLowerCase() === title.toLowerCase();
  });
}

function handleAddAlbum(artist, title) {
  if (!artist || !title) {
    console.log('Invalid title and/or artist');
    return;
  } else if (isDuplicateTitle(title)) {
    console.log(`Title "${title}" already exists`);
  } else {
    musicCollection.push({
      artist,
      title,
      isPlayed: false,
    });
    console.log(`Added "${title}" by "${artist}"`);
  }
}

function handlePlayAlbum(title) {
  const albumIndex = musicCollection.findIndex(
    (album) => album.title.toLowerCase() === title.toLowerCase()
  );

  if (albumIndex !== -1) {
    musicCollection[albumIndex].isPlayed = true;
    console.log(`🎵 You're listening to "${title}"`);
  } else {
    console.log(`"${title}" not found`);
  }
}

function handleShow(optionalArtist, showType) {
  if (showType === 'all') {
    handleShowAlbums(optionalArtist);
  } else if (showType === 'unplayed') {
    handleShowUnplayed(optionalArtist);
  }
}

function handleShowAlbums(optionalArtist) {
  if (optionalArtist) {
    const albumsByArtist = musicCollection.filter(
      (album) =>
        album.artist.toLowerCase() === optionalArtist.toLowerCase()
    );
    albumsByArtist.forEach((album) => {
      console.log(
        `"${album.title}" by ${album.artist} (${
          album.isPlayed ? 'played' : 'unplayed'
        })`
      );
    });
  } else {
    musicCollection.forEach((album) => {
      console.log(
        `"${album.title}" by ${album.artist} (${
          album.isPlayed ? 'played' : 'unplayed'
        })`
      );
    });
  }
}

function handleShowUnplayed(optionalArtist) {
  if (optionalArtist) {
    const unplayedByArtist = musicCollection.filter(
      (album) =>
        album.artist.toLowerCase() === optionalArtist.toLowerCase() &&
        album.isPlayed === false
    );
    unplayedByArtist.forEach((album) => {
      console.log(`"${album.title}" by ${album.artist}`);
    });
  } else {
    const unplayed = musicCollection.filter(
      (album) => album.isPlayed === false
    );
    unplayed.forEach((album) => {
      console.log(`"${album.title}" by ${album.artist}`);
    });
  }
}

// Probably could have used a regex here, but opted for a simple split and filter
const removeDoubleQuotes = (str) =>
  str.split('"').filter((part) => part.trim() !== '');

function parseAddCommand(formattedInput, handler) {
  const textAfterAddPortion = formattedInput.slice(4); // Ignore the "add " portion
  const parsedInput = removeDoubleQuotes(textAfterAddPortion);
  const [title, artist] = parsedInput;
  handler(artist, title);
}

function parsePlayCommand(formattedInput, handler) {
  const textAfterPlayPortion = formattedInput.slice(5); // Ignore the "play " portion
  const parsedInput = removeDoubleQuotes(textAfterPlayPortion); // Ignore the "play " portion
  const title = parsedInput[0];
  handler(title);
}

function parseShowCommand(formattedInput, handler) {
  const parts = formattedInput.split(' ');
  const showType = parts[1]; // showType can be all or unplayed
  // Check if the user input has an optional artist argument. Position in the array matters,
  // e.g. in "show all by "Naughty by Nature"" is valid", we want the first instance of "by"
  let optionalArtist = null;
  const hasOptionalArtist = parts[2] === 'by';
  if (hasOptionalArtist) {
    const byIndex = formattedInput.indexOf('by');
    const textAfterByPortion = formattedInput.slice(byIndex + 3);
    const parsedInput = removeDoubleQuotes(textAfterByPortion);
    optionalArtist = parsedInput[0];
  }
  handler(optionalArtist, showType);
}

function parseUserInput(formattedInput) {
  // commandType can be add, play, or show
  const commandType = formattedInput.split(' ')[0].toLowerCase();
  switch (commandType) {
    case 'add':
      parseAddCommand(formattedInput, handleAddAlbum);
      break;
    case 'play':
      parsePlayCommand(formattedInput, handlePlayAlbum);
      break;
    case 'show':
      parseShowCommand(formattedInput, handleShow);
      break;
    default:
      console.log('Invalid command');
  }
}

function playDemo() {
  const demoStrings = [
    'add "Ride the Lightning" "Metallica"',
    'add "Licensed to Ill" "Beastie Boys"',
    'add "Pauls Boutique" "Beastie Boys"',
    'add "The Dark Side of the Moon" "Pink Floyd"',
    'show all',
    'play "Licensed to Ill"',
    'play "The Dark Side of the Moon"',
    'show all',
    'show unplayed',
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
      console.log('Done!');
      console.log('Music collection state:', musicCollection);
      getUserInput(rl);
    }
  }, 1000);
}
function getUserInput(rl) {
  rl.question('> ', (input) => {
    console.log(''); // Empty new line for better readability
    const formattedInput = input.trim();
    if (formattedInput.toLowerCase() === 'quit') {
      console.log('Bye!\n');
      rl.close();
    } else if (formattedInput.toLowerCase() === 'demo') {
      playDemo();
    } else {
      parseUserInput(formattedInput);
      console.log(''); // Empty new line for better readability
      getUserInput(rl); // Recursive call to keep prompting the user
    }
  });
}
if (process.env.NODE_ENV !== 'test') {
  getUserInput(rl);
}

export {
  handleAddAlbum,
  handlePlayAlbum,
  handleShow,
  handleShowAlbums,
  handleShowUnplayed,
  parseUserInput,
  parseAddCommand,
  parsePlayCommand,
  parseShowCommand,
  musicCollection,
  removeDoubleQuotes,
};
