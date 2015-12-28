var FlipClock = function(selector) {
	var animationEndEvents = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

	var me = this;

	me.mainEl = $(selector);

	me.frontTopEl    = me.mainEl.find('div.flip-top.flip-front');
	me.frontBottomEl = me.mainEl.find('div.flip-bottom.flip-front');
	me.backTopEl     = me.mainEl.find('div.flip-top.flip-back');
	me.backBottomEl  = me.mainEl.find('div.flip-bottom.flip-back');

	me.frontTopEl.on(animationEndEvents, function(event) {
		me.frontTopEl.removeClass('flip-top-animate');

		me.frontTopEl.find('span').html(me.nextNumber);
		me.frontBottomEl.find('span').html(me.nextNumber);

		me.frontBottomEl.addClass('flip-bottom-animate');
	});

	me.frontBottomEl.on(animationEndEvents, function(event) {
		me.frontBottomEl.removeClass('flip-bottom-animate');

		me.backTopEl.find('span').html(me.nextNumber);
		me.backBottomEl.find('span').html(me.nextNumber);
	});

	return {
		update: function(number) {
			if (number == me.nextNumber)
				return;

			me.nextNumber = number;
			me.frontTopEl.addClass('flip-top-animate');
			me.backTopEl.find('span').html(me.nextNumber);
		}
	}
};

var FlipClockManager = function(selector, cls) {
	var me = this;
	me.mainEl = $(selector);

	FlipClockManager.idx = (FlipClockManager.idx || 0) + 1;

	var generateCounterHtml = function(id, cls) {
		return ['<div id="' + id + '" class="flip-clock ' + cls + '">',
					  '<div class="flip-top flip-front"><span>0</span></div>',
					  '<div class="flip-top flip-back"><span>0</span></div>',
					  '<div class="flip-bottom flip-front"><span>0</span></div>',
					  '<div class="flip-bottom flip-back"><span>0</span></div>',
				  '</div>'].join('');
	}

	var initializeClock = function(callback) {
		var mainHTML = '';
		mainHTML += generateCounterHtml('fc-hours' + FlipClockManager.idx, cls);
		mainHTML += generateCounterHtml('fc-minutes' + FlipClockManager.idx,cls);
		mainHTML += generateCounterHtml('fc-seconds' + FlipClockManager.idx, cls);

		me.mainEl.html(mainHTML);

		me.hours   = new FlipClock('#fc-hours'   + FlipClockManager.idx);
		me.minutes = new FlipClock('#fc-minutes' + FlipClockManager.idx);
		me.seconds = new FlipClock('#fc-seconds' + FlipClockManager.idx);

		if (me.currentInterval)
			clearInterval(me.currentInterval);

		me.currentInterval = setInterval(callback, 1000);
	}

	return {
		currentTime: function() {
			initializeClock(function() {
				var date = new Date();

				me.hours.update(date.getHours());
				me.minutes.update(date.getMinutes());
				me.seconds.update(date.getSeconds());
			});
		},
		countdownToDate: function(countdownDate) {
			initializeClock(function() {
				var dateDiff = Math.round((countdownDate.getTime() - new Date().getTime()) / 1000);

				me.hours.update(Math.round(dateDiff / 3600));
				me.minutes.update(Math.round(dateDiff / 60) % 60);
				me.seconds.update(dateDiff % 60);
			});
		},
		countFromDate: function(startDate) {
			initializeClock(function() {
				var dateDiff = Math.round((new Date().getTime() - startDate.getTime()) / 1000);

				me.hours.update(Math.round(dateDiff / 3600));
				me.minutes.update(Math.round(dateDiff / 60) % 60);
				me.seconds.update(dateDiff % 60);
			});
		}
	}
};
