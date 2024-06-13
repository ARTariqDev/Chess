import React, { useEffect, useState } from 'react';

// Piece positions on a standard chess board
const initialPiecePositions = {
  'rook-w': [{ x: 0, y: 7 }, { x: 7, y: 7 }],
  'knight-w': [{ x: 1, y: 7 }, { x: 6, y: 7 }],
  'bishop-w': [{ x: 2, y: 7 }, { x: 5, y: 7 }],
  'queen-w': [{ x: 3, y: 7 }],
  'king-w': [{ x: 4, y: 7 }],
  'pawn-w': Array.from({ length: 8 }, (_, i) => ({ x: i, y: 6 })),
  'rook-b': [{ x: 0, y: 0 }, { x: 7, y: 0 }],
  'knight-b': [{ x: 1, y: 0 }, { x: 6, y: 0 }],
  'bishop-b': [{ x: 2, y: 0 }, { x: 5, y: 0 }],
  'queen-b': [{ x: 3, y: 0 }],
  'king-b': [{ x: 4, y: 0 }],
  'pawn-b': Array.from({ length: 8 }, (_, i) => ({ x: i, y: 1 }))
};

function App() {
  const [piecePositions, setPiecePositions] = useState(initialPiecePositions);
  const tileSize = 100; // Each tile is 100x100 pixels
  const colors = ['white', 'green'];

  useEffect(() => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Draw the chessboard
    const drawBoard = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const colorIndex = (row + col) % 2;
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }
    };

    // Draw all pieces
    const drawPieces = () => {
      Object.keys(piecePositions).forEach(piece => {
        const img = new Image();
        img.src = `${piece}.svg`; // Adjust the path as needed
        img.onload = () => {
          piecePositions[piece].forEach(pos => {
            ctx.drawImage(img, pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
          });
        };
      });
    };

    drawBoard();
    drawPieces();
  }, [piecePositions]);

  const handlePawnClick = (piece, index) => {
    if (piece.startsWith('pawn')) {
      setPiecePositions(prevPositions => {
        const newPositions = { ...prevPositions };
        const pawn = newPositions[piece][index];
        if (piece.includes('-w') && pawn.y > 0) pawn.y -= 1; // Move the white pawn up one square
        if (piece.includes('-b') && pawn.y < 7) pawn.y += 1; // Move the black pawn down one square
        return newPositions;
      });
    }
  };

  const handleClick = (e) => {
    // Determine the position clicked
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / 100);
    const row = Math.floor(y / 100);

    // Check if a pawn is at the clicked position and move it
    Object.keys(piecePositions).forEach(piece => {
      piecePositions[piece].forEach((pos, index) => {
        if (pos.x === col && pos.y === row) {
          handlePawnClick(piece, index);
        }
      });
    });
  };

  return (
    <div>
      <canvas
        id="myCanvas"
        width="800"
        height="800"
        style={{ border: 'solid 1px black', margin: '2em', marginLeft: '25em' }}
        onClick={handleClick}
      ></canvas>
    </div>
  );
}

export default App;
