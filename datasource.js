define( [
		'angular',
		'lodash',
		'./directives',
		'./query_ctrl',
	],
	function( angular, _ ) {
		'use strict';

		var module = angular.module( 'grafana.services' );

		module.factory( 'TsvDatasource', [ '$q', '$http', 'backendSrv', 'templateSrv', function( $q, $http, backendSrv, templateSrv ) {
			function TsvDatasource( datasource ) {
			}

			// Query for metric targets within the specified time range.
			// Returns the promise of a result dictionary. See the convertResponse comment
			// for specifics of the result dictionary.
			TsvDatasource.prototype.query = function( queryOptions ) {
				var self = this;

				var from = new Date( queryOptions.range.from.valueOf() ).getTime();
				var to = new Date( queryOptions.range.to.valueOf() ).getTime();

				var target = queryOptions.targets[ 0 ];

				var reqOpts = {
					method: 'GET',
					url: target.url
				};

				return backendSrv.datasourceRequest( reqOpts ).then( function( result ) {

					//Return empty if empty...
					if( !result || !result.data ) {
						return [];
					}

					//Parse the TSV...
					var rawDatapoints = self.tsvParse( result.data );

					//If there are headings, get the index of the col we mean
					var timeCol = target.timecol;
					var valueCol = target.valuecol;

					console.log('time and value col');
					console.log(timeCol);
					console.log(valueCol);

					if( target.hasheadings ) {
						console.log("hasheadings true");
						//TODO if has headings we could only look for the index if a string is actually provided
						timeCol = rawDatapoints[ 0 ].indexOf( timeCol );
						valueCol = rawDatapoints[ 0 ].indexOf( valueCol );
						// Remove the headings
						rawDatapoints.shift();
					}

					console.log('time and value col');
					console.log(timeCol);
					console.log(valueCol);

					console.log( 'rawdatapoints' );
					console.log( rawDatapoints );

					//Refine to only the cold we need...
					//And try to fix dates!
					var datapoints = [];
					var counter = 0;
					for( var j = 0; j < rawDatapoints.length; j++ ) {
						var time = new Date( rawDatapoints[j][timeCol] ).getTime();
						var value = rawDatapoints[j][valueCol];
						//Only add them if valid :/
						if( time && value ) {
							//Only return things in the time range!
							if( time > from && time < to ) {
								datapoints[ counter ] = [ value, time ];
								counter++;
							}
						} else {
							console.log( "Error in TSV data? " + j + ', ' + time + ', ' + value );
						}
					}

					//Got to sort the order so the lines etc looks right
					datapoints.sort( function(a,b){ return a[1] - b[1] } )

					console.log( 'datapoints' );
					console.log( datapoints );

					//Return in the format expected
					return { data: [ { datapoints: datapoints, target: target.name } ] };
				} );
			};

			/**
			 * Could easily be modified for CSVs
			 * @param tsv
			 * @returns {Array}
			 */
			TsvDatasource.prototype.tsvParse = function( tsv ) {
				var lines = tsv.split( "\n" );
				var result = [];

				for( var i = 0; i < lines.length; i++ ) {
					var currentline = lines[ i ].split( "\t" );
					result.push( currentline );
				}

				return result;
			};

			return TsvDatasource;
		} ] );
	} );
