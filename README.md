# uigridcustomexport (Subgrid Export as Well)
Custom export for UI Grid (Export Subgrids as well)

Allows to Export data from UIgrid containing Subgrids as well.

Use the "customGridExport" service to access the functionality.

Following are the functions provided under the Service::

1 exportSubGridData(gridApi,options)
  - Exports data from subgrid along with the main grid.
  
2 exportGridDataWithAdditionalColumns(gridApi,options)
  - Exports All grid columns considered by Column Def. 
  - Additionally you can also provide add or skip columns that are part of grid.data but not of column defs

 
 
 Note:
Arugements:
1 - GripApi is the gridApi of that particular grid.(Required)
2 - Options is the following set of object you can set according to your need (Optional):


 Option Name | Type | Default | Description | Requirement
 ------------|------|---------|-------------|------------
 visibleRowsOnly | boolean | false | Property will make sure that only currently visible row data is exported | optional
 fileName | String | download | Name of resultant File | optional
 txtDelim | String | " (Double Quote)| | optional
 decimalSep|String| .(dot)|| optional
 quoteStrings |String|blank || optional
 header | Array | [] | CSV Column headers to be Exported| optional
 columnOrder | Array | [] | Order of columns| optional(Only if the order should be changed)
 fieldSep |String|, (Comma) | Delimiter for the CSV File.| optional
 fieldColumnNames |Array|[]| This is the field Name provided under column defs (Action data object keys)| optional(Will fetch from Gridapi Automaticallu)
 displayColumnNames |Array|[]|This is the Display Name field from Column Def (Actaul Names you wish to see while exporting)
 listOfFieldColumnsToBeNewlyAdded|Array|[]|These are field names(actual data key name) of columns the are part of Grid data object but not of Column Defs|optional.
 listOfDisplayColumnsToBeNewlyAdded|Array|[]|These are Display names for the option listOfFieldColumnsToBeNewlyAdded order should be maintained
 listOfFieldColumnsToBeSkipped|Array|[]|Columns to be skipped from the grid
 
 
