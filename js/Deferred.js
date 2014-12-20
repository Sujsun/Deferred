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
																callFunction.call( self, successCallBacks, resolveArguments, { sameArgument: true, } );
																stateString = 'resolved';
															}
															return self;
														};

							var reject 				=  	function() {
															var self = this;
															if( stateString == 'pending' ) {
																rejectArguments = arguments;
																callFunction.call( self, failureCallBacks, rejectArguments, { sameArgument: true, } );
																stateString = 'rejected';
															}
															return self;
														};

							var notify 				= 	function() {
															var self = this;
															if( stateString == 'pending' ) {
																progressArguments = arguments;
																callFunction.call( self, progressCallBacks, progressArguments, { sameArgument: true, } );
																isProgressNotified = true;
															}
															return self;
														};

							var done 				= 	function() {
															var self = this;
															var argumentsArray = Array.prototype.slice.call( arguments );
															successCallBacks = successCallBacks.concat( argumentsArray );
															if( stateString == 'resolved' ) {
																callFunction.call( self, argumentsArray, resolveArguments, { sameArgument: true, } );
															}
															return self;
														};

							var fail 				= 	function() {
															var self = this;
															var argumentsArray = Array.prototype.slice.call( arguments );
															failureCallBacks = failureCallBacks.concat( argumentsArray );
															if( stateString == 'rejected' ) {
																callFunction.call( self, argumentsArray, rejectArguments, { sameArgument: true, } );
															}
															return self;
														};

							var progress 			= 	function() {
															var self = this;
															var argumentsArray = Array.prototype.slice.call( arguments );
															progressCallBacks = progressCallBacks.concat( argumentsArray );
															if( stateString == 'pending' && isProgressNotified ) {
																callFunction.call( self, argumentsArray, progressArguments, { sameArgument: true, } );
															}
															return self;
														};

							var always 				= 	function() {
															var self = this;
															var argumentsArray = Array.prototype.slice.call( arguments );
															successCallBacks = successCallBacks.concat( argumentsArray );
															failureCallBacks = failureCallBacks.concat( argumentsArray );
															if( stateString != 'pending' ) {
																callFunction.call( self, argumentsArray, resolveArguments || rejectArguments, { sameArgument: true, } );
															}
															return self;
														};

							var then 				= 	function() {
															var self = this;
															var argumentsTemp = [];
															for( var index in arguments ) {
																var itemToPush = undefined;
																if( Array.isArray( arguments[ index ] ) ) {
																	itemToPush = arguments[ index ];
																} else {
																	itemToPush = [ arguments[ index ] ];
																}
																argumentsTemp.push( itemToPush );
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

							var callFunction 		= 	function( functionDefinitionArray, functionArgumentArray, options ) {
															var self = this;
															options = options || {};
															var scope = options.scope || self;
    														var forEachDefinition;
    														if( options.sameArgument ) {
    															forEachDefinition = function( item, index ) { if( typeof( item ) == 'function' ) item.apply( scope, functionArgumentArray ); };
    														} else {
    															forEachDefinition = function( item, index ) { if( typeof( item ) == 'function' ) item.apply( scope, functionDefinitionArray[ index ] ); };
														    }
														    for( var index in functionDefinitionArray ) { forEachDefinition( functionDefinitionArray[ index ], index ); }
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
							var self 				= 	this;
							var deferred 			= 	new Deferred();
							deferredArray 			= 	deferredArray || [];
							var deferredCount 		= 	0;
							var resolveArguments 	= 	[];
							var notifyArguments		=	[];
							var isDeferredArrayLoaded= false;
							if( deferredArray.length == 0 ) {
								deferred.resolve.apply( self, resolveArguments );
							} else {
								var resolvedDeferredCount= 	0;
								deferredArray 			= 	Array.prototype.slice.call( deferredArray );	// Convert Arguments object to Array object
								var checkForEnd 		= 	function() {
																if( isDeferredArrayLoaded && resolvedDeferredCount == deferredCount )
																	deferred.resolve.apply( self, resolveArguments );
															};
								var saveArgumentsPassed =	function(thisArg, argumentsToSave, storageArray) {
																var indexOfThisInDeferredArray = deferredArray.indexOf( thisArg );
																if( indexOfThisInDeferredArray != -1 && argumentsToSave.length > 0 ) {
																	storageArray[ indexOfThisInDeferredArray ] = argumentsToSave.length == 1 ? argumentsToSave[0] : argumentsToSave;
																}
															};
								var doneCallBack 		= 	function() {
																if ( deferred.state() != 'pending' )
																	return;
																resolvedDeferredCount++;
																saveArgumentsPassed(this, arguments, resolveArguments);
																checkForEnd();
															};
								var failCallBack 		= 	function() { deferred.reject.apply( self, arguments ); };
								var progressCallBack 	=	function() { saveArgumentsPassed(this, arguments, notifyArguments); deferred.notify.apply( self, notifyArguments ); };
								for( var index in deferredArray ) {
									if( index == deferredArray.length - 1 )
										isDeferredArrayLoaded = true;
									if( deferredArray[ index ] && deferredArray[ index ].then ) {
										deferredCount++;
										deferredArray[ index ].then( doneCallBack, failCallBack, progressCallBack );
									}
								}
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