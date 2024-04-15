import { expect, describe, it, vi, beforeEach } from 'vitest';

// Isolate the tests for the music collection using dynamic imports to avoid overwriting the mocks in the other tests.
// It's a little messier to keep track of the imports, but I wanted to keep things in one file.
describe('Music Collection - Functionality', async () => {
  const testCollection = [
    { artist: 'The Beatles', title: 'Abbey Road', isPlayed: true },
    { artist: 'The Beatles', title: 'Rubber Soul', isPlayed: false },
    { artist: 'Fleetwood Mac', title: 'Rumours', isPlayed: false },
    {
      artist: 'Lauryn Hill',
      title: 'The Miseducation of Lauryn Hill',
      isPlayed: false,
    },
  ];

  let handleAddAlbum,
    handlePlayAlbum,
    musicCollection,
    handleShowAlbums,
    handleShowUnplayed;

  beforeEach(async () => {
    console.log = vi.fn();
    const module = await import('./index');
    handleAddAlbum = module.handleAddAlbum;
    handlePlayAlbum = module.handlePlayAlbum;
    musicCollection = module.musicCollection;
    handleShowAlbums = module.handleShowAlbums;
    handleShowUnplayed = module.handleShowUnplayed;
    musicCollection.length = 0; // clear musicCollection
    vi.resetAllMocks();
  });

  it('should be empty at start', () => {
    expect(musicCollection).toEqual([]);
  });

  it('adds title and artist to library when added and sets isPlayed to false', () => {
    handleAddAlbum('The Beatles', 'Abbey Road');
    expect(musicCollection).toEqual([
      {
        artist: 'The Beatles',
        title: 'Abbey Road',
        isPlayed: false,
      },
    ]);
  });

  it('should prevent user from adding album with same name to collection (even if different artist)', () => {
    handleAddAlbum('The Beatles', 'Abbey Road');
    handleAddAlbum('Fleetwood Mac', 'Abbey road');
    expect(musicCollection).toEqual([
      {
        artist: 'The Beatles',
        title: 'Abbey Road',
        isPlayed: false,
      },
    ]);
  });

  it('should show an error on user adding invalid album to collection', () => {
    handleAddAlbum(undefined, 'Abbey Road');
    expect(console.log).toHaveBeenCalledWith(
      'Invalid title and/or artist'
    );
  });

  it('should set "isPlayed" to true on playing album', () => {
    handleAddAlbum('The Beatles', 'Abbey Road');
    handlePlayAlbum('Abbey Road');
    expect(musicCollection).toEqual([
      {
        artist: 'The Beatles',
        title: 'Abbey Road',
        isPlayed: true,
      },
    ]);
  });

  it('should show an error on user playing non-existent album', () => {
    handlePlayAlbum('Abbey Road');
    expect(console.log).toHaveBeenCalledWith(
      '"Abbey Road" not found'
    );
  });

  it('should show all with "isPlayed" status on "show all"', () => {
    musicCollection.push(...testCollection);
    handleShowAlbums();
    expect(console.log).toHaveBeenCalledWith(
      '"Abbey Road" by The Beatles (played)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '"Rumours" by Fleetwood Mac (unplayed)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '"The Miseducation of Lauryn Hill" by Lauryn Hill (unplayed)'
    );
  });

  it('should show unplayed on "show unplayed"', () => {
    musicCollection.push(...testCollection);
    handleShowUnplayed();
    expect(console.log).toHaveBeenCalledWith(
      '"Rumours" by Fleetwood Mac'
    );
    expect(console.log).toHaveBeenCalledWith(
      '"The Miseducation of Lauryn Hill" by Lauryn Hill'
    );
  });

  it('should show all by artist "show all by $artist"', () => {
    musicCollection.push(...testCollection);
    handleShowAlbums('The Beatles');
    expect(console.log).toHaveBeenCalledWith(
      '"Abbey Road" by The Beatles (played)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '"Rubber Soul" by The Beatles (unplayed)'
    );
  });

  it('should show unplayed by artist on "show unplayed by $artist"', () => {
    musicCollection.push(...testCollection);
    handleShowUnplayed('The Beatles');
    expect(console.log).toHaveBeenCalledWith(
      '"Rubber Soul" by The Beatles'
    );
  });
});

describe('Music Collection - Parsing', async () => {
  let handleAddAlbum,
    handlePlayAlbum,
    parseAddCommand,
    parsePlayCommand,
    parseShowCommand,
    parseUserInput,
    handleShow;

  beforeEach(async () => {
    // using .doMock rather than .mock because the latter is hoisted, and causes side effects
    // (overwrites imported module with mocks and affects other tests)
    vi.doMock('./index', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        handleAddAlbum: vi.fn(),
        handlePlayAlbum: vi.fn(),
        handleShow: vi.fn(),
      };
    });
    const module = await import('./index');
    handleAddAlbum = module.handleAddAlbum;
    handlePlayAlbum = module.handlePlayAlbum;
    handleShow = module.handleShow;
    parseAddCommand = module.parseAddCommand;
    parsePlayCommand = module.parsePlayCommand;
    parseShowCommand = module.parseShowCommand;
    parseUserInput = module.parseUserInput;
    vi.resetAllMocks();
  });

  it('should parse the input and call handleAddAlbum with the correct parameters', async () => {
    const command = 'add "Blue" "Joni Mitchell"';
    parseAddCommand(command, handleAddAlbum);

    expect(handleAddAlbum).toHaveBeenCalledWith(
      'Joni Mitchell',
      'Blue'
    );
  });

  it('should parse and execute play command correctly', () => {
    parsePlayCommand('play "Blue"', handlePlayAlbum);
    expect(handlePlayAlbum).toHaveBeenCalledWith('Blue');
  });

  it('should parse and execute show command with all albums', () => {
    parseShowCommand('show all', handleShow);
    const optionalArtist = null;
    expect(handleShow).toHaveBeenCalledWith(optionalArtist, 'all');
  });

  it('should parse and execute show command with unplayed albums', () => {
    parseShowCommand('show unplayed', handleShow);
    const optionalArtist = null;
    expect(handleShow).toHaveBeenCalledWith(
      optionalArtist,
      'unplayed'
    );
  });

  it('should parse and execute show command with specific artist', () => {
    parseShowCommand('show all by "Joni Mitchell"', handleShow);
    const SHOW_ALL = 'all';
    expect(handleShow).toHaveBeenCalledWith(
      'Joni Mitchell',
      SHOW_ALL
    );
  });

  it('should handle incorrect command type in parseUserInput', () => {
    parseUserInput('foo bar');
    expect(console.log).toHaveBeenCalledWith('Invalid command');
  });
});
