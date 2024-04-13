jest.mock("readline");
const readline = require("readline");
const {
    getUserInput,
    addAlbum,
    musicCollection,
    playAlbum,
    showAll,
    showUnplayed,
} = require("./index.js");

describe("getUserInput", () => {
    const mockQuestion = jest.fn();
    const mockClose = jest.fn();
    console.log = jest.fn();
    readline.createInterface.mockReturnValue({
        question: mockQuestion.mockImplementation((prompt, callback) =>
            callback("quit")
        ),
        close: mockClose,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should close the prompt on user inputting quit and log "Bye!"', () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        getUserInput(rl); // Trigger the function
        expect(mockQuestion).toHaveBeenCalledWith("> ", expect.any(Function));
        expect(console.log).toHaveBeenCalledWith("Bye!");
        expect(mockClose).toHaveBeenCalled();
    });
    //   TODO it should play ie getUserInput('play Abbey Road');
});

describe("music collection", () => {
    beforeEach(() => {
        musicCollection.length = 0;
    });
    it("should be empty at start", () => {
        expect(musicCollection).toEqual([]);
    });
    it("adds title and artist to library when added and sets isPlayed to false", () => {
        addAlbum("The Beatles", "Abbey Road");
        expect(musicCollection).toEqual([
            {
                artist: "The Beatles",
                title: "Abbey Road",
                isPlayed: false,
            },
        ]);
    });

    it("should prevent user from adding album with same name to collection (even if different artist)", () => {
        addAlbum("The Beatles", "Abbey Road");
        addAlbum("Fleetwood Mac", "Abbey road");
        expect(musicCollection).toEqual([
            {
                artist: "The Beatles",
                title: "Abbey Road",
                isPlayed: false,
            },
        ]);
    });
    it('should play album on user inputting "play $album" and set "isPlayed" to true', () => {
        addAlbum("The Beatles", "Abbey Road");
        playAlbum("Abbey Road");
        expect(musicCollection).toEqual([
            {
                artist: "The Beatles",
                title: "Abbey Road",
                isPlayed: true,
            },
        ]);
    });
    it('should show all with "isPlayed" status on user inputting "show all"', () => {
        addAlbum("The Beatles", "Abbey Road");
        addAlbum("Fleetwood Mac", "Rumours");
        addAlbum("Lauryn Hill", "The Miseducation of Lauryn Hill");
        playAlbum("Abbey Road");
        showAll();
        expect(console.log).toHaveBeenCalledWith("The Beatles - Abbey Road");
        expect(console.log).toHaveBeenCalledWith("Fleetwood Mac - Rumours");
        expect(console.log).toHaveBeenCalledWith(
            "Lauryn Hill - The Miseducation of Lauryn Hill"
        );
    });

    it('should show unplayed on user inputting "show unplayed"', () => {
        addAlbum("The Beatles", "Abbey Road");
        addAlbum("Fleetwood Mac", "Rumours");
        addAlbum("Lauryn Hill", "The Miseducation of Lauryn Hill");
        playAlbum("Abbey Road");
        showUnplayed();
        expect(console.log).toHaveBeenCalledWith("Fleetwood Mac - Rumours");
        expect(console.log).toHaveBeenCalledWith(
            "Lauren Hill - The Miseducation of Lauryn Hill"
        );
    });

    it('should show all by artist on user input "show all by $artist"', () => {
        addAlbum("The Beatles", "Abbey Road");
        addAlbum("The Beatles", "Rubber Soul");
        addAlbum("Fleetwood Mac", "Rumours");
        showAll("The Beatles");
        expect(console.log).toHaveBeenCalledWith("The Beatles - Abbey Road");
        expect(console.log).toHaveBeenCalledWith("The Beatles - Rubber Soul");
    });

    it('should show all unplayed by artist on user input "show unplayed by $artist"', () => {
        addAlbum("The Beatles", "Abbey Road");
        addAlbum("The Beatles", "Rubber Soul");
        addAlbum("Fleetwood Mac", "Rumours");
        playAlbum("Abbey Road");
        showUnplayed("The Beatles");
        expect(console.log).toHaveBeenCalledWith("The Beatles - Rubber Soul");
    });
    // TODO maybe it('should maybe: should be case insensitive when checking for duplicates and on user inputting "quit"', () => {});

    // TODO maybe it('maybe: should escape quotes/sanitize text', () => {});
    // TODO maybe also: colocate all user input tests in separate describe block?
    // it('maybe: init', () => {
    // TODO maybe    // text input for users, empty library, 'welcome to your music collection'
    // });

    // getUserInput('show all');
    // 'youre listening to $album'
});
