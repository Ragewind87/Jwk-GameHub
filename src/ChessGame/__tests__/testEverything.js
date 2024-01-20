import React from 'react';
import { shallow, mount } from 'enzyme';       // enzyme assertion methods
import { expect } from 'chai';                          // chai assertion methods
import App from '../Components/App';
import Board from '../Components/App';
import {Pieces} from '../Components/Board';
import {Players} from '../Components/Board';

/************************  FOR INTELLIJ USERS  **************************************
 *                                                                                  *
 *   To run these tests, make a 2nd NPM configuration  (NOT JEST)                   *
 *   Set the command to TEST instead of START  (you'll have to scroll down)         *
 *                                                                                  *
 *   TO MAKE INTELLIJ RECOGNIZE THE SYNTAX:                                         *
 *                                                                                  *
 *   File -->  Settings  -->  Languages and Frameworks -->                          *
 *   Javascript  -->  Libraries -->  Download  --> download jest, chai, and enzyme  *
 *                                                                                  *
 ************************************************************************************/

/************  BEFORE ANY OF THIS WORKS YOU WILL NEED TO:  **********************
 *                                                                               *
 *   npm install --save-dev jest                                                 *
 *   npm install --save-dev enzyme enzyme-adapter-react-16 react-test-renderer   *
 *   npm install chai                                                            *
 *                                                                               *
 *   npm test                // to run the actual tests                          *
 *                                                                               *
 *********************************************************************************/

//  TESTING GUIDE:
//  https://medium.com/@rossbulat/testing-in-react-with-jest-and-enzyme-an-introduction-99ce047dfcf8

//  ENZYME DOCUMENTATION:
//  https://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html

//  ENZYME SELECTORS TO USE WITH find()
//  https://airbnb.io/enzyme/docs/api/selector.html

//  CHAI DOCUMENTATION:
//  https://www.chaijs.com/api/bdd/#method_lengthof



// APP-LEVEL TESTS
describe('APP STRUCTURE', () => {

    let app = null;         // wrapper for the App Component

    test('renders without crashing', () => {

        // this test WILL fail if <App /> doesn't render
        app = shallow(
            <App
                test = {true}
            />
            );
    });

    test('loads the Board component', () => {
        expect(app.find('Board')).to.have.lengthOf(1);
    });

    // END TURN BUTTON WAS REMOVED
    // test('loads the End-Turn Button component', () => {
    //     expect(app.find('EndTurnBtn')).to.have.lengthOf(1);
    // });

    test('loads two PlayerBoxes component', () => {
        expect(app.find('PlayerBox')).to.have.lengthOf(2);
    });
});


// BOARD TESTS
describe('BOARD STRUCTURE', () => {

    let app = mount(<App test = {true} />);       // wrapper for the App Component
    let board = null;               // wrapper for the Board Component
    let boardDiv = null;            // wrapper for the actual board div inside Board Component

    test('found the board component', () => {
        board = app.find('Board');
        expect(board).to.have.lengthOf(1);
    });

    test('actual board div exists inside Board component', () => {
        boardDiv = board.find('div.board');
        expect(boardDiv).to.have.lengthOf(1);
    });

    test('exactly 8 row divs rendered', () => {
        let boardRows = boardDiv.find('div.boardRow');
        expect(boardRows).to.have.lengthOf(8);
    });

    // searches through the boardRow div and determines if there are 8
    // divs inside it, each with their own UNIQUE id
    test('each of the 8 divs is unique', () => {
        let currentRow = null;                                  // wrapper for current row is Squares being tested
        let rowsFound = 0;
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);
            expect(currentRow.type()).to.equal('div');
            expect(currentRow.key()).to.equal('bRow' + y);        // ensures the div has the expected unique id
            rowsFound++;
        }
        expect(rowsFound).to.equal(8);
    });

    // makes sure that each row contains 8 Squares
    // uniqueness is not tested yet
    test('each div contains 8 Squares', () =>{
        let currentRow = null;
        let squaresInRow = null;                            // counts Squares in each row
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);               // row divs are the children of the main boardDiv
            squaresInRow = currentRow.find('Square');
            expect(squaresInRow.length).to.equal(8);
            currentRow = null;
        }
    });

    // traverses the entire board and makes sure all 64 Squares
    // are found and they all have unique coordinates and ids.
    test('all 64 Squares are unique and have the correct coordinates', () => {
        let currentRow = null;
        let currentSquare = null;                                   // wrapper for current Square being tested
        let uniqueSquares = 0;                                      // counts each Square as it's found
        for ( let y = 0; y < 8; y++ ) {
            currentRow = boardDiv.childAt(y);                       // iterates over each Square in each row
            for ( let x = 0; x < 8; x++ ){
                currentSquare = currentRow.childAt(x);              // Squares are children of the boardRow div
                expect(currentSquare.name()).to.equal('Square');
                expect(currentSquare.key()).to.equal('Sq'+y+'.'+x);
                expect(currentSquare.prop('x')).to.equal(x);
                expect(currentSquare.prop('y')).to.equal(y);
                uniqueSquares++;
            }
        }
        expect(uniqueSquares).to.equal(64);
    });
});


// BOARD SETUP TESTS
describe('GAME SETUP', () => {
    let app = mount(<App test = {true} />);                       // wrapper for the App Component
    let board = app.find('Board');                  // wrapper for the Board Component
    let boardDiv = board.find('div.board');         // wrapper for the actual board div inside Board Component

    // White piece tests
    describe('White Player', () => {

        // Pieces
        test('pieces are set up correctly', () => {
            expect( board.prop('bState')[7][0].pcType ).to.equal( Pieces.ROOK );
            expect( board.prop('bState')[7][1].pcType ).to.equal( Pieces.KNIGHT );
            expect( board.prop('bState')[7][2].pcType ).to.equal( Pieces.BISHOP );
            expect( board.prop('bState')[7][3].pcType ).to.equal( Pieces.QUEEN );
            expect( board.prop('bState')[7][4].pcType ).to.equal( Pieces.KING );
            expect( board.prop('bState')[7][5].pcType ).to.equal( Pieces.BISHOP );
            expect( board.prop('bState')[7][6].pcType ).to.equal( Pieces.KNIGHT );
            expect( board.prop('bState')[7][7].pcType ).to.equal( Pieces.ROOK );
            for ( let x = 0; x < 8; x++ ){
                expect( board.prop('bState')[7][x].pcOwner ).to.equal( Players.WHITE );
            }
        });

        // Pawns
        test('pawns are set up correctly', () => {
            for ( let x = 0; x < 8; x++ ){
                expect( board.prop('bState')[6][x].pcType ).to.equal( Pieces.PAWN );
                expect( board.prop('bState')[6][x].pcOwner ).to.equal( Players.WHITE );
            }
        });

        // Pieces are rendering the correct images
        test('pieces render the correct images', () => {
            let currentRow = null;
            let currentButton = null;                   // wrapper for button inside the Square

            // MAJOR PIECES
            currentRow = boardDiv.childAt(7);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                switch (x){
                    case 0: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteRook.png)');     break;
                    case 1: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteKnight.png)');   break;
                    case 2: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteBishop.png)');   break;
                    case 3: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteQueen.png)');     break;
                    case 4: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteKing.png)');    break;
                    case 5: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteBishop.png)');   break;
                    case 6: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteKnight.png)');   break;
                    case 7: expect(currentButton.prop('style').backgroundImage).to.equal('url(whiteRook.png)');     break;
                }
            }

            // PAWNS
            currentRow = boardDiv.childAt(6);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                expect(currentButton.prop('style').backgroundImage).to.equal('url(whitePawn.png)');
            }
        });
    });

    // Black piece tests
    describe('Black Player', () => {

        // Pieces
        test('pieces are set up correctly', () => {
            expect( board.prop('bState')[0][0].pcType ).to.equal( Pieces.ROOK );
            expect( board.prop('bState')[0][1].pcType ).to.equal( Pieces.KNIGHT );
            expect( board.prop('bState')[0][2].pcType ).to.equal( Pieces.BISHOP );
            expect( board.prop('bState')[0][3].pcType ).to.equal( Pieces.QUEEN );
            expect( board.prop('bState')[0][4].pcType ).to.equal( Pieces.KING );
            expect( board.prop('bState')[0][5].pcType ).to.equal( Pieces.BISHOP );
            expect( board.prop('bState')[0][6].pcType ).to.equal( Pieces.KNIGHT );
            expect( board.prop('bState')[0][7].pcType ).to.equal( Pieces.ROOK );
            for ( let x = 0; x < 8; x++ ){
                expect( board.prop('bState')[0][x].pcOwner ).to.equal( Players.BLACK );
            }
        });

        // Pawns
        test('pawns are set up correctly', () => {
            for ( let x = 0; x < 8; x++ ){
                expect( board.prop('bState')[1][x].pcType ).to.equal( Pieces.PAWN );
                expect( board.prop('bState')[1][x].pcOwner ).to.equal( Players.BLACK );
            }
        });

        // Pieces are rendering the correct images
        test('pieces render the correct images', () => {
            let currentRow = null;
            let currentButton = null;

            // MAJOR PIECES
            currentRow = boardDiv.childAt(0);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                switch (x){
                    case 0: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackRook.png)');     break;
                    case 1: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackKnight.png)');   break;
                    case 2: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackBishop.png)');   break;
                    case 3: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackQueen.png)');     break;
                    case 4: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackKing.png)');    break;
                    case 5: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackBishop.png)');   break;
                    case 6: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackKnight.png)');   break;
                    case 7: expect(currentButton.prop('style').backgroundImage).to.equal('url(blackRook.png)');     break;
                }
            }

            // PAWNS
            currentRow = boardDiv.childAt(1);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                expect(currentButton.prop('style').backgroundImage).to.equal('url(blackPawn.png)');
            }
        });
    });

    // Empty square tests
    test('center 4 rows are empty and not rendering an image', () => {
        let currentRow = null;
        let currentButton = null;

        for ( let y = 2; y > 6; y++ ){
            currentRow = boardDiv.childAt(y);
            for ( let x = 0; x < 8; x++ ){
                currentButton = currentRow.childAt(x).childAt(0);
                expect( board.prop('bState')[y][x].pcType ).to.equal( Pieces.EMPTY );
                expect( board.prop('bState')[1][x].pcOwner ).to.equal( Players.NONE );
                expect(currentButton.prop('style').backgroundImage).to.equal('url(null)');
            }
        }
    });
});

// basic game-state test
describe('BASIC GAME-STATE TESTS', () => {

    let app = null;             // wrapper for the App Component
    let board = null;           // wrapper for the Board Component
    let boardDiv = null;        // wrapper for the actual board div inside Board Component
    let button = null;          // wrapper for button to click

    app = mount(<App test = {true} />);
    board = app.find('Board');
    boardDiv = board.find('div.board');

    describe('Basic Clicking', () => {
        test('clicking a white pawn selects it', () => {
            clickSquareAt(6,0);
            expect( board.prop('bState')[6][0].isSelected ).to.equal( true );
            expect( board.prop('bState')[5][0].isHighlighted ).to.equal( true );
            expect( board.prop('bState')[4][0].isHighlighted ).to.equal( true );
        });

        test('clicking it again de-selects it', () => {
            clickSquareAt(6,0);
            expect( board.prop('bState')[6][0].isSelected ).to.equal( false );
            expect( board.prop('bState')[5][0].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[4][0].isHighlighted ).to.equal( false );
        });

        test('clicking enemy pieces does nothing', () => {
            for ( let y = 0; y < 2; y++ ){
                for ( let x = 0; x < 8; x++ ){
                    clickSquareAt(y,x);
                    expect( board.prop('bState')[y][x].isSelected ).to.equal( false );
                }
            }
        });

        test('clicking empty squares does nothing', () => {
            for ( let y = 2; y < 6; y++ ){
                for ( let x = 0; x < 8; x++ ){
                    clickSquareAt(y,x);
                    expect( board.prop('bState')[y][x].isSelected ).to.equal( false );
                }
            }
        });
    });

    // pawns move forward, one captures the other.
    describe('Basic piece capturing', () => {
        test('White click pawn', () => {
            clickSquareAt(6,4);
            expect( board.prop('bState')[6][4].isSelected ).to.equal( true );
            expect( board.prop('bState')[5][4].isHighlighted ).to.equal( true );
            expect( board.prop('bState')[4][4].isHighlighted ).to.equal( true );
        });
        test('White move pawn', () => {
            clickSquareAt(4,4);
            expect( board.prop('bState')[6][4].isSelected ).to.equal( false );
            expect( board.prop('bState')[5][4].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[4][4].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[6][4].pcOwner ).to.equal( Players.NONE );
            expect( board.prop('bState')[6][4].pcType ).to.equal( Pieces.EMPTY );
            expect( board.prop('bState')[4][4].pcOwner ).to.equal( Players.WHITE );
            expect( board.prop('bState')[4][4].pcType ).to.equal( Pieces.PAWN );
        });

        test('Black click pawn', () => {
            clickSquareAt(1,3);
            expect( board.prop('bState')[1][3].isSelected ).to.equal( true );
            expect( board.prop('bState')[2][3].isHighlighted ).to.equal( true );
            expect( board.prop('bState')[3][3].isHighlighted ).to.equal( true );
        });
        test('Black move pawn', () => {
            clickSquareAt(3,3);
            expect( board.prop('bState')[1][3].isSelected ).to.equal( false );
            expect( board.prop('bState')[2][3].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[3][3].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[1][3].pcOwner ).to.equal( Players.NONE );
            expect( board.prop('bState')[1][3].pcType ).to.equal( Pieces.EMPTY );
            expect( board.prop('bState')[3][3].pcOwner ).to.equal( Players.BLACK );
            expect( board.prop('bState')[3][3].pcType ).to.equal( Pieces.PAWN );
        });
        test('White pawn attack', () => {
            clickSquareAt(4,4);
            expect( board.prop('bState')[4][4].isSelected ).to.equal( true );
            expect( board.prop('bState')[3][4].isHighlighted ).to.equal( true );
            expect( board.prop('bState')[3][3].isHighlighted ).to.equal( true );

            // piece capture
            clickSquareAt(3,3);
            expect( board.prop('bState')[4][4].isSelected ).to.equal( false );
            expect( board.prop('bState')[3][4].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[3][3].isHighlighted ).to.equal( false );
            expect( board.prop('bState')[3][3].pcOwner ).to.equal( Players.WHITE );
            expect( board.prop('bState')[3][3].pcType ).to.equal( Pieces.PAWN );
        });
    });

    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});


/*************************************  INSTRUCTIONS  *********************************************
 *                                                                                                 *
 *     Copy the clickSquareAt( y, x ) method to simulate clicking the given square                 *
 *     then test the properties of the board squares against what we would expect them to be       *
 *     after clicking a given series of squares. You can simulate an entire game this way,         *
 *     testing all kinds of things along the way. The most tests we have the better.               *
 *                                                                                                 *
 *                                                                                                 *
 *     use        app = mount(<App />);                                                            *
 *                board = app.find('Board')                                                        *
 *                boardDiv = board.find('div.board');     if you want to re-render a new game      *
 *                                                                                                 *
 **************************************************************************************************/


// FIRST GAME SIMULATION
describe('GAME SIMULATION 1', () => {

    let app = mount(<App test = {true} />);
    let board = app.find('Board');
    let boardDiv = board.find('div.board');
    let button = null;

    test('Game ran as expected', () => {
        clickSquareAt(6,3);
        expect( board.prop('bState')[6][3].isSelected ).to.equal( true );
        expect( board.prop('bState')[5][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][3].isHighlighted ).to.equal( true );
        clickSquareAt(4,3);
        expect( board.prop('bState')[5][3].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][3].isHighlighted ).to.equal( false );
        clickSquareAt(1,4);
        clickSquareAt(3,4);
        clickSquareAt(4,3);
        clickSquareAt(3,4);
        expect(board.prop('bState')[7][8].blackPieces.length).to.equal( 15 );
        clickSquareAt(0,3);
        clickSquareAt(1,4);
        clickSquareAt(7,4);
        clickSquareAt(6,3);
        clickSquareAt(1,4);
        clickSquareAt(2,3);
        expect(board.prop('bState')[7][8].whiteCheck).to.equal( true );
        clickSquareAt(6,3);
        clickSquareAt(5,2);
        clickSquareAt(2,3);
        clickSquareAt(2,2);
        expect(board.prop('bState')[7][8].whiteCheck).to.equal( true );
        clickSquareAt(5,2);
        clickSquareAt(5,1);
        clickSquareAt(2,2);
        clickSquareAt(3,2);
        clickSquareAt(3,4);
        clickSquareAt(2,4);
        clickSquareAt(3,2);
        clickSquareAt(4,1);
        expect(board.prop('bState')[7][8].whiteCheckMate).to.equal(true);
    });

    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});


// SECOND GAME SIMULATION
describe('GAME SIMULATION 2', () => {

    let app = mount(<App test = {true} />);
    let board = app.find('Board');
    let boardDiv = board.find('div.board');
    let button = null;

    test('Game ran as expected', () => {
        clickSquareAt(6,4);
        clickSquareAt(4,4);
        clickSquareAt(1,4);
        clickSquareAt(3,4);
        clickSquareAt(7,3);
        clickSquareAt(3,7);
        clickSquareAt(1,5);

        // should not highlight due to check-avoidance
        expect( board.prop('bState')[1][5].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[3][5].isHighlighted ).to.equal( false );

        clickSquareAt(1,6);
        expect( board.prop('bState')[1][6].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[3][6].isHighlighted ).to.equal( true );
        clickSquareAt(3,6);
        clickSquareAt(7,1);
        clickSquareAt(5,2);
        clickSquareAt(0,3);
        expect( board.prop('bState')[0][3].isSelected ).to.equal( true );
        expect( board.prop('bState')[1][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[1][3].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][2].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][2].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][4].isHighlighted ).to.equal( false );
        clickSquareAt(2,5);
        clickSquareAt(6,1);
        clickSquareAt(4,1);
        clickSquareAt(2,5);
        clickSquareAt(6,5);
        expect(board.prop('bState')[7][8].whiteCheck).to.equal( true );
        clickSquareAt(7,4);
        expect( board.prop('bState')[7][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[7][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[6][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[6][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[7][3].hasMoved ).to.equal( false );
        clickSquareAt(7,3);
        expect( board.prop('bState')[7][3].hasMoved ).to.equal( true );

        // clicks queen, highlights a bunch of crap
        clickSquareAt(6,5);
        expect( board.prop('bState')[6][5].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][1].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[3][2].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[3][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[6][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[6][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[6][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][6].isHighlighted ).to.equal( true );
        clickSquareAt(2,5);
        clickSquareAt(7,2);
        clickSquareAt(5,0);
        clickSquareAt(1,7);
        clickSquareAt(2,7);
        clickSquareAt(7,3);
        clickSquareAt(7,4);
        clickSquareAt(0,1);
        clickSquareAt(2,2);
        clickSquareAt(2,2);
        clickSquareAt(3,7);
        clickSquareAt(2,7);
        clickSquareAt(1,1);
        clickSquareAt(2,1);
        clickSquareAt(7,4);
        expect( board.prop('bState')[7][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[6][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][2].isHighlighted ).to.equal( false );
        clickSquareAt(7,3);
        clickSquareAt(0,2);
        clickSquareAt(2,0);
        clickSquareAt(4,1);
        clickSquareAt(3,1);

        // tests left-castling for black
        clickSquareAt(0,4);
        expect( board.prop('bState')[0][4].hasMoved ).to.equal( false );
        expect( board.prop('bState')[0][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[0][2].isHighlighted ).to.equal( true );
        clickSquareAt(0,2);
        expect( board.prop('bState')[0][2].pcType ).to.equal( Pieces.KING );
        expect( board.prop('bState')[0][3].pcType ).to.equal( Pieces.ROOK );
        expect( board.prop('bState')[0][2].hasMoved ).to.equal( true );
        expect( board.prop('bState')[0][3].hasMoved ).to.equal( true );

        clickSquareAt(2,7);
        clickSquareAt(0,5);
        clickSquareAt(0,3);
        expect( board.prop('bState')[0][4].isHighlighted ).to.equal( true );
        clickSquareAt(0,4);
        clickSquareAt(5,0);
        clickSquareAt(1,4);
        clickSquareAt(2,0);
        expect( board.prop('bState')[1][1].isHighlighted ).to.equal( true );
        clickSquareAt(1,1);
        clickSquareAt(0,5);
        expect( board.prop('bState')[0][4].isHighlighted ).to.equal( true );
        clickSquareAt(0,4);
        expect(board.prop('bState')[7][8].blackCheck).to.equal( true );

        // tests check-removal
        clickSquareAt(2,2);
        expect( board.prop('bState')[0][3].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[1][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][3].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][1].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[3][0].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][1].isHighlighted ).to.equal( false );
        clickSquareAt(0,3);
        clickSquareAt(0,4);
        clickSquareAt(0,3);
        expect(board.prop('bState')[7][8].blackCheckMate).to.equal(true);
    });

    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});


// THIRD GAME SIMULATION
describe('GAME SIMULATION 3', () => {

    let app = mount(<App test = {true} />);
    let board = app.find('Board');
    let boardDiv = board.find('div.board');
    let button = null;

    test('Game ran as expected', () => {
        clickSquareAt(6,7);
        clickSquareAt(4,7);
        clickSquareAt(0,1);
        clickSquareAt(2,0);
        clickSquareAt(4,7);
        expect( board.prop('bState')[3][7].isHighlighted ).to.equal( true );
        clickSquareAt(3,7);

        // tests en-passant
        clickSquareAt(1,6);
        expect( board.prop('bState')[1][6].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[3][6].isHighlighted ).to.equal( true );
        clickSquareAt(3,6);
        clickSquareAt(3,7);
        expect( board.prop('bState')[3][6].isCapturable ).to.equal( true );
        expect( board.prop('bState')[3][7].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][7].isHighlighted ).to.equal( true );
        clickSquareAt(2,6);
        expect( board.prop('bState')[3][6].isCapturable ).to.equal( false );
        expect( board.prop('bState')[3][6].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[3][6].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[2][6].pcType ).to.equal( Pieces.PAWN );
        expect( board.prop('bState')[2][6].pcOwner ).to.equal( Players.WHITE );
        expect(board.prop('bState')[7][8].blackPieces.length).to.equal( 15 );
        clickSquareAt(1,4);
        clickSquareAt(3,4);
        clickSquareAt(7,7);
        expect( board.prop('bState')[7][7].isSelected ).to.equal( true );
        expect( board.prop('bState')[6][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[4][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[3][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[1][7].isHighlighted ).to.equal( true );
        clickSquareAt(1,7);
        expect(board.prop('bState')[7][8].blackPieces.length).to.equal( 14 );
        clickSquareAt(3,4);
        clickSquareAt(4,4);
        clickSquareAt(6,5);
        clickSquareAt(4,5);

        // tests en-passant again
        clickSquareAt(4,4);
        expect( board.prop('bState')[4][5].isCapturable ).to.equal( true );
        expect( board.prop('bState')[4][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[5][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][5].isHighlighted ).to.equal( true );
        clickSquareAt(5,5);
        expect( board.prop('bState')[4][5].isCapturable ).to.equal( false );
        expect( board.prop('bState')[4][5].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[4][5].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[4][4].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[4][4].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[5][5].pcType ).to.equal( Pieces.PAWN );
        expect( board.prop('bState')[5][5].pcOwner ).to.equal( Players.BLACK );
        expect(board.prop('bState')[7][8].whitePieces.length).to.equal( 15 );
        clickSquareAt(1,7);
        clickSquareAt(0,7);
        clickSquareAt(5,5);
        clickSquareAt(6,5);
        expect(board.prop('bState')[7][8].whiteCheck).to.equal( true );
        clickSquareAt(7,4);
        expect( board.prop('bState')[6][5].isHighlighted ).to.equal( true );
        clickSquareAt(6,5);
        expect(board.prop('bState')[7][8].whiteCheck).to.equal( false );
        expect(board.prop('bState')[7][8].blackPieces.length).to.equal( 12 );

    });

    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});


// FOURTH GAME SIMULATION
describe('GAME SIMULATION 4 (long)', () => {

    let app = mount(<App test = {true} />);
    let board = app.find('Board');
    let boardDiv = board.find('div.board');
    let button = null;

    test('Game ran as expected', () => {
        clickSquareAt(6,7);
        clickSquareAt(4,7);
        clickSquareAt(1,7);
        clickSquareAt(3,7);
        clickSquareAt(6,6);
        clickSquareAt(4,6);
        clickSquareAt(1,6);
        clickSquareAt(3,6);
        clickSquareAt(7,5);
        expect( board.prop('bState')[6][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[6][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[5][7].isHighlighted ).to.equal( true );
        clickSquareAt(6,6);
        clickSquareAt(0,5);
        clickSquareAt(1,6);
        clickSquareAt(7,6);
        clickSquareAt(5,7);
        clickSquareAt(0,6);
        clickSquareAt(2,5);

        // tests white right-castling
        clickSquareAt(7,4);
        expect( board.prop('bState')[7][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[7][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[7][4].hasMoved ).to.equal( false );
        expect( board.prop('bState')[7][7].hasMoved ).to.equal( false );
        clickSquareAt(7,6);
        expect( board.prop('bState')[7][5].pcType ).to.equal( Pieces.ROOK );
        expect( board.prop('bState')[7][5].pcOwner ).to.equal( Players.WHITE );
        expect( board.prop('bState')[7][5].hasMoved ).to.equal( true );
        expect( board.prop('bState')[7][6].pcType ).to.equal( Pieces.KING );
        expect( board.prop('bState')[7][6].pcOwner ).to.equal( Players.WHITE );
        expect( board.prop('bState')[7][6].hasMoved ).to.equal( true );
        expect( board.prop('bState')[7][4].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[7][4].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[7][7].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[7][7].pcOwner ).to.equal( Players.NONE );

        // tests black right-castling
        clickSquareAt(0,4);
        expect( board.prop('bState')[0][4].isSelected ).to.equal( true );
        expect( board.prop('bState')[0][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[0][6].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[0][4].hasMoved ).to.equal( false );
        expect( board.prop('bState')[0][7].hasMoved ).to.equal( false );
        clickSquareAt(0,6);
        expect( board.prop('bState')[0][5].pcType ).to.equal( Pieces.ROOK );
        expect( board.prop('bState')[0][5].pcOwner ).to.equal( Players.BLACK );
        expect( board.prop('bState')[0][5].hasMoved ).to.equal( true );
        expect( board.prop('bState')[0][6].pcType ).to.equal( Pieces.KING );
        expect( board.prop('bState')[0][6].pcOwner ).to.equal( Players.BLACK );
        expect( board.prop('bState')[0][6].hasMoved ).to.equal( true );
        expect( board.prop('bState')[0][4].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[0][4].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[0][7].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[0][7].pcOwner ).to.equal( Players.NONE );

        clickSquareAt(6,5);
        clickSquareAt(4,5);
        clickSquareAt(2,5);
        clickSquareAt(1,7);
        clickSquareAt(4,5);
        clickSquareAt(3,5);

        // tests en-passant
        clickSquareAt(1,4);
        clickSquareAt(3,4);
        clickSquareAt(3,5);
        expect( board.prop('bState')[3][5].pcType ).to.equal( Pieces.PAWN );
        expect( board.prop('bState')[3][5].pcOwner ).to.equal( Players.WHITE );
        expect( board.prop('bState')[3][5].isSelected ).to.equal( true );
        expect( board.prop('bState')[2][4].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][5].isHighlighted ).to.equal( false );
        clickSquareAt(2,4);
        expect( board.prop('bState')[3][4].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[3][4].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[3][5].isSelected ).to.equal( false );
        expect( board.prop('bState')[2][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[3][5].pcType ).to.equal( Pieces.EMPTY );
        expect( board.prop('bState')[3][5].pcOwner ).to.equal( Players.NONE );
        expect( board.prop('bState')[2][4].pcType ).to.equal( Pieces.PAWN );
        expect( board.prop('bState')[2][4].pcOwner ).to.equal( Players.WHITE );
        clickSquareAt(1,0);
        clickSquareAt(2,0);
        clickSquareAt(2,4);
        clickSquareAt(1,5);
        expect( board.prop('bState')[7][8].blackCheck ).to.equal( true );
        clickSquareAt(1,7);
        expect( board.prop('bState')[1][7].isSelected ).to.equal( true );
        expect( board.prop('bState')[0][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[3][6].isHighlighted ).to.equal( false );
        clickSquareAt(3,7);
        expect( board.prop('bState')[4][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][7].isHighlighted ).to.equal( false );
        clickSquareAt(3,7);
        expect( board.prop('bState')[4][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[4][7].isHighlighted ).to.equal( false );
        clickSquareAt(0,3);
        expect( board.prop('bState')[0][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( false );
        clickSquareAt(0,5);
        expect( board.prop('bState')[0][4].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[2][5].isHighlighted ).to.equal( false );
        clickSquareAt(0,6);
        expect( board.prop('bState')[0][6].isSelected ).to.equal( true );
        expect( board.prop('bState')[0][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][7].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[1][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[1][7].isHighlighted ).to.equal( false );
        clickSquareAt(0,5);
        clickSquareAt(1,5);
        expect( board.prop('bState')[7][8].blackCheck ).to.equal( false );
        expect( board.prop('bState')[0][5].isSelected ).to.equal( false );
        expect( board.prop('bState')[1][5].isHighlighted ).to.equal( false );
        clickSquareAt(5,7);
        clickSquareAt(3,6);
        clickSquareAt(0,3);
        clickSquareAt(0,5);
        clickSquareAt(7,5);
        clickSquareAt(7,4);
        clickSquareAt(1,5);
        clickSquareAt(7,5);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( true );
        clickSquareAt(7,6);
        expect( board.prop('bState')[6][7].isHighlighted ).to.equal( true );
        clickSquareAt(6,7);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( false );
        clickSquareAt(0,5);
        clickSquareAt(6,5);
        clickSquareAt(6,7);
        expect( board.prop('bState')[6][7].isSelected ).to.equal( true );
        expect( board.prop('bState')[6][7].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[7][7].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[5][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[5][7].isHighlighted ).to.equal( true );
        clickSquareAt(5,7);
        clickSquareAt(7,5);
        clickSquareAt(7,7);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( true );
        clickSquareAt(7,4);
        expect( board.prop('bState')[7][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[7][6].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[7][7].isHighlighted ).to.equal( true );
        clickSquareAt(7,7);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( false );
        clickSquareAt(6,5);
        clickSquareAt(4,7);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( true );
        clickSquareAt(5,7);
        clickSquareAt(4,7);
        expect( board.prop('bState')[7][8].whiteCheck ).to.equal( false );
        clickSquareAt(0,6);
        expect( board.prop('bState')[1][5].isHighlighted ).to.equal( false );
        expect( board.prop('bState')[0][5].isHighlighted ).to.equal( true );
        expect( board.prop('bState')[0][7].isHighlighted ).to.equal( true );
        clickSquareAt(0,7);
        clickSquareAt(7,3);
        clickSquareAt(7,5);
        clickSquareAt(1,3);
        clickSquareAt(3,3);
        clickSquareAt(7,5);
        clickSquareAt(1,5);
        expect( board.prop('bState')[7][8].blackCheck ).to.equal( false );
        clickSquareAt(3,3);
        clickSquareAt(4,3);
        clickSquareAt(3,6);
        clickSquareAt(2,4);
        clickSquareAt(1,2);
        clickSquareAt(3,2);
        clickSquareAt(1,5);
        clickSquareAt(1,6);
        expect( board.prop('bState')[7][8].blackCheckMate ).to.equal( true );
    });

    // clicks the square at the given coordinates
    function clickSquareAt(y, x){
        button = boardDiv.childAt(y).childAt(x).childAt(0);
        button.simulate('click');
    }
});
