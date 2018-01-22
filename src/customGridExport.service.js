

var custom = angular.module('uiGridCustomExport');

custom.service('customGridExport', customGridExport);

customGridExport.$inject = ['coreExportService'];

function customGridExport(coreExportService) {


     /**
         * Default Options for generating CSV
         *
         */
var gridDataDefault={
    visibleRowsOnly:false,
    fileName:"download",
    header:[],
    columnOrder:[],
    fieldColumnNames:[],
    displayColumnNames:[],
    listOfFieldColumnsToBeNewlyAdded:[],
    listOfFieldColumnsToBeSkipped:[],
    listOfDisplayColumnsToBeNewlyAdded:[]
}

     /**
         * Helper function to check if input is float
         * @param input
         * @returns {boolean}
         */
this.exportGridDataWithAdditionalColumns=function(gridApi,options){

    var rawData=[],exportData=[],exportOptions={};

    var optionsGridDataDefault=_.clone(options);

    optionsGridDataDefault=_.defaults(optionsGridDataDefault,gridDataDefault);

    optionsGridDataDefault.header=optionsGridDataDefault.columnOrder=optionsGridDataDefault.displayColumnNames=coreExportService.getDisplayColumnsFromGrid(gridApi,optionsGridDataDefault);

    optionsGridDataDefault.fieldColumnNames=coreExportService.getFieldColumnsFromGrid(gridApi,optionsGridDataDefault);

    rawData=coreExportService.getGridData(gridApi);

    exportData=coreExportService.getExportReadyGridData(rawData,gridApi,optionsGridDataDefault);

    exportOptions=coreExportService.getBuildCsvOptions(optionsGridDataDefault);

    coreExportService.fileExport(exportData,optionsGridDataDefault);

};


this.exportGridDataDefault=function(gridApi,options=gridDataDefault){

   var optionsGridDataDefault=_.clone(options);

   optionsGridDataDefault=_.defaults(optionsGridDataDefault,gridDataDefault);

   optionsGridDataDefault.header=optionsGridDataDefault.columnOrder=optionsGridDataDefault.displayColumnNames=coreExportService.getDisplayColumnsFromGrid(gridApi,optionsGridDataDefault);

   optionsGridDataDefault.fieldColumnNames=coreExportService.getFieldColumnsFromGrid(gridApi,optionsGridDataDefault);

   var exportData=coreExportService.getGridData(gridApi);

   exportData=coreExportService.getExportReadyGridData(exportData,gridApi,optionsGridDataDefault);

   var exportCSVOptions=coreExportService.getBuildCsvOptions(optionsGridDataDefault);

   coreExportService.fileExport(exportData,exportCSVOptions);
};


this.exportSubGridData=function(gridApi,options){


    var optionsGridDataDefault=_.clone(options);

    optionsGridDataDefault=_.defaults(optionsGridDataDefault,gridDataDefault);

    var rawData=[],exportData=[],exportOptions={};

    optionsGridDataDefault.header=optionsGridDataDefault.columnOrder=optionsGridDataDefault.displayColumnNames=coreExportService.getDisplayColumnsFromGrid(gridApi,optionsGridDataDefault);

    optionsGridDataDefault.fieldColumnNames=coreExportService.getFieldColumnsFromGrid(gridApi,optionsGridDataDefault);

            gridApi.grid.rows[0].entity.subGridOptions.columnDefs
                .filter(function(i) {
                    return i.cellTemplate === undefined;
                })
                .forEach(function(item) {
                    optionsGridDataDefault.displayColumnNames.push(item.displayName);
                    optionsGridDataDefault.fieldColumnNames.push(item.field);

                });

    rawData=coreExportService.getSubGridData(gridApi);

    exportData=coreExportService.getExportReadyGridData(rawData,gridApi,optionsGridDataDefault);

    exportOptions=coreExportService.getBuildCsvOptions(optionsGridDataDefault);

    coreExportService.fileExport(exportData,exportOptions);

};


this.exportGridCustomData=function(rawData,options){

  var optionsGridDataDefault=_.clone(options);
   var exportData=[];

  optionsGridDataDefault=_.defaults(optionsGridDataDefault,gridDataDefault);

  exportData=coreExportService.switchColumnNamesInData(rawData,optionsGridDataDefault);

  var exportCSVOptions=coreExportService.getBuildCsvOptions(optionsGridDataDefault);

  coreExportService.fileExport(exportData,exportCSVOptions);

}



}