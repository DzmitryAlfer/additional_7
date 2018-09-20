module.exports = function solveSudoku(matrix) {
  const result = sudoku(matrix);

  return result.matrix;
}

const getAvailableNumsFromCol = (matrix, y) => {
  const result = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (i = 0; i < matrix.length; ++i) {
    const val = matrix[i][y];

    if(val > 0) {
      const index = result.indexOf(val);
  
      if (index !== -1) {
        result.splice(index, 1);
      }
    }
  }

  return result;
}

const getAvailableNumsFromRow = (matrix, x) => {
  const result = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (i = 0; i < matrix[x].length; ++i) {
    const val = matrix[x][i];

    if(val > 0) {
      const index = result.indexOf(val);
  
      if (index !== -1) {
        result.splice(index, 1);
      }
    }
  }

  return result;
}

const getAvailableNumsFromSquare = (matrix, x, y) => {
  const minX = x - (x % 3);
  const maxX = minX + 2
  const minY = y - (y % 3);
  const maxY = minY + 2

  const result = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  for (let innerX = minX; innerX <= maxX; ++innerX) {
    for (let innerY = minY; innerY <= maxY; ++innerY) {
      const val = matrix[innerX][innerY];
      if(val > 0) {
        const index = result.indexOf(val);
    
        if (index !== -1) {
          result.splice(index, 1);
        }
      }
    }
  }

  return result;
}

const findPositionWithMinimalVariants = (matrix) => {
  let posX = -1, posY = -1;
  let variants = [];

  for (let x = 0; x < matrix.length; ++x) {
    for (let y = 0; y < matrix[x].length; ++y) {
      if (matrix[x][y] == 0) {
        const colResult = getAvailableNumsFromCol(matrix, y);
        const rowResult = getAvailableNumsFromRow(matrix, x);
        const squareResult = getAvailableNumsFromSquare(matrix, x, y);

        const currentVariants = [1,2,3,4,5,6,7,8,9].filter(num => 
          colResult.includes(num) && rowResult.includes(num) && squareResult.includes(num));
        
          if (posX < 0 || variants.length > currentVariants.length) 
          {
            posX = x;
            posY = y;
            variants = currentVariants;
          }
      }
    }
  }

  return {x: posX, y: posY, variants: variants}
}

const sudoku = (matrix) => {
    const positions = findPositionWithMinimalVariants(matrix);

    if(positions.x < 0)
    {
      return {isSolved: true, matrix: matrix};
    }

    const variants = positions.variants;
    if(variants.length == 0) {
      return {isSolved: false, matrix: matrix};
    }

    for(let i = 0; i < variants.length; ++i) {
      const copy = matrix.map(r => [...r]);

      copy[positions.x][positions.y] = variants[i];
      
      let result = sudoku(copy);

      if(result.isSolved) {
        return result;
      }
    }

    return {isSolved: false, matrix: matrix};
}