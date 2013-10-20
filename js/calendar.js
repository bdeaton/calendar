var FitQuick = window.FitQuick || {}; FitQuick.Tiles = FitQuick.Tiles || {};
FitQuick.Tiles = {
	totalMinutes: 240,
	
	init: function(){
		console.log('totalMinutes',FitQuick.Tiles.totalMinutes);
		FitQuick.Tiles.setupData();
		FitQuick.Tiles.setupHandlers();
		FitQuick.Tiles.setupTiles('init');
	},
	
	setupData: function(){
		var tileData = FitQuick.Tiles.Data = {};
		tileData.days = {};
	},
	
	setupHandlers: function(){
		console.log('setupHandlers');
		$('body').on('click','.tile-close',function(){
			var $this = $(this);
			var $parentTile = $this.parents('.tile');
			FitQuick.Tiles.handleTileRemove($parentTile);
		});
	},
	
	setupTiles: function(type){
		var $tiles15 = $('#tiles-15');
		var $tiles30 = $('#tiles-30');
		var $tiles60 = $('#tiles-60');
		var tilesCountMinutes = FitQuick.Tiles.totalMinutes;
		var tilesCount15 = Math.floor(tilesCountMinutes / 15);
		var tilesCount30 = Math.floor(tilesCount15 / 2);
		var tilesCount60 = Math.floor(tilesCount15 / 4);
		console.log('tilesCountMinutes',tilesCountMinutes);
		console.log('tilesCount15',tilesCount15);
		console.log('tilesCount30',tilesCount30);
		console.log('tilesCount60',tilesCount60);
		FitQuick.Tiles.createTiles($tiles15, tilesCount15, 15, 'tilesCount15');
		FitQuick.Tiles.createTiles($tiles30, tilesCount30, 30, 'tilesCount30');
		FitQuick.Tiles.createTiles($tiles60, tilesCount60, 60, 'tilesCount60');
		
		if(type='init'){
			FitQuick.Tiles.setupDragAndDrop();
		}
	},
	
	setupDragAndDrop: function(){
		FitQuick.Tiles.setupDrag();
		FitQuick.Tiles.setupDrop();
	},
	
	createTiles: function($elm, count, minutes, section){
		var html = '';
		var $countLabel = $elm.find('.tile-count');
		var $tileContainer = $elm.find('div');
		console.log('$countLabel',$countLabel.length);
		var breakCount = 4;
		if(section=='tilesCount30'){
			breakCount = 2;
		}
		else if(section=='tilesCount60'){
			breakCount = 1;
		}
		for (var i=0;i<count;i++){
			//console.log("tile " + (i + 1) + "<br>");
			var tileHtml = FitQuick.Tiles.createTilesHtml(minutes);
			html += tileHtml;
			if((i+1)%breakCount==0){
				html += '<br />';
			}
		}
		$countLabel.text('(' + count + ')');
		$tileContainer.html(html);
	},
	
	createTilesHtml: function(minutes){
		var html = '<em class="tile" data-minutes="' + minutes + '"></em>';
		//html = '<em class="tile" data-minutes="' + minutes + '"><i class="tile-close"><span>x</span></i></em>';	//uncomment to see close button on load. x alignment will be a bit off though
		return html;
	},
	
	setupDrag: function(){
		console.log('setupDrag');
	    $( "#available-tiles em.tile" ).draggable({
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
				FitQuick.Tiles.updateBodyStyle('drop');
				
				$(this).find("p").html( "Dropped!" );
				var myCalendar = $('#calendar');
				var dateVal = $(this).data('date');
				console.log('dateVal',dateVal);
				var date = new Date(dateVal);
				/*
				var myEvent = {
					title: "Training",
					allDay: true,
					start: new Date(2013, date.getMonth(), date.getDate() + 1, 16, 00),
					end: new Date(2013, date.getMonth(), date.getDate() + 1, 16, 30)
				};
				myCalendar.fullCalendar('renderEvent', myEvent);
				//*/
				FitQuick.Tiles.addDayTile($(this),minutes);
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
	
	addDayTile:function($day, type){
		var $dayContent = $day.find('.fc-day-content');
		$dayContent.append('<em class="tile type-' + type + '" data-minutes="' + type + '"><i class="tile-close"><span>x</span></i></em>');
		FitQuick.Tiles.updateTileData($day,type,'add');
	},
	
	updateTileData:function($day,type,method){
		console.log('updateTileData');
		var dateVal = $day.data('date');
		var tilesData = FitQuick.Tiles.Data;
		tilesData[dateVal] = tilesData[dateVal] || {};
		console.log(type);
		console.log(typeof(type));
		if(method=='add'){
			tilesData[dateVal][type] = (tilesData[dateVal][type] + 1) || 1;
		}
		else if(method=='remove'){
			tilesData[dateVal][type] = (tilesData[dateVal][type] - 1);
		}
		console.log(FitQuick.Tiles.Data[dateVal]);
	},
	
	updateBodyStyle:function(method){
		var $body = $('body');
		if(method=='drop'){
			$body.css('cursor','');
		}
	},

	handleTileRemove:function($parentTile){
		var $this = $parentTile;
		var $day = $this.parents('.fc-day');
		var minutes = $this.data('minutes');
		FitQuick.Tiles.updateTileData($day,minutes,'remove');
		FitQuick.Tiles.updateHoursCount(minutes,'remove');
		$this.remove();
	},

	updateHoursCount:function(minutes, type){
		console.log('updateHoursCount',minutes);
		console.log('type',type);
		var originalTotalMinutes = FitQuick.Tiles.totalMinutes;
		var newTotalMinutes = originalTotalMinutes;
		if(type=='drop'){
			newTotalMinutes =  (originalTotalMinutes - minutes);
		}
		else if(type=='remove'){
			newTotalMinutes =  (originalTotalMinutes + minutes);
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


