/**
* For debugging dateOperations().
* 
* @returns void
*/
function debugSnowDateCleaner() {
  var masterBacklogs = new serviceMasterBacklog();
  snow_DateCleaner(masterBacklogs.Collection);
  return;
}

/**
* For the proposal backlog, checks for date
* columns, verifies they are dates, removes
* the late dates and will sort and clean the
* backlog.
* 
* @param {Sheet} propBacklog The backlog to be edited.
*/
function snow_DateCleaner(propBacklog) {
  propBacklog = propBacklog[2];
  var dim = getDimensions(propBacklog);
  var backlogArray = getBacklogArray(propBacklog, dim);
  var assignmentDate, stateOffice;
  if (validateHeader('Assignment Finish', backlogArray, dim)) {
    assignmentDate = getMeThatColumn('Assignment Finish', backlogArray, dim);
    stateOffice = getMeThatColumn('Opportunity: Office', backlogArray, dim);
  } else if (validateHeader('Assignment Finish', backlogArray, dim) === false) {
    throw 'Unable to find column: Assignment Finish';
  }
  var dateAdjLog = snow_RemoveLateDates(backlogArray, dim, assignmentDate);
  snow_SortAndCleanDates(propBacklog, dateAdjLog, dim, assignmentDate);
}

/**
* Sets up variables for comparing dates by
* locating the columns and state abreviations
* for the rest of the dateOperations().
* 
* @param {Array} backlogArray 
* @param {Array} dim 
* @param {Number} assignmentDate 
* @param {Number} propStatDate 
* @param {String} stateOffice
* @returns If dateCol2 is not null, corrected dates backlog is returned.
* @returns If dateCol2 is null, the backlog is returned unchanged.
*/
function snow_RemoveLateDates(backlogArray, dim, assignmentDate) {
  if (assignmentDate !== null) {
    for (var row = 1; row <= dim[0] - 1; row++) {
      var dateValue = new Date(backlogArray[row][assignmentDate]);
      backlogArray[row][assignmentDate] = timeAddHours(dateValue, 24);
    }
    return backlogArray;
  } else if (assignmentDate === null) {
    return backlogArray;
  }
}

/**
* Will sort the date column within the google
* sheet then Removes the redundant date column.
* 
* @param {Sheet} backlogSheet 
* @param {Array} dateAdjLog 
* @param {Array} dim 
* @param {Number} dateCol 
* @param {Number} propStatDate 
* @returns void
*/
function snow_SortAndCleanDates(backlogSheet, dateAdjLog, dim, assignmentDate) {
  backlogSheet.getRange(1, 1, dim[0], dim[1]).setValues(dateAdjLog);
  backlogSheet.getRange(2, 1, dim[0], dim[1]).sort([
    { column: assignmentDate + 1, ascending: true }
  ]);
  backlogSheet.getRange(1, assignmentDate + 1).setValue('Due Date');
  SpreadsheetApp.flush();
  return;
}
