jest.mock("readline");
const readline = require("readline");
const { getUserInput } = require("./index.js");

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

    beforeEach(() => {});

    it('should call console.log with "Bye!" and close the prompt on user inputting "quit"', () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        getUserInput(rl); // Trigger the function
        expect(mockQuestion).toHaveBeenCalledWith("> ", expect.any(Function));
        expect(console.log).toHaveBeenCalledWith("Bye!");
        expect(mockClose).toHaveBeenCalled();
    });
});

describe("music collection", () => {
    test("init", () => {
        // text input for users, empty library, "welcome to your music collection"
    });

    test('quits on user inputting "quit"', () => {});

    test("adds title and artist to library when added and sets isPlayed to false", () => {});

    test("plays album on user inputting play $album and sets isPlayed to true", () => {
        // "youre listening to $album"
    });
    test('shows all with isPlayed status on user inputting "show all"', () => {});
    test('shows unplayed on user inputting "show unplayed"', () => {});
    test('shows all by artist on user input "show all by $artist"', () => {});
    test('shows all unplayed by artist on user input "show unplayed by $artist"', () => {});
    test("prevents user from adding album with same name to collection", () => {});
    test('maybe: should be case insensitive when checking for duplicates and on user inputting "quit"', () => {});

    test("maybe: should escape quotes/sanitize text", () => {});
    // maybe also: colocate all user input tests in separate describe block?
});
