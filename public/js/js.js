$(document).ready(function () {
	$(".button-collapse").sideNav();
	$('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15, // Creates a dropdown of 15 years to control year,
		today: 'Today',
		clear: 'Clear',
		close: 'Ok',
		closeOnSelect: false // Close upon selecting a date,
	});
});
$(document).ready(function () {
	$('select').material_select();
});
$(document).ready(function () {
	$("a.btnsubmit").click(function () {
		$(".form").addClass("animate-out");
		setTimeout(function () {
			$(".form").css("display", "none")
		}, 400);
		$(".form2").addClass("animate-in");
		$("a.btnsubmit").text(function (i, origText) {
			return "حفظ";
		});
        $("a.btnsubmit").addClass("savebtn");
		$("a.btnsubmit").addClass("animate-in");
	});
});
$(document).ready(function () {
	var count = 2;
	$("a.addclinic").click(function () {
		if (count <= 3) {
			$(".cliniks").append(" <h2 class=\"clcs\">" + (count) + "</h2> <div id=\'details_address_" + (count) + "\'><div id='city_" + (count) + "\' class=\"input-field col s12\"> <i class=\"material-icons prefix\">location_on</i>\
									<input id=\"icon_prefix\" type=\"text\" class=\"validate\">\
									<label for=\"icon_prefix\">المدينة</label></div> <div id=\'area_" + (count) + "\' class=\"input-field col s12\"><i class=\"material-icons prefix\">location_on</i><input id=\"icon_prefix\" type=\"text\" class=\"validate\"><label for=\"icon_prefix\">منطقه  </label></div><div id=\'address_" + (count) + "' class=\"input-field col s12\"> <i class=\"material-icons prefix\">home</i><input id=\"icon_prefix\" type=\"text\" class=\"validate\"><label for=\"icon_prefix\">العنوان</label></div>   </div>");
			console.log("count is  " + count);
			count++;
		} else {
			alert("sorry you can add mixmum 3 clinics");
		}
	});
});