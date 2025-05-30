document.addEventListener('DOMContentLoaded', () => {
    // HIGHLIGHTING LOGIC
    document.querySelectorAll('.month table td:not(.empty)').forEach(td => {
      let month = parseInt(td.getAttribute('data-month'), 10);
      const isOver = td.classList.contains('over');
      const originalMonth = month;
  
      td.addEventListener('mouseenter', () => {
        td.classList.add('hovering');
  
        // If the cell is an "over" day, use the next month's label
        const labelMonth = isOver ? (month % 12) : month;
  
        // Look in this table first
        const parentTable = td.closest('table');
        if (parentTable) {
          const labels = parentTable.querySelectorAll(`.month-name[data-month="${labelMonth}"]`);
          labels.forEach(label => label.classList.add('hovering'));
        }
  
        // Look in previous and next month blocks
        const parentMonthDiv = td.closest('.month');
        if (parentMonthDiv) {
          const adjacentMonthDivs = [
            parentMonthDiv.previousElementSibling,
            parentMonthDiv.nextElementSibling
          ];
          adjacentMonthDivs.forEach(div => {
            if (div) {
              const label = div.querySelector(`.month-name[data-month="${labelMonth}"]`);
              if (label) label.classList.add('hovering');
            }
          });
        }
      });
  
      td.addEventListener('mouseleave', () => {
        td.classList.remove('hovering');
  
        const labelMonth = isOver ? (originalMonth % 12) : originalMonth;
        document.querySelectorAll(`.month-name[data-month="${labelMonth}"]`).forEach(label => {
          label.classList.remove('hovering');
        });
      });
    });

  });
  
