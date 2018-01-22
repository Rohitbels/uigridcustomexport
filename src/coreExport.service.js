(function() {
    var core = angular.module('uiGridCustomExport');

    core.service('coreExportService', coreExportService);

    coreExportService.$inject = ['$q', 'uiGridExporterService'];

    function coreExportService($q, uiGridExporterService) {


        var EOL = '\r\n';
        var BOM = "\ufeff";
        var defaultCSVBuildOptions = {
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

        };

        /**
         * Helper function to check if input is float
         * @param input
         * @returns {boolean}
         */
        this.isFloat = function(input) {
            return +input === input && (!isFinite(input) || Boolean(input % 1));
        };

        var that = this;
        var specialChars = {
            '\\t': '\t',
            '\\b': '\b',
            '\\v': '\v',
            '\\f': '\f',
            '\\r': '\r'
        };

        function stringifyField(data, options) {
            if (options.decimalSep === 'locale' && that.isFloat(data)) {
                return data.toLocaleString();
            }

            if (options.decimalSep !== '.' && that.isFloat(data)) {
                return data.toString().replace('.', options.decimalSep);
            }

            if (typeof data === 'string') {
                data = data.replace(/"/g, '""'); // Escape double qoutes

                if (options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
                    data = options.txtDelim + data + options.txtDelim;
                }

                return data;
            }

            if (typeof data === 'boolean') {
                return data ? 'TRUE' : 'FALSE';
            }

            return data;
        }

        //This function is from he NGCSV Directive
        this.stringify = function(data, options) {
            var def = $q.defer();

            var csv = "";
            var csvContent = "";

            var dataPromise = $q.when(data).then(function(responseData) {
                //responseData = angular.copy(responseData);//moved to row creation
                // Check if there's a provided header array
                if (angular.isDefined(options.header) && options.header) {
                    var encodingArray, headerString;

                    encodingArray = [];
                    angular.forEach(options.header, function(title, key) {
                        this.push(stringifyField(title, options));
                    }, encodingArray);

                    headerString = encodingArray.join(options.fieldSep ? options.fieldSep : ",");
                    csvContent += headerString + EOL;
                }

                var arrData = [];

                if (angular.isArray(responseData)) {
                    arrData = responseData;
                } else if (angular.isFunction(responseData)) {
                    arrData = responseData();
                }

                // Check if using keys as labels
                if (angular.isDefined(options.label) && options.label && typeof options.label === 'boolean') {
                    var labelArray, labelString;

                    labelArray = [];
                    angular.forEach(arrData[0], function(value, label) {
                        this.push(stringifyField(label, options));
                    }, labelArray);
                    labelString = labelArray.join(options.fieldSep ? options.fieldSep : ",");
                    csvContent += labelString + EOL;
                }

                angular.forEach(arrData, function(oldRow, index) {
                    var row = angular.copy(arrData[index]);
                    var dataString, infoArray;

                    infoArray = [];

                    var iterator = !!options.columnOrder ? options.columnOrder : row;
                    angular.forEach(iterator, function(field, key) {
                        var val = !!options.columnOrder ? row[field] : field;
                        this.push(stringifyField(val, options));
                    }, infoArray);

                    dataString = infoArray.join(options.fieldSep ? options.fieldSep : ",");
                    csvContent += index < arrData.length ? dataString + EOL : dataString;
                });

                // Add BOM if needed
                if (options.addByteOrderMarker) {
                    csv += BOM;
                }

                // Append the content and resolve.
                csv += csvContent;
                def.resolve(csv);
            });

            if (typeof dataPromise['catch'] === 'function') {
                dataPromise['catch'](function(err) {
                    def.reject(err);
                });
            }

            return def.promise;
        };

        //Setting CSV options
        //ColumnOrder,header and fieldSep(Delimiter)
        //Header and columnOrder required
        this.getBuildCsvOptions = function getBuildCsvOptions(obj = {}) {
            var options = _.clone(obj);
            options = _.defaults(options, defaultCSVBuildOptions);
            return options;
        };

        //Performs the download and makes sure the file is downloaded by browser
        this.fileExport = function(exportData, exportOptions) {
            that.stringify(exportData, exportOptions).then(function(csv) {
                uiGridExporterService.downloadFile(exportOptions.fileName + '.csv', csv, true, true);
            });
        };

        //Switches the data column name from the field names to Display name(names expected in the CSV)
        this.switchColumnNamesInData = function(rawData = [], options=defaultCSVBuildOptions) {
            var exportData = [];

            exportData = _.clone(rawData);
            //Change the Column names of the data to the display Name in the Grid.
            return exportData.map(function(item) {
                var nitem = {};
                for (var i = 0; i < options.fieldColumnNames.length; i++) {
                    nitem[options.displayColumnNames[i]] = item[options.fieldColumnNames[i]];
                }
                return nitem;
            });
        };

        this.getGridData = function(gridApi) {
            return gridApi.grid.rows.map(function(item) {
                return item.entity;
            });
        };

        this.getSubGridData = function(gridApi) {

            //Get all rows loaded in GRID
            var rowData = gridApi.grid.rows.map(function(item) {
                return item.entity;
            });
            var rawData = [];

            //Iterate over each row and corresponding Sub Grid
            rowData.forEach(function(item) {
                var current = {};
                var subGridData = {};

                //Separates the row column and row Subgrid
                angular.forEach(item, function(i, v) {
                    if (angular.isString(i)) {
                        current[v] = i;
                    } else {
                        subGridData = i.data;
                    }
                });

                if (angular.equals(subGridData, [])) {
                    rawData.push(current);
                }


                //maps and combines row entry with its each subrow entry
                angular.forEach(subGridData, function(subrow) {
                    var temp = {};
                    Object.assign(temp, current);
                    Object.assign(temp, subrow);
                    rawData.push(temp);
                });

            });


            return rawData;
        };

        //Switches the data column name from the field names to Display name(names expected in the CSV)
        //if visible is true
        this.getExportReadyGridData = function(rawData, gridApi, options, displayNameColumns, fieldNameColumns, visibleRowsOnly) {

            var exportData = [];
            //Only Visible Data
            if (options.visibleRowsOnly) {
                //get Visible Rows
                var vrows = gridApi.core.getVisibleRows();
                //get Mapping Id of Visible Rows for filtering data
                var vMapIdList = vrows.map(function(item) {
                    return item.entity.$$hashKey;
                });

                //filtering based on MAIN_MAP_ID Parameter of the Visible Rows.
                rawData = rawData.filter(function(item) {
                    return vMapIdList.indexOf(item.$$hashKey) !== -1;
                });
            }
            return that.switchColumnNamesInData(rawData, options);
        };

        this.getDisplayColumnsFromGrid = function(gridApi, options = defaultCSVBuildOptions) {
            var displayColumnNames, visibleColumns;
            //getting the Visible Columns from Main Grid
            //Filtering the Visible columns to only those containing data from Back End .Excluding columns like Action etc.
            visibleColumns = gridApi.grid.renderContainers.body.visibleColumnCache.filter(function(column) {
                    return column.visible;
                })
                .filter(function(col) {
                    return options.listOfFieldColumnsToBeSkipped.indexOf(col.field);

                });


            //Array of Display Names of the Columns to be shown in the Output CSV File
            displayColumnNames = visibleColumns.map(function(item) {
                return item.displayName;
            });


            displayColumnNames = displayColumnNames.concat(options.listOfDisplayColumnsToBeNewlyAdded);
            return displayColumnNames;
        };

        this.getFieldColumnsFromGrid = function(gridApi, options = defaultCSVBuildOptions) {
            var fieldColumnNames, visibleColumns;
            //getting the Visible Columns from Main Grid
            //Filtering the Visible columns to only those containing data from Back End .Excluding columns like Action etc.
            visibleColumns = gridApi.grid.renderContainers.body.visibleColumnCache.filter(function(column) {
                    return column.visible;
                })
                .filter(function(col) {
                    return options.listOfFieldColumnsToBeSkipped.indexOf(col.field);
                });

            //Field Name : the actual names received from the Database
            fieldColumnNames = visibleColumns.map(function(item) {
                return item.field;
            });

            fieldColumnNames = fieldColumnNames.concat(options.listOfFieldColumnsToBeNewlyAdded);
            return fieldColumnNames;
        };


}

})();