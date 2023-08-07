import React from 'react';
import './App.css';
import { GridSection, IGridSectionProps, IMainGrid, Status as CellStatus } from './GridSection';
import { Stack } from '@fluentui/react';
import KayBearIcon from './Icons/kaybearIcon.png';
import ZoeyIcon from './Icons/zoeyIcon.png';
import Xarrow, { Xwrapper } from 'react-xarrows';

interface ArrowStartEnd {
  start: string;
  end: string;
}

function App() {

  const nextId = React.useRef<number>(0);
  const gridHeight = React.useRef<number>(6);
  const gridWidth = React.useRef<number>(7);
  const [playerTurn, setPlayerTurn] = React.useState<number>(0);
  const [gameWinner, setGameWinner] = React.useState<number>(-1);
  const winningCellsRef =  React.useRef<IGridSectionProps[]>([]);
  const [mouseOverColumn, setMouseOverColumn] = React.useState<number>(-1);
  const [arrowStartEnd, setArrowStartEnd] = React.useState<ArrowStartEnd>({start: '', end: ''});

  // use this inside event handlers like onClick to get the latest state
  const turnRef = React.useRef(0);

  React.useEffect(() => {
    turnRef.current = playerTurn
  }, [playerTurn]);

  React.useEffect(() => {
    console.log(arrowStartEnd);
  }, [arrowStartEnd])

  const getUniqueId = () => {
    return nextId.current++;
  }

  const getCurrentPlayerStatus = () : CellStatus => {
    if (turnRef.current === 1)
      return CellStatus.Player1Owned
    else
      return CellStatus.Player2Owned
  };

  const updateMouseoverColumn = React.useCallback((column: number) => {
    setMouseOverColumn(column);
  }, []);

  const onCellClick = (event: React.MouseEvent, x: number, y: number) => {
    let tempGrid = playGrid.grid;

    let playableY = 0;
    while (tempGrid[playableY][x].status !== CellStatus.Playable) {
      playableY++;
    }

    if (tempGrid[playableY][x].status !== CellStatus.Playable)
      return;


    tempGrid[playableY][x].status = getCurrentPlayerStatus();

    if (playableY > 0)
      tempGrid[playableY-1][x].status = CellStatus.Playable;

    if (!checkWinCondition(tempGrid, x, playableY))
      setPlayerTurn(turnRef.current === 1 ? 2 : 1)
    else
      doWin();

    setPlayGrid({...playGrid, grid: tempGrid});
  };

  const getInitialGrid = () : IMainGrid => {
    let grid = [];
    for (let row = 0; row < gridHeight.current; row++) {
      let gridRow: IGridSectionProps[] = [];
      for (let col = 0; col < gridWidth.current; col++) {
        gridRow.push({
          id: getUniqueId(),
          y: row,
          x: col,
          disabled: false,
          winningCell: false,
          gameOver: false,
          onClick: onCellClick,
          status: CellStatus.Empty,
          columnIsMouseover: false,
          setMouseoverColumn: updateMouseoverColumn
        } as IGridSectionProps);
      }
      if (row === gridHeight.current - 1) {
        for (let col = 0; col < gridWidth.current; col++){
          gridRow[col].status = CellStatus.Playable;
          gridRow[col].disabled = false;
        }
      }

      grid.push(gridRow);
    }
    return {
      grid: grid
    };
  };

  const [playGrid, setPlayGrid] = React.useState<IMainGrid>(getInitialGrid());

  const resetPlayGrid = () => {
    let tempGrid = playGrid.grid;
    for (let row = 0; row < gridHeight.current; row++){
      for (let col = 0; col < gridWidth.current; col++){
        tempGrid[row][col].status = CellStatus.Empty;
        tempGrid[row][col].disabled = false;
        tempGrid[row][col].winningCell = false;
      }

      if (row === gridHeight.current - 1) {
        for (let col = 0; col < gridWidth.current; col++){
          tempGrid[row][col].status = CellStatus.Playable;
          tempGrid[row][col].disabled = false;
        }
      }
    }
    setPlayGrid({...playGrid, grid: tempGrid});
  }

  const disablePlayGrid = () => {
    let tempGrid = playGrid.grid;
    for (let row = 0; row < gridHeight.current; row++){
      for (let col = 0; col < gridWidth.current; col++){
        tempGrid[row][col].disabled = true;
      }
    }
    setPlayGrid({...playGrid, grid: tempGrid});
  }

  const renderGrid = () : React.ReactNode => {

    const renderRow = (cells: IGridSectionProps[], idx: number) : React.ReactNode => {
      const rowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        // marginTop: `${idx === 0 ? -5 : 0}px`,
        // marginRight: '-20px',
        // marginBottom: `${idx === gridHeight.current-1 ? -5 : 0}px`,
        // marginLeft: '-20px'
      }
      return (
        <div style={rowStyle}>
          {cells.map((c, i) => {
            let props = {...c, columnIsMouseover: i === mouseOverColumn} as IGridSectionProps
            return (
              <GridSection
                key={`cell-${idx}-${i}}`}
                {...props}
              />
            )
          })}
        </div>
      )
    }

    let grid =
      <Stack>
        {playGrid.grid.map((gridRow, i) => {
          return renderRow(gridRow, i)
        })}
      </Stack>

    return grid;
  }

  const getCurrentPlayerText = () => {
    return (
      <div style={{marginTop: '20px', fontFamily: 'Verdana, sans-serif', fontSize: '20px', color: 'white'}}>
        {playerTurn !== 0 ? `Player ${playerTurn}` : ''}
      </div>
    )
  }

  const getWinnerText = () => {
      return (
        <div style={{marginTop: '20px', fontFamily: 'Verdana, sans-serif', fontSize: '20px', color: 'white'}}>
          {`PLAYER ${playerTurn} WINS`}
        </div>
      )
  }

  const onResetButtonClick = () => {
    resetPlayGrid();
    setGameWinner(-1);
    setPlayerTurn(1);
  }

  const highlightWinningCells = () => {
    let tempGrid: IGridSectionProps[][] = playGrid.grid;
    winningCellsRef.current.forEach(c => {
      tempGrid[c.y][c.x].winningCell = true;
    })
    setPlayGrid({...playGrid, grid: tempGrid});
  }

  const doWin = () => {
    setGameWinner(turnRef.current);
    disablePlayGrid();
    highlightWinningCells();
    setMouseOverColumn(-1);
  }

  const checkWinCondition = (grid: IGridSectionProps[][], x: number, y: number) : boolean => {
    let winCells: IGridSectionProps[] = [];

    // check for vertical wins
    for (let row = y; row < gridHeight.current; row++) {
      if (y > 2) {
        break;
      }
      if (grid[row][x].status !== getCurrentPlayerStatus()) {
        break;
      }
      else {
        winCells.push(grid[row][x])
        if (winCells.length >= 4) {
          setArrowStartEnd({
            ...arrowStartEnd, 
            start: `${winCells[0].y}, ${winCells[0].x}`,
            end: `${winCells[winCells.length-1].y}, ${winCells[winCells.length-1].x}`
          })

          winningCellsRef.current = winCells;
          return true;
        }
      }
    }

    // check for horizontal win
    winCells = [];
    let hLeft = -1;
    let hRight = -1;
    for (let col = x; col < gridWidth.current; col++) {
      if (grid[y][col].status === getCurrentPlayerStatus()) {
        winCells.push(grid[y][col]);
        hRight = col;
      }
      else {
        break;
      }
    }
    for (let col = x; col >= 0; col--) {
      if (grid[y][col].status === getCurrentPlayerStatus()) {
        hLeft = col;
        winCells.push(grid[y][col]);
      }
      else break;
    }

    if (hRight - hLeft >= 3) {
      setArrowStartEnd({
        ...arrowStartEnd, 
        start: `${y}, ${hLeft}`,
        end: `${y}, ${hRight}`
      })

      winningCellsRef.current = winCells;
      return true;
    }

    // check for diagonal win
    // to top right and bottom left
    winCells = [];
    let left = -1;
    let right = -1;
    for (let row = y, col = x; row >= 0 && col < gridWidth.current; row--, col++) {
      if (grid[row][col].status === getCurrentPlayerStatus()) {
        right = col;
        winCells.push(grid[row][col])
      }
      else break;
    }
    for (let row = y, col = x; row < gridHeight.current && col >= 0; row++, col--) {
      if (grid[row][col].status === getCurrentPlayerStatus()) {
        left = col;
        winCells.push(grid[row][col])
      }
      else break;
    }
    if (right - left >= 3) {
      let start = winCells.find(c => c.x === right);
      let end = winCells.find(c => c.x === left);
      if (start && end)
        setArrowStartEnd({
          ...arrowStartEnd, 
          start: `${start.y}, ${start.x}`,
          end: `${end.y}, ${end.x}`
        })

      winningCellsRef.current = winCells;
      return true;
    }

    // to top left and bottom right
    winCells = [];
    left = right = -1;
    for (let row = y, col = x; row >= 0 && col >= 0; row--, col--) {
      if (grid[row][col].status === getCurrentPlayerStatus()) {
        left = col;
        winCells.push(grid[row][col])
      }
      else break;
    }
    for (let row = y, col = x; row < gridHeight.current && col < gridWidth.current; row++, col++) {
      if (grid[row][col].status === getCurrentPlayerStatus()) {
        right = col;
        winCells.push(grid[row][col])
      }
      else break;
    }
    if (right - left >= 3) {
      let start = winCells.find(c => c.x === right);
      let end = winCells.find(c => c.x === left);
      if (start && end)
        setArrowStartEnd({
          ...arrowStartEnd, 
          start: `${start.y}, ${start.x}`,
          end: `${end.y}, ${end.x}`
        })

      winningCellsRef.current = winCells;
      return true;
    }

    winCells = [];
    return false;
  }

  const buttonStyle: React.CSSProperties = {
    width: '80%',
    minWidth: '125px',
    height: '30px',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }

  const getWinnerImage = (player: number) : string => {
    return player === 1 ? KayBearIcon : ZoeyIcon;
    }

  return (
    <div style={{backgroundColor: '#2e2e2e', height: '100vh'}}>
      <Stack>
        <div className="header" style={{height: '10vh', border: '2px solid black', alignItems: 'center'}}>
          Connect Four
        </div>

        <Stack horizontal={true} style={{justifyContent: 'center'}}>

          <div className="leftPanel" style={{padding: '30px', minWidth: '30vw', maxWidth: '30vw'}}>
            <Stack style={{alignItems: 'center', minWidth: '150px'}}>

              <button onClick={onResetButtonClick} style={buttonStyle}>
                Reset Game
              </button>

              {gameWinner === -1 &&
                getCurrentPlayerText()
              }
              {gameWinner !== -1 &&
                getWinnerText()
              }
              {gameWinner !== -1 &&
                <img
                  src={getWinnerImage(gameWinner)}
                  style={{marginTop: '20px', height: '100%', width: '100%'}}
                />
              }
            </Stack>
          </div>

          <Xwrapper>
            <div
              className="main"
              style={{
                border: '2px solid black',
                alignContent: 'center',
                padding: '20px',
                overflow: 'hidden',
                backgroundColor: '#808080',
                minWidth: '45vw',
                maxWidth: '45vw',
                minHeight: '83.5vh',
                maxHeight: '83.5vh'
              }}
            >
                {renderGrid()}
                {gameWinner !== -1 &&
                <Xarrow
                  start={arrowStartEnd.start}
                  end={arrowStartEnd.end}
                  color={"red"}
                  startAnchor={"middle"}
                  endAnchor={"middle"}
                  strokeWidth={10}
                  showHead={false}
                  path={'straight'}
                />}
            </div>
          </Xwrapper>

          <div className="rightPanel" style={{
            border: '2px solid black',
             minWidth: '18vw',
             maxWidth: '18vw'
          }}>
            rightPanel
          </div>

        </Stack>
      </Stack>
    </div>
  );
}

export default App;
