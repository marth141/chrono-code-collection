// @flow
/**
 *
 *
 * @param {any} sheet
 * @returns
 */
function getDimensions(sheet) {
  if (sheet !== null) {
    var dimensions = [];
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    dimensions.push(lastRow);
    dimensions.push(lastCol);
    return dimensions;
  } else {
    throw 'getDimensions() has a null; backlogSheet: ' + sheet;
  }
}

/**
 * Used to make an array from a google sheet
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {Array} dimensions
 * @return {Array[]}
 */
function getBacklogArray(sheet, dimensions) {
  if (sheet !== null) {
    var backlogData = sheet
      .getRange(1, 1, dimensions[0], dimensions[1])
      .getValues()
      .filter(function(value) {
        return (
          value[0].match(/^S-[0-9]/i) ||
          value[0].match(/^Service:/i) ||
          value[0].match(/^Project:/i) ||
          value[0].match(/^Opportunity:/i)
        );
      });
    return backlogData;
  } else {
    var getBacklogArrayError =
      'getBacklogArray() has a null; backlogSheet: ' + sheet;
    throw getBacklogArrayError;
  }
}

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} Report
 * @return {Array}
 */
function getHeader(Report) {
  var header = Report.getRange('2:2').getValues();
  return header;
}

/**
 * Gets all of the users who can be assigned an account
 * @param {GoogleAppsScript.Spreadsheet.Sheet} FilterSettings
 * @return {Array<String>[]}
 */
function getUsers(FilterSettings) {
  var userDataRange = 'B4:D';
  var users = FilterSettings.getRange(userDataRange)
    .getValues()
    .filter(function(designerRecord) {
      var name = designerRecord[0];
      var email = designerRecord[1];
      var sfName = designerRecord[3];
      return name !== '' || sfName !== '';
    });
  return users;
}

/**
 * Used to get headers
 * @param {String} columnName
 * @param {Array[]} backlogArray
 * @return {Number}
 */
function getMeThatColumnNoValidate(columnName, backlogArray) {
  var backlogHeaders = backlogArray[0];
  return backlogHeaders.indexOf(columnName);
}

/**
 *
 *
 * @param {String} columnName
 * @param {array} backlogArray
 * @returns
 */
function getMeThatIndexOf(columnName, backlogArray) {
  var col;
  if (backlogArray[0].indexOf(columnName)) {
    col = backlogArray[0].indexOf(columnName);
    return col;
  } else if (col === backlogArray[0].length) {
    throw 'getMeThatColumn() could not find: ' + columnName;
  }
}

/**
 *
 *
 * @param {any} completeBacklog
 * @returns
 */
function setCompleteBacklog(completeBacklog, Report) {
  var header = getHeader(Report);
  var serviceCol = getMeThatColumnNoValidate('SERVICE', header);
  var initialUpdateCol =
    getMeThatColumnNoValidate('INITIAL DATE', header) - serviceCol;
  Report.getRange(
    3,
    serviceCol + 1,
    Report.getLastRow() - 2,
    initialUpdateCol
  ).clearContent();
  var rowNeeded = completeBacklog.length;
  if (rowNeeded > 0) {
    var colNeeded = completeBacklog[0].length;
    Report.getRange(3, 7, rowNeeded, colNeeded).setValues(completeBacklog);
    SpreadsheetApp.flush();
  }
  return;
}

/**
 *
 *
 * @param {any} Report Sheet
 * @returns Live Backlog
 */
function getLiveReportBacklog(Report) {
  var header = getHeader(Report);
  var serviceCol = getMeThatColumnNoValidate('SERVICE', header);
  var initialUpdateCol =
    getMeThatColumnNoValidate('INITIAL DATE', header) - serviceCol;
  var backlogArray = Report.getRange(
    2,
    serviceCol + 1,
    Report.getLastRow() - 2,
    initialUpdateCol
  ).getValues();
  return backlogArray;
}

/**
 *
 *
 * @returns
 */
function updateLastRefresh(Report) {
  Report.getRange('B2').setValue(new Date());
  return;
}

/**
 * Sets the report running cell
 * to prevent redundant running
 * @param {GoogleAppsScript.Spreadsheet.Sheet} Report
 */
function reportRunning(Report) {
  // var checkReportStatus = Report.getRange('G1').getValue();
  // if (checkReportStatus !== '') {
  //   throw 'Report Already Running';
  // }
  var reportRunning_Location = 'G1';
  var reportRunning_Value = 'REPORT RUNNING';
  Report.getRange(reportRunning_Location).setValue(reportRunning_Value);
  SpreadsheetApp.flush();
  return;
}

function removeReportRunning(Report) {
  Report.getRange('G1').setValue('');
  SpreadsheetApp.flush();
  return;
}
