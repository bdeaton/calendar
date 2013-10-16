var FitQuick = window.FitQuick || {}; FitQuick.Tiles = FitQuick.Tiles || {};
FitQuick.Tiles = {
	totalMinutes: 480,
	
	init: function(){
		console.log('totalMinutes',FitQuick.Tiles.totalMinutes);
		FitQuick.Tiles.setupTiles('init');
	},
	
	setupTiles: function(type){
		var $tiles15 = $('#tiles-15');
		var $tiles30 = $('#tiles-30');
		var $tiles60 = $('#tiles-60');
		var tilesCountMinutes = FitQuick.Tiles.totalMinutes;
		var tilesCount15 = tilesCountMinutes / 15;
		var tilesCount30 = tilesCount15 / 2;
		var tilesCount60 = tilesCount15 / 4;
		console.log('tilesCountMinutes',tilesCountMinutes);
		console.log('tilesCount15',tilesCount15);
		console.log('tilesCount30',tilesCount30);
		console.log('tilesCount60',tilesCount60);
		FitQuick.Tiles.createTiles($tiles15, tilesCount15, 15);
		FitQuick.Tiles.createTiles($tiles30, tilesCount30, 30);
		FitQuick.Tiles.createTiles($tiles60, tilesCount60, 60);
		
		if(type='init'){
			FitQuick.Tiles.setupDragAndDrop();
		}
	},
	
	setupDragAndDrop: function(){
		FitQuick.Tiles.setupDrag();
		FitQuick.Tiles.setupDrop();
	},
	
	createTiles: function($elm, count, minutes){
		var html = '';
		var $countLabel = $elm.find('.tile-count');
		var $tileContainer = $elm.find('div');
		console.log('$countLabel',$countLabel.length);
		for (var i=0;i<count;i++){ 
			//console.log("tile " + (i + 1) + "<br>");
			var tileHtml = FitQuick.Tiles.createTilesHtml(minutes);
			html += tileHtml;
		}
		$countLabel.text('(' + count + ')');
		$tileContainer.html(html);
	},
	
	createTilesHtml: function(minutes){
		var html = '<em class="tile" data-minutes="' + minutes + '"></em>';
		return html;
	},
	
	setupDrag: function(){
		console.log('setupDrag');
	    $( "em.tile" ).draggable({
		helper: 'clone',
		cursor: 'move',
		tolerance: 'fit'    
	    });
	
	},
	
	setupDrop: function(){
		console.log('setupDrop');
		$( ".drop,td.fc-day" ).droppable({
			drop: function( event, ui ) {
				var minutes = ui.draggable.data('minutes');
				console.log('minutes',minutes);
				$( this )
				//          .addClass( "ui-state-highlight" )
				//.css('background-color',color)
				.find( "p" )
				.html( "Dropped!" );
				var myCalendar = $('#calendar');
				var dateVal = $(this).data('date');
				console.log('dateVal',dateVal);
				var date = new Date(dateVal);
				var myEvent = {
					title: "Training",
					allDay: true,
					start: new Date(2013, date.getMonth(), date.getDate() + 1, 16, 00),
					end: new Date(2013, date.getMonth(), date.getDate() + 1, 16, 30)
				};
				myCalendar.fullCalendar('renderEvent', myEvent);
				FitQuick.Tiles.updateHoursCount(minutes,'drop');
			},
			out: function( event, ui ) {
				$( this )
				.removeClass( "ui-state-highlight" )
				//.css('background-color','yellow')
				.find( "p" )
				.html( "UNdropped!" );
			}
		});
	},
	
	updateHoursCount:function(minutes, type){
		console.log('updateHoursCount',minutes);
		console.log('type',type);
		var originalTotalMinutes = FitQuick.Tiles.totalMinutes;
		var newTotalMinutes = originalTotalMinutes;
		if(type=='drop'){
			newTotalMinutes =  (originalTotalMinutes - minutes);
		}
		FitQuick.Tiles.totalMinutes = newTotalMinutes;
		console.log('newTotalMinutes',newTotalMinutes);
		
		FitQuick.Tiles.setupTiles('update');
	},
	
	fixMargins:function(){
	
	}
};
$(function() {
	FitQuick.Tiles.init();
});


