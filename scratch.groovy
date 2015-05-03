<div class="$data.type tile h2" data-type="$data.type" data-device="$data.device" data-setpoint="$data.setpoint">
	<div class="title">$data.name ${getTileIcons()[data.type]}<br>
		<span class="title2">&#10044; $data.thermostatFanMode, $data.thermostatOperatingState</span>
	</div>
	<div class="icon setpoint">
		$data.setpoint&deg;
	</div>
	<div class="icon up">
		<i class="fa fa-fw fa-chevron-up"></i>
	</div>
	<div class="icon down">
		<i class="fa fa-fw fa-chevron-down"></i>
	</div>
	<div class="footer">
		<i class='fa fa-fw wi wi-thermometer'></i> ${data.temperature}&deg;
	</div>
	<div class="footer right">
		<i class='fa fa-fw wi wi-sprinkles'></i> $data.humidity%
	</div>
</div>


t.find(".title2").html(e.temperature + "&deg;, " + e.thermostatOperatingState), 
t.find(".icon.setpoint").html(e.setpoint + "&deg;"), 
t.find(".footer").html("&#10044; " + e.thermostatFanMode + (e.humidity ? ",<i class='fa fa-fw wi wi-sprinkles'></i>" + e.humidity + "%" : "")), 
t.attr("data-setpoint", e.setpoint)

t.find(".title2").html(e.temperature + "&deg;, " + e.thermostatOperatingState), 
t.find(".icon.setpoint").html(e.setpoint + "&deg;"), 
t.find(".footer").html("&#10044; " + e.thermostatFanMode + (e.humidity ? ",<i class='fa fa-fw wi wi-sprinkles'></i>" + e.humidity + "%" : "")), t.attr("data-setpoint", e.setpoint)



t.find(".title2").html("&#10044; " + e.thermostatFanMode +", " + e.thermostatOperatingState), t.find(".icon.setpoint").html(e.setpoint + "&deg;"), t.find(".footer").html("<i class='fa fa-fw wi wi-temperature'></i>" + e.temperature + "&deg; <i class='fa fa-fw wi wi-sprinkles'></i>" + e.humidity + "%"), t.attr("data-setpoint", e.setpoint)



<div class="weather tile w2" data-type="weather" data-device="$data.device" data-weather="$data.weatherIcon">
	<div class="title">$data.city<br/>
		<span class="title2">
			$data.weather, feels like $data.feelsLike&deg;
		</span>
	</div>
	<div class="icon">
		<span class="text">
			$data.temperature&deg;</span><i class="wi $data.icon"></i>
		</span>
	</div>
	<div class="footer">
		$data.localSunrise <i class="fa fa-fw wi wi-horizon-alt"></i> $data.localSunset
	</div>
	<div class="footer right">
		$data.percentPrecip%<i class="fa fa-fw fa-umbrella"></i><br>$data.humidity%<i class="fa fa-fw wi wi-sprinkles"></i>
	</div>
</div>

<div id="$data.name" class="$data.type tile $data.active" data-active="$data.active" data-type="$data.type" data-device="$data.device" data-value="$data.value" data-level="$data.level" data-is-value="$data.isValue"><div class="title">$data.name</div></div>
<div class="$data.type tile $data.active" data-active="$data.active" data-type="$data.type" data-device="$data.device" data-value="$data.value" data-level="$data.level" data-is-value="$data.isValue" id="$data.name">
	<div class="title">
		$data.name
	</div>
</div>

