const tables = document.querySelectorAll('table');
const rows = document.querySelectorAll('tr');


// Get today's day of the month
const currentDate = new Date();
const currentDay = currentDate.getDate().toString(); // e.g., "15"


// Get current month's first three letters
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN','JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const currentMonth = months[currentDate.getMonth()];

// Declare cellsMonth and cells as global variables
let cellsMonth;
let cells;

// Highlight current day and month

function highlightCurrentDate() {
  tables.forEach(table => {
      // Get all <td> elements with the class 'month-name' in the current table
      cellsMonth = table.querySelectorAll('td.month-name');

      // Flag to check if the current table contains the current month
      let isCurrentMonth = false;

      // Check if any <td> in the table matches the current month
      cellsMonth.forEach(cell => {
          cell.classList.remove('current'); // Remove existing highlights
          if (cell.textContent.trim() === currentMonth) {
              cell.classList.add('current'); // Highlight the month cell
              isCurrentMonth = true;
          }
      });

      // If this is the current month's table, highlight the current day and weeks
      if (isCurrentMonth) {
          // Get all <td> elements in the current table (excluding month-name cells)
          cells = table.querySelectorAll('td:not(.month-name):not(.empty)');

          cells.forEach(cell => {
              cell.classList.remove('current'); // Remove existing highlights
              if (cell.textContent.trim() === "0" + currentDay || cell.textContent.trim() === currentDay) {
                  cell.classList.add('current'); // Highlight the day cell
                  highlightAdjacentWeeks(cell); // Highlight adjacent weeks
              }
          });
      }
  });
}

console.log(currentDay);

function highlightAdjacentWeeks(currentCell) {
  // Find all rows in ALL tables
  const allTables = document.querySelectorAll('table');
  const allRows = Array.from(allTables).flatMap(table => Array.from(table.querySelectorAll('tr:not(:has(th))')));
  
  // Get the index of the current row
  const currentRow = currentCell.closest('tr');
  const currentRowIndex = allRows.indexOf(currentRow);

  // Add 'current-week' class to current row
  currentRow.classList.add('current-week');

  // Add classes to rows above and below the current week
  for (let i = 1; i <= 11; i++) {
    
    // Row above current row
    if (currentRowIndex - i >= 0) {
      allRows[currentRowIndex - i].classList.add(`week-${i}`)
    }
    
    // Row below current row
    if (currentRowIndex + i < allRows.length) {
      allRows[currentRowIndex + i].classList.add(`week-${i}`)
    }
  }

  // Add 'all-following-weeks' class to rows beyond 11 weeks
  for (let i = 0; i < allRows.length; i++) {
    if (Math.abs(i - currentRowIndex) >= 11) {
      allRows[i].classList.add("all-following-weeks")
    }
  }
}


/* // range selector


let startDate, endDate;
let isSelectionActive = false;

const startButton = document.getElementById('startSelection');
const selectableCells = document.querySelectorAll('td:not(.empty):not(.month-name)');

function toggleSelection() {
  isSelectionActive = !isSelectionActive;
  clearSelection();
  
  if (isSelectionActive) {
    startButton.textContent = 'Clear Selection';
    selectableCells.forEach(cell => cell.classList.add('selectable'));
  } else {
    startButton.textContent = 'Start selection';
    selectableCells.forEach(cell => cell.classList.remove('selectable'));
  }
}

function handleDateClick(event) {
  const clickedCell = event.target;

  // Only proceed if selection is active and cell is valid
  if (!isSelectionActive || 
      clickedCell.tagName !== 'TD' || 
      clickedCell.classList.contains('empty') || 
      clickedCell.classList.contains('month-name')) return;

  if (!startDate || (startDate && endDate)) {
    // Start new selection
    clearSelection();
    startDate = clickedCell;
    clickedCell.classList.remove('selected', 'start-date', 'end-date', 'in-range');
    clickedCell.classList.add('selected', 'start-date');
  } else {
    // Complete the selection
    endDate = clickedCell;
    clickedCell.classList.remove('selected', 'start-date', 'end-date', 'in-range');
    clickedCell.classList.add('selected', 'end-date');
    highlightRange();
    isSelectionActive = false;
    selectableCells.forEach(cell => cell.classList.remove('selectable'));
  }
}

function highlightRange() {
  if (!startDate || !endDate) return;

  const allCells = document.querySelectorAll('td:not(.empty):not(.month-name)');
  let isInRange = false;

  allCells.forEach(cell => {
    cell.classList.remove('selected', 'start-date', 'end-date', 'in-range');

    if (cell === startDate) {
      cell.classList.add('selected', 'start-date');
      isInRange = true;
    } else if (cell === endDate) {
      cell.classList.add('selected', 'end-date');
      isInRange = false;
    } else if (isInRange) {
      cell.classList.add('in-range');
    }
  });
}

function clearSelection() {
  const allCells = document.querySelectorAll('td:not(.empty):not(.month-name)');

  allCells.forEach(cell => {
    cell.classList.remove('selected', 'start-date', 'end-date', 'in-range');
  });

  startDate = null;
  endDate = null;
}

// Add event listeners
startButton.addEventListener('click', toggleSelection);
document.addEventListener('click', handleDateClick); */

// Call the function to highlight the current date and adjacent weeks
highlightCurrentDate()