/**
 * Get's the report from the master chrono
 */
function getReport() {
  var ssThis = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    'Dept. Report'
  );
  var ssNY = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NY-09');
  // Dev: 1r06cw7MtVKolZY6pXkmuoxcWPUeqtdm8Tu9sc5ljBkg
  // Prod: 121UKskNpiVK2ocT8pFIx9uO6suw3o7S7C4VhiIaqzI0
  var ssReport = SpreadsheetApp.openById(
    '1r06cw7MtVKolZY6pXkmuoxcWPUeqtdm8Tu9sc5ljBkg'
  ).getSheetByName('Report');
  var completeBacklog = [];
  var nyBacklog = [];

  var header = ssReport.getRange('2:2').getValues()[0];
  var dueInCol = header.indexOf('DUE IN: (hh:mm)');
  var solarProjectCol = header.indexOf('SOLAR PROJECT') - dueInCol;
  var cadObjCol = header.indexOf('CAD OBJECT') - dueInCol;
  var officeCol = header.indexOf('OFFICE') - dueInCol;
  var statusCol = header.indexOf('STATUS') - dueInCol;
  var notesCol = header.indexOf('NOTES') - dueInCol;
  var redesignCol = header.indexOf('REDESIGN ASSIGNMENT') - dueInCol;
  var lastRow = ssReport.getLastRow() - 1;
  var range = ssReport.getRange(3, dueInCol + 1, lastRow, redesignCol + 1);
  var formulas = range.getFormulas();
  completeBacklog = range.getValues().filter(function(row, index) {
    var foundNYBool = ['ny-09'].some(function(state) {
      return (
        row[officeCol].toLowerCase().indexOf(state) > -1 ||
        row[notesCol].toLowerCase().indexOf(state) > -1
      );
    });
    var onHoldBool = row[statusCol].match(/on hold/i);
    if (!onHoldBool && !foundNYBool) {
      row[solarProjectCol] = formulas[index][solarProjectCol];
      row[cadObjCol] = formulas[index][cadObjCol];
      return true;
    }
    if (foundNYBool) {
      var temp = row;
      temp[solarProjectCol] = formulas[index][solarProjectCol];
      temp[cadObjCol] = formulas[index][cadObjCol];
      nyBacklog.push(temp);
      return false;
    } else {
      return false;
    }
  });

  setBacklog(ssThis, completeBacklog);
  setBacklog(ssNY, nyBacklog);

  return;
}

function setBacklog(ss, backlog) {
  var lastRow = ss.getLastRow() - 1;
  var lastCol = ss.getLastColumn();
  ss.getRange(3, 4, lastRow, lastCol - 3).clearContent();

  var rowNeeded = backlog.length;
  if (rowNeeded > 0) {
    var colNeeded = backlog[0].length;
    ss.getRange(3, 4, rowNeeded, colNeeded).setValues(backlog);
  }
}
