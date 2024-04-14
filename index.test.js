const {
  handleAddAlbum,
  handlePlayAlbum,
  handleShowAlbums,
  handleShowUnplayed,
  musicCollection,
} = require('./index.js');

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

describe('Music Collection Tests', () => {
  beforeEach(() => {
    musicCollection.length = 0; // clear musicCollection
    console.log = jest.fn();
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
