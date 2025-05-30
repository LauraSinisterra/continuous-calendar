// =========================
// Constants & Setup
// =========================

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN','JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const today = new Date();
let currentYear = today.getFullYear();

const currentYearSpan = document.getElementById('currentYear');
const prevYearBtn = document.getElementById('prevYear');
const nextYearBtn = document.getElementById('nextYear');


// =========================
// Event Listeners
// =========================

prevYearBtn.addEventListener('click', () => updateYear(currentYear - 1));
nextYearBtn.addEventListener('click', () => updateYear(currentYear + 1));


// =========================
// Calendar Rendering
// =========================

function updateYear(newYear) {
  currentYear = newYear;
  currentYearSpan.textContent = currentYear;
  renderCalendar(currentYear);
}

function renderCalendar(year) {
  document.querySelectorAll('.month').forEach(el => el.remove());

  const container = document.querySelector('.container');
  const footer = document.querySelector('.footer');

  const temp = document.createElement('div');
  temp.innerHTML = generateCalendarHTML(year);

  [...temp.children].forEach(month => container.insertBefore(month, footer));

  highlightCurrentDate();
}

function generateCalendarHTML(year) {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  let html = '';
  let carryOverClass = null;
  let carryOverLabel = null;
  let previousEndedWithOverlap = false;

  for (let month = 0; month < 12; month++) {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const prevMonthLastDate = new Date(year, month, 0);

    const daysInMonth = lastDate.getDate();
    const daysInPrevMonth = prevMonthLastDate.getDate();
    const startDay = (firstDate.getDay() + 6) % 7;
    const totalCells = startDay + daysInMonth;
    const totalRows = Math.ceil(totalCells / 7);

    let rows = [];
    let day = 1;
    let cellIndex = 0;
    const nextMonthName = monthNames[(month + 1) % 12];

    for (let row = 0; row < totalRows; row++) {
      let tempCells = [];
      let rowHasEarlyMonthEnd = false;
      let rowHasLateMonthEnd = false;

      for (let i = 0; i < 7; i++) {
        const dateIndex = cellIndex - startDay;
        let cell;

        if (dateIndex < 0) {
          const prevDate = daysInPrevMonth + dateIndex + 1;
          cell = `<td class="over" data-month="${(month + 1) % 12}">${String(prevDate).padStart(2, '0')}</td>`;
        } else if (day <= daysInMonth) {
          const isEnd = day === daysInMonth;
          if (isEnd && i < 6) rowHasEarlyMonthEnd = true;
          if (isEnd && i === 6) rowHasLateMonthEnd = true;

          const className = isEnd ? 'month-end' : '';
          cell = `<td${className ? ` class="${className}"` : ''} data-month="${month}">${String(day).padStart(2, '0')}</td>`;
          day++;
        } else {
          const overflow = day - daysInMonth;
          cell = `<td class="over" data-month="${(month + 1) % 12}">${String(overflow).padStart(2, '0')}</td>`;
          day++;
        }

        tempCells.push(cell);
        cellIndex++;
      }

      const rowData = {
        class: '',
        labelCell: '<td class="empty"></td>',
        cells: tempCells
      };

      if (carryOverClass === 'after-not-overlap' && carryOverLabel) {
        rowData.class = 'after-not-overlap';
        rowData.labelCell = `<td class="month-name" data-month="${(month + 11) % 12}">${carryOverLabel}</td>`;
        carryOverClass = null;
        carryOverLabel = null;
      }

      if (rowHasEarlyMonthEnd) {
        rowData.class = 'overlap';
        rowData.labelCell = `<td class="month-name" data-month="${(month + 1) % 12}">${nextMonthName}</td>`;
      } else if (rowHasLateMonthEnd) {
        rowData.class = 'not-overlap';
        rowData.labelCell = `<td class="empty"></td>`;
        carryOverClass = 'after-not-overlap';
        carryOverLabel = nextMonthName;
      }

      rows.push(rowData);
    }

    // ✅ Hide the first row if the previous month ended with overlap — unless it's marked as after-not-overlap
    if (previousEndedWithOverlap && rows.length > 0 && !rows[0].class.includes('after-not-overlap')) {
      rows[0].class += (rows[0].class ? ' ' : '') + 'hidden';
    }

    // Save whether this month ended with overlap
    const lastRowClass = rows.length ? rows[rows.length - 1].class : '';
    previousEndedWithOverlap = lastRowClass.includes('overlap');

    const htmlRows = rows
      .map(row => `<tr${row.class ? ` class="${row.class}"` : ''}>${row.labelCell}${row.cells.join('')}</tr>`)
      .join('');

    html += `
      <div class="month">
        <div class="month-days">
          <table>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return html;
}



function highlightCurrentDate() {
  const currentDate = new Date();
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  const currentMonth = months[currentDate.getMonth()];
  const currentYearCheck = currentDate.getFullYear();

  if (currentYear !== currentYearCheck) return;

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const monthNameCell = table.querySelector('td.month-name');
    if (monthNameCell?.textContent === currentMonth) {
      const cells = table.querySelectorAll('td:not(.month-name):not(.empty):not(.over)');
      cells.forEach(cell => {
        if (cell.textContent === currentDay) {
          cell.classList.add('current');
          highlightAdjacentWeeks(cell);
        }
      });
    }
  });
}

function highlightAdjacentWeeks(currentCell) {
  const allTables = document.querySelectorAll('table');
  const allRows = Array.from(allTables).flatMap(table => Array.from(table.querySelectorAll('tr')));
  const currentRow = currentCell.closest('tr');
  const currentRowIndex = allRows.indexOf(currentRow);

  currentRow.classList.add('current-week');

  for (let i = 1; i <= 11; i++) {
    if (currentRowIndex - i >= 0) allRows[currentRowIndex - i].classList.add(`week-${i}`);
    if (currentRowIndex + i < allRows.length) allRows[currentRowIndex + i].classList.add(`week-${i}`);
  }

  for (let i = 0; i < allRows.length; i++) {
    if (Math.abs(i - currentRowIndex) >= 11) {
      allRows[i].classList.add("all-following-weeks");
    }
  }
}

// ========== INITIAL LOAD ==========
currentYearSpan.textContent = currentYear;
renderCalendar(currentYear);
