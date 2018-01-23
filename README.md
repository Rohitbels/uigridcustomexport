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
1 - GripApi is the gridApi of that particular grid.
2 - Options is the following set of object you can set according to your need (showing the default values):

{
            visibleRowsOnly: false,
            fileName: "download",
            txtDelim: '"',
            decimalSep: '.',
            quoteStrings: "",
            addByteOrderMarker: "",
            header: [],
            columnOrder: [],
            fieldSep: ",",
            fieldColumnNames: [],
            displayColumnNames: [],
            listOfFieldColumnsToBeNewlyAdded: [],
            listOfFieldColumnsToBeSkipped: [],
            listOfDisplayColumnsToBeNewlyAdded: []
}

  



