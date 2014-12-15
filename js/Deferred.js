/*
Title: Deferred Plugin
Author: Sundarasan Natarajan
Version: 0.0.1
Date: 11 Dec 2014
*/
( function( root ) {

	// Deferred definition
	var Deferred	= 	function() {

							// Private members - Starts
							var options				= 	arguments[ 0 ] || {};
							var stateString 		= 	'pending';

							var successCallBacks 	= 	[];
							var failureCallBacks 	= 	[];
							var progressCallBacks 	= 	[];
							var resolveArguments 	= 	[];
							var rejectArguments 	= 	[];
							var progressArguments 	= 	[];
							var isProgressNotified 	= 	false;

							var resolve				= 	function() {
															var self = this;
															if( stateString == 'pending' ) {
																resolveArguments = arguments;
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: successCallBacks, argument: resolveArguments, sameArgument: true, } ) );
																stateString = 'resolved';
															}
															return self;
														};

							var reject 				=  	function() {
															var self = this;
															if( stateString == 'pending' ) {
																rejectArguments = arguments;
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: failureCallBacks, argument: rejectArguments, sameArgument: true, } ) );
																stateString = 'rejected';
															}
															return self;
														};

							var notify 				= 	function() {
															var self = this;
															if( stateString == 'pending' ) {
																progressArguments = arguments;
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: progressCallBacks, argument: progressArguments, sameArgument: true, } ) );
																isProgressNotified = true;
															}
															return self;
														};

							var done 				= 	function() {
															var self = this;
															for( var index in arguments ) {
																if( typeof( arguments[ index ] ) == 'function' ) {
																	successCallBacks.push( arguments[ index ] );
																}
															}
															if( stateString == 'resolved' ) {
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: arguments, argument: resolveArguments, sameArgument: true, } ) );
															}
															return self;
														};

							var fail 				= 	function() {
															var self = this;
															for( var index in arguments ) {
																if( typeof( arguments[ index ] ) == 'function' ) {
																	failureCallBacks.push( arguments[ index ] );
																}
															}
															if( stateString == 'rejected' ) {
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: arguments, argument: rejectArguments, sameArgument: true, } ) );
															}
															return self;
														};

							var progress 			= 	function() {
															var self = this;
															for( var index in arguments ) {
																if( typeof( arguments[ index ] ) == 'function' ) {
																	progressCallBacks.push( arguments[ index ] );
																}
															}
															if( stateString == 'pending' && isProgressNotified ) {
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: arguments, argument: progressArguments, sameArgument: true, } ) );
															}
															return self;
														};

							var always 				= 	function() {
															var self = this;
															var alwaysCallBackArg = arguments[ 0 ];
															if( typeof( alwaysCallBackArg ) == 'function' ) {
																successCallBacks.push( alwaysCallBackArg );
																failureCallBacks.push( alwaysCallBackArg );
															}
															if( stateString != 'pending' ) {
																callFunction.call( self, getFunctionAndArguemtObjectArray( { functionDefinition: [ alwaysCallBackArg ], argument: resolveArguments || rejectArguments, sameArgument: true, } ) );
															}
															return self;
														};

							var then 				= 	function() {
															var self = this;
															var argumentsTemp = [];
															for( var index in arguments ) {
																if( Array.isArray( arguments[ index ] ) ) {
																	argumentsTemp.push( arguments[ index ] );
																} else {
																	argumentsTemp.push( [ arguments[ index ] ] );
																}
															}
															done.apply( self, argumentsTemp[ 0 ] );
															fail.apply( self, argumentsTemp[ 1 ] );
															progress.apply( self, argumentsTemp[ 2 ] );
															return self;
														};

							var promise 			= 	function() {
															var self = this;
															var methodsToRemove = [ 'resolve', 'reject', 'promise', 'notify' ];
															var promiseObject = {};
															for( var key in self ) {
																if( methodsToRemove.indexOf( key ) == -1 ) {
																	promiseObject[ key ] = self[ key ];
																}
															}
															return promiseObject;
														};

							var state 				= 	function() {
															var self = this;
															if( arguments.length > 0 )
																stateString = arguments[ 0 ];
															return stateString;
														};

							var callFunction 		= 	function( functionAndArgumentObjectArray ) {
															var self = this;
															for( var index in functionAndArgumentObjectArray ) {
																var functionAndArgumentObject = functionAndArgumentObjectArray[ index ];
																if( functionAndArgumentObject.definition && typeof( functionAndArgumentObject.definition ) == 'function' ) {
																	functionAndArgumentObject.definition.apply( self, functionAndArgumentObject.arguments );
																}
															}
															return true;
														};

							var getFunctionAndArguemtObjectArray = function( options ) {
															var self = this;

															options = options || {};
															var functionDefinition = options.functionDefinition || [];
															var argument = options.argument || [];
															var sameArgument = options.sameArgument;

															var functionAndArgumentObjectArray = [];
															if( sameArgument ) {
																for( var index in functionDefinition ) {
																	functionAndArgumentObjectArray.push( { definition: functionDefinition[ index ], arguments: argument } );
																}
															} else {
																for( var index in functionDefinition ) {
																	functionAndArgumentObjectArray.push( { definition: functionDefinition[ index ], arguments: argument[ index ] } );
																}
															}
															return functionAndArgumentObjectArray;
														};
							// Private members - Ends

							// Public members - Starts
							this.resolve 			= 	function() {
															var self = this;
															return resolve.apply( self, arguments );
														};

							this.reject 			= 	function() {
															var self = this;
															return reject.apply( self, arguments );
														};

							this.notify 			= 	function() {
															var self = this;
															return notify.apply( self, arguments );
														};

							this.done 				= 	function() {
															var self = this;
															return done.apply( self, arguments );
														};

							this.fail 				= 	function() {
															var self = this;
															return fail.apply( self, arguments );
														};

							this.progress 			= 	function() {
															var self = this;
															return progress.apply( self, arguments );
														};

							this.always 			= 	function() {
															var self = this;
															return always.apply( self, arguments );
														};

							this.then 				= 	function() {
															var self = this;
															return then.apply( self, arguments );
														};

							this.promise 			= 	function() {
															var self = this;
															return promise.apply( self, arguments );
														};

							this.state 				= 	function() {
															var self = this;
															return state.apply( self );
														};
							// Public members - Ends

						};

	// Deferred Helper Functions - Stars
	var whenClass	= 	function( deferredArray ) {
							var deferred 			= 	new Deferred();
							var deferredCount 		= 	0;
							var resolvedDeferredCount= 	0;
							var rejectedDeferredCount= 	0;
							var getOverallCount 	= 	function() { return resolvedDeferredCount + rejectedDeferredCount; };
							var checkForEnd 		= 	function() {
															if( getOverallCount() == deferredCount ) {
																if( rejectedDeferredCount == 0 ) {
																	deferred.resolve();
																} else {
																	deferred.reject();
																}
															}
														};
							var doneCallBack 		= 	function() { resolvedDeferredCount++; checkForEnd(); };
							var failCallBack 		= 	function() { rejectedDeferredCount++; deferred.reject(); /* checkForEnd(); */ };
							for( var index in deferredArray ) {
								if( typeof( deferredArray[ index ] ) == 'object' && deferredArray[ index ].then ) {
									deferredCount++;
									deferredArray[ index ].then( doneCallBack, failCallBack );
								}
							}
							if( deferredCount == 0 ) {
								deferred.resolve();
							}
							return deferred.promise();
						};
	var when 		= 	function() { return new whenClass( arguments ); };

	var version 	= 	'0.0.1';

	var addScopeTo 	= 	function( scopeKey ) { if( !root[ scopeKey ] ) { root[ scopeKey ] = deferredObject; } };

	var deferredObject = 	{ Deferred: Deferred, when: when, addScopeTo: addScopeTo, version: version, };
	// Deferred Helper Functions - Ends

	// Util - Stars
	if( typeof( Array.isArray ) !== 'function' ) {
	    Array.isArray = function( arr ) {
	        return Object.prototype.toString.call( arr ) === '[object Array]';
	    };
	}
	// Util - Ends

	// Attaching methods to root - Starts
	var keyValues				= 	[ 'dfrd', 'Deferred' ];
	for( var index in keyValues ) {
		var keyValue = keyValues[ index ];
		if( !root[ keyValue ] ) {
			var keyValue 				= 	keyValues[ index ];
			root[ keyValue ] 			= 	deferredObject;
		} else {
			console.error( 'Deferred object methods cannot be add to "' + keyValue + '", since it already has some value.' );
		}
	};
	// Attaching methods to root - Ends

} )( window );