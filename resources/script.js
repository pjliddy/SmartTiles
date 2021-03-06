var scriptVersion = "5.2.0";

$(function() {
	
	$(".tile").append("<i class='spinner fa fa-refresh fa-spin'></i>");
	
	setIcons();
	
	$(".refresh, .clock").click(function() {
        refresh();
	});
    
	startTime();
	
	$(".dashboard").click(function(e) {
		animateClick($(this));
		e.stopImmediatePropagation();
		e.preventDefault();
		$(".refresh .icon").addClass("fa-spin");
		window.location = $(this).find("a").attr("href");
	});
	
	if (readOnlyMode) {return false;}
	
	$(".switch, .dimmer, .momentary, .clock, .lock, .link, .themeLight, .camera, .music i, .light, .dimmerLight").click(function() {
		animateClick($(this));
	});
	
	$(".switch, .light, .lock, .momentary, .themeLight, .camera").click(function() {
		$(this).closest(".tile").toggleClass("active");
        sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "toggle");
	});
	
	$(".dimmer, .dimmerLight").click(function() {
		$(this).toggleClass("active");
    	sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "toggle", $(this).attr("data-level"));
    });
	
    $(".dimmer, .dimmerLight").on('slidestop', function(e) {
    	var level = $(this).find("input").val()
		if ($(this).hasClass("active")) {
			animateClick($(this));
			sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "level", level);
		};
		$(this).attr("data-level", level);
    });
	
	 $(".music").on('slidestop', function(e) {
    	var level = $(this).find("input").val()
		animateClick($(this));
		sendCommand("music", $(this).attr("data-device"), "level", level);
		$(this).attr("data-level", level);
    });
    
	$(".music .play").click(function() {
		var tile = $(this).closest(".tile");
		$(this).closest(".tile").toggleClass("active");
		sendCommand("music", tile.attr("data-device"), "play");
	});
	
	$(".music .pause").click(function() {
		var tile = $(this).closest(".tile");
		$(this).closest(".tile").toggleClass("active");
		sendCommand("music", tile.attr("data-device"), "pause");
	});
	
	$(".music .muted").click(function() {
		var tile = $(this).closest(".tile");
		$(this).closest(".tile").toggleClass("muted");
		sendCommand("music", tile.attr("data-device"), "unmute");
	});
	
	$(".music .unmuted").click(function() {
		var tile = $(this).closest(".tile");
		$(this).closest(".tile").toggleClass("muted");
		sendCommand("music", tile.attr("data-device"), "mute");
	});
	
	$(".music .back").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "previousTrack");
	});
	
	$(".music .forward").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "nextTrack");
	});
	
	$(".mode, .hello-home, .thermostat").click(function() {
		$("#" + $(this).attr("data-popup")).popup("open");
    });
    
    $("#mode-popup li").click(function() {
    	$("#mode-popup").popup("close");
		var tile = $(".mode");
    	animateClick(tile);
        var newMode = $(this).text();
		sendCommand("mode", "mode", newMode);
        
		var oldMode = $(".mode").attr("data-mode");
		tile.removeClass(oldMode);
		tile.attr("data-mode", newMode);
		if (["Home", "Away", "Night"].indexOf(newMode) >= 0) {
			$("#mode-name").hide();
			tile.addClass(newMode);
		} else {
			$("#mode-name").html(newMode).show();
		}
    });
    
    $("#hello-home-popup li").on("click", function() {
    	$("#hello-home-popup").popup("close");
		animateClick($(".hello-home"));
		sendCommand("helloHome", "helloHome", $(this).text());
    });
	
	$(".thermostatHeat .up, .thermostatCool .up").click(function(){
		thermostatEvent($(this).closest(".tile"), 1);
	});
	
	$(".thermostatHeat .down, .thermostatCool .down").click(function(){
		thermostatEvent($(this).closest(".tile"), -1);
	});
});

function thermostatEvent(tile, direction) {
	if (window[tile.data("device")]) {
		clearTimeout(window[tile.data("device")]);
	}
	var setpoint = parseInt(tile.attr("data-setpoint"));
	
	if (setpoint < maxTemp && setpoint > minTemp) {
		setpoint = setpoint + direction;
		tile.find(".icon.setpoint").html(setpoint + "&deg;");
	}
	
	tile.attr("data-setpoint", setpoint);
	window[tile.data("device")] = setTimeout(function(){
		animateClick(tile);
		sendCommand(tile.attr("data-type"), tile.attr("data-device"), "setpoint", setpoint);
	}, 500);
}

var fadeOn = 100;
var fadeOff = 200;

function animateClick(element) {
	spinner(element);
	element.closest(".tile").animate({opacity: 0.3}, fadeOff, "swing").delay(fadeOn).animate({opacity: 1}, fadeOn, "swing");
}

function spinner(element) {
	element.closest(".tile").find(".spinner").fadeIn("slow").delay(2000).fadeOut("slow");
}

function setIcons() {
	$(".switch").append("<div class='icon'>" + icons.switch.on + icons.switch.off + "</div>");
	$(".dimmer").append("<div class='icon'>" + icons.dimmer.on + icons.dimmer.off + "</div>");
	$(".light").append("<div class='icon'>" + icons.light.on + icons.light.off + "</div>");
	$(".dimmerLight").append("<div class='icon'>" + icons.light.on + icons.light.off + "</div>");
	$(".themeLight").append("<div class='icon'>" + icons.themeLight.on + icons.themeLight.off + "</div>");
	$(".lock").append("<div class='icon'>" + icons.lock.locked + icons.lock.unlocked + "</div>");
	$(".motion").append("<div class='icon'>" + icons.motion.active + icons.motion.inactive + "</div>");
	$(".acceleration").append("<div class='icon'>" + icons.acceleration.active + icons.acceleration.inactive + "</div>");
	$(".presence").append("<div class='icon'>" + icons.presence.present + icons.presence.notPresent + "</div>");
	$(".contact").append("<div class='icon'>" + icons.contact.open + icons.contact.closed + "</div>");
	$(".water").append("<div class='icon'>" + icons.water.dry + icons.water.wet + "</div>");

	$(".dimmer, .dimmerLight, .music").each(function(){renderSlider($(this))});
	
	$(".momentary").append("<div class='icon'>" + icons.momentary + "</div>");
	$(".camera").append("<div class='icon'>" + icons.camera + "</div>");
	$(".refresh").append("<div class='icon'>" + icons.refresh + "</div>");
	$(".hello-home").append("<div class='icon'>" + icons["hello-home"] + "</div>");
	
	$(".humidity").append("<div class='footer'>" + icons.humidity + "</div>");
	$(".luminosity").append("<div class='footer'>" + icons.luminosity + "</div>");
	$(".temperature").append("<div class='footer'>" + icons.temperature + "</div>");
	$(".energy").append("<div class='footer'>" + icons.energy + "</div>");
	$(".power").append("<div class='footer'>" + icons.power + "</div>");
	$(".battery").append("<div class='footer'>" + icons.battery + "</div>");
	
	$(".link").find("a").html(icons.link);
	$(".dashboard").find("a").html(icons.dashboard);
	
	$(".tile[data-is-value=true]").each(function(){renderValue($(this))});
}

function renderSlider(tile) {
	tile.find(".slider-container").remove();
	tile.append("<div class='slider-container'><div class='full-width-slider'><input value='" + tile.attr("data-level") + "' min='1' max='10' type='range' step='1' data-mini='true' data-popup-enabled='true' data-disabled='" + readOnlyMode + "' data-highlight='true'></div></div>").find("input").slider()
	$(".full-width-slider").click(function(e) {e.stopImmediatePropagation();});
}

function renderValue(tile) {
	tile.find(".icon").remove();
	tile.append("<div class='icon text'>" + tile.attr("data-value") + "</div>");
}

function updateWeather(tile, data) {
	tile.find(".title2").html(data.weather + ", feels like " + data.feelsLike + "&deg;")
	tile.find(".icon.text").html(data.temperature + "&deg;");
	tile.find(".icon i").attr("class", "wi " + data.icon);
	tile.find(".footer").html(data.localSunrise + ' <i class="fa fa-fw wi wi-horizon-alt"></i> ' + data.localSunset);
	tile.find(".footer.right").html(data.percentPrecip + "%<i class='fa fa-fw fa-umbrella'></i><br>" + data.humidity + "%<i class='fa fa-fw wi wi-sprinkles'></i>");
}

function updateThermostat(tile, data) {
	tile.find(".title2").html(data.temperature + "&deg;, " + data.thermostatOperatingState);
	tile.find(".icon.setpoint").html(data.setpoint + "&deg;");
	tile.find(".footer").html("&#10044; " + data.thermostatFanMode + (data.humidity ? ",<i class='fa fa-fw wi wi-sprinkles'></i>" + data.humidity  + "%" : ""));
	tile.attr("data-setpoint", data.setpoint);
}

function sendCommand(type, device, command, value) {
	//alert("&type=" + type + "&device=" + device + "&command=" + command + "&value=" + value);
	
	var access_token = getUrlParameter("access_token");
	var request = { type: type, device: device, command: command, value: value};
	if (access_token) request["access_token"] = access_token;
	
	$.get("command", request).done(function( data ) {
		//alert( "Data Loaded: " + data);
		if (data.status == "ok") {
			nextPoll(5);
		}
	}).fail(function() {
		setWTFCloud();
		nextPoll(10);
	});
}

function doPoll(func) {
	nextPoll(20);
	if (!func) spinner($(".refresh"));
	var access_token = getUrlParameter("access_token");
	var request = {ts:stateTS};
	if (access_token) request["access_token"] = access_token;
	
	$.get("ping", request).done(function( data ) {
		if (data.status == "refresh") refresh();
		clearWTFCloud();
		if (func) {
			func();
		} else {
			stateTS = data.ts;
			$(".refresh .footer").html("Updated " + data.updated);
			if (data.status == "update") {for (i in data.data) updateTile(data.data[i]);}
		}
	}).fail(function() {
		setWTFCloud();
	});
}

function updateTile(data) {
	if (data.tile == "device") {
		var tile = $("." + data.type + "[data-device=" + data.device + "]");
	
		if (data.type == "music") {
			if (data.trackDescription != tile.attr("data-track-description") || (data.mute + "") != tile.attr("data-mute")) spinner(tile);
			tile.attr("data-track-description", data.trackDescription);
			if ((data.mute + "") != tile.attr("data-mute")) tile.toggleClass("muted");
			tile.attr("data-mute", data.mute);
			tile.find(".title .track").html(tile.attr("data-track-description"));
		}
		
		if (data.type == "thermostatHeat" || data.type == "thermostatCool") {
			checkDataForUpdates(tile, data);
			updateThermostat(tile, data);
		} else if (data.type == "weather") {
			checkDataForUpdates(tile, data);
			updateWeather(tile, data);
		} else {
			if (data.value != tile.attr("data-value")) spinner(tile);
			tile.attr("data-value", data.value);
			
			if (data.isValue){
				renderValue(tile);
			} else {
				tile.removeClass("inactive active").addClass(data.active);
				tile.attr("data-active", data.active);
			}
			
			if (data.type == "dimmer" || data.type == "dimmerLight" || data.type == "music") {
				if (data.level != tile.attr("data-level")) spinner(tile);
				tile.attr("data-level", data.level);
				renderSlider(tile);
			}
		}
	} else if (data.tile == "mode") {
		var tile = $(".mode");
		if (data.mode != tile.attr("data-mode")) spinner(tile);
		tile.removeClass(tile.attr("data-mode"));
		tile.attr("data-mode", data.mode);
		if (data.isStandardMode) tile.addClass(data.mode);
		$(".mode-name").html(data.mode);
	}
}

function checkDataForUpdates(tile, newData) {
	newData.name = null;
	var oldData = tile.attr("data-data")
	if (oldData) {
		try {
			oldData = JSON.parse(oldData);
			for (k in oldData) {
				if(oldData[k] != "" + newData[k]) {
					spinner(tile);
					break;
				}
			}
		} catch (e) {
			spinner(tile);
		}
	} else {
		spinner(tile);
	}
	tile.attr("data-data", JSON.stringify(newData));
}

var polling;
var wtfCloud = false;

function setWTFCloud() {
	wtfCloud = true;
	$("#wtfcloud-popup").popup("open");
}

function clearWTFCloud() {
	wtfCloud = false;
	$("#wtfcloud-popup").popup("close");
}

function nextPoll(timeout) {
	if (polling) clearInterval(polling)
	polling = setInterval(function () {doPoll()}, timeout * 1000);
}

nextPoll(30);

function refresh(timeout) {
	if (!timeout) {
		setTimeout(function() { doRefresh() }, 100);
	} else {
		setTimeout(function() { doRefresh() }, timeout * 1000);
	}
}

function doRefresh() {
	$(".refresh .icon").addClass("fa-spin");
	doPoll(function func(){
		location.reload();
	});
}

refresh(60 * 60); // hard refresh every hour

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function getClockColor() {
	if (theme == "quartz") return "#555";
	if (theme == "onyx") return "wheat";
	return "white";
}

CoolClock.config.skins = { 
st: {
	outerBorder:      { lineWidth: 12, radius: 100, color: "yellow", alpha: 0 },
		smallIndicator:   { lineWidth: 16, startAt: 80, endAt: 85, color: getClockColor(), alpha: 1 },
		largeIndicator:   { lineWidth: 2, startAt: 80, endAt: 85, color: getClockColor(), alpha: 1 },
		hourHand:         { lineWidth: 8, startAt: 0, endAt: 60, color: getClockColor(), alpha: 1 },
		minuteHand:       { lineWidth: 6, startAt: 0, endAt: 75, color: getClockColor(), alpha: 1 },
		secondHand:       { lineWidth: 5, startAt: 80, endAt: 85, color: "red", alpha: 0 },
		secondDecoration: { lineWidth: 3, startAt: 96, radius: 4, fillColor: getClockColor(), color: "black", alpha: 1 }
},
st1: {
outerBorder: { lineWidth: 2, radius: 80, color: getClockColor(), alpha: 0 },
smallIndicator: { lineWidth: 5, startAt: 88, endAt: 94, color: "yellow", alpha: 0 },
largeIndicator: { lineWidth: 5, startAt: 90, endAt: 94, color: getClockColor(), alpha: 1 },
hourHand: { lineWidth: 8, startAt: 0, endAt: 60, color: getClockColor(), alpha: 1 },
minuteHand: { lineWidth: 8, startAt: 0, endAt: 80, color: getClockColor(), alpha: 1 },
secondHand: { lineWidth: 5, startAt: 89, endAt: 94, color: getClockColor(), alpha: 1 },
secondDecoration: { lineWidth: 3, startAt: 0, radius: 4, fillColor: "black", color: "black", alpha: 0 }
}
}

function startTime() {
    if (!document.getElementById('clock')) return;
    var today=new Date();
    var h=today.getHours();
    if (h > 12) {
    	h = h - 12;
    }
    var m=today.getMinutes();
    var s=today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h+":"+m;
    setTimeout(function(){startTime()},500);
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

var cellSize = getUrlParameter("t") || tileSize;
var cellGutter = getUrlParameter("g") || 4;
