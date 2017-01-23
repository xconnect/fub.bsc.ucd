var courses = [
	{ id:"1", moduleId:"1", moduleName: "MafI 2", credits:"5", name:"Mathematik für Informatiker 2: Lineare Algebra", place:"Takustr. 9 - Raum 21", docent:"Lorem Ipsum", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec egestas mi. Pellentesque pulvinar, turpis at lacinia volutpat, dolor elit vulputate dui, a placerat urna tellus a felis. Integer elit urna, pellentesque et consectetur sed, finibus eu eros. Vivamus sit amet aliquam dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec egestas mi. Pellentesque pulvinar, turpis at lacinia volutpat, dolor elit vulputate dui, a placerat urna tellus a felis. Integer elit urna, pellentesque et consectetur sed, finibus eu eros. Vivamus sit amet aliquam dolor. Vivamus sit amet aliquam dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec egestas mi. Pellentesque pulvinar, turpis at lacinia volutpat, dolor elit vulputate dui, a placerat urna tellus a felis. Integer elit urna, pellentesque et consectetur sed, finibus eu eros. Vivamus sit amet aliquam dolor." },
	{ id:"2", moduleId:"1", moduleName: "MafI 2", credits:"10", name:"Lineare Algebra", place:"Takustr. 9 - Raum 28", docent:"Lorem Ipsum", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec egestas mi. Pellentesque pulvinar, turpis at lacinia volutpat, dolor elit vulputate dui, a placerat urna tellus a felis. Integer elit urna, pellentesque et consectetur sed, finibus eu eros. Vivamus sit amet aliquam dolor." },
	{ id:"3", moduleId:"1", moduleName: "MafI 2", credits:"5", name:"Lineare Algebra für Lehramt", place:"Takustr. 9 - Raum 55", docent:"Lorem Ipsum", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec egestas mi. Pellentesque pulvinar, turpis at lacinia volutpat, dolor elit vulputate dui, a placerat urna tellus a felis. Integer elit urna, pellentesque et consectetur sed, finibus eu eros. Vivamus sit amet aliquam dolor." }
]

function invalidAction() {
	alert('Unmöglicher Klick auf diesem Prototyp');
}

function Search() {
	var $search = $("#search");
	var $suggestions = $("#search-suggestions");
	var $suggestionsList = $("#search-suggestions ul");

	function displayMatches(query) {
		var matches;

		if (query.length == 0) {
			close();
			return;
		}

		matches = courses.filter(function(x) {
			return x.name.indexOf(query) != -1 || x.moduleName.indexOf(query) != -1; 
		});

		$suggestionsList.empty();
		
		if (matches.length > 0) {
			$(matches).each(function(i, e) {
				$suggestionsList.append(
					'<li class="suggestion-item" data-module-id="'+e.moduleId+'" data-course-id="'+e.id+'">' +
					e.name +
					"</li>"
				);
			});
		} else {
			$suggestionsList.append("<li>Kein Ergebnis wurde gefunden</li>");
		}

		$(".suggestion-item").click(function() {
			$this = $(this);
			URSULA.coursesPopup.open(this);
			URSULA.coursesPopup.select(this);
			close();
		});

		$suggestions.show();
	}

	function close() {
		$suggestions.hide();
		$suggestionsList.empty();
	}


	//


	$suggestions.css("left", $search.position().left);
	$suggestions.css("top", $search.position().top + $search.outerHeight());

	$search.keyup(function(e) {
		var query = $search.val();
		displayMatches(query);
	});

	$search.focus(function() {
		var query = $search.val();
		displayMatches(query);
	});

	$search.focusout(function() {
		setTimeout(close, 100);
	});
};


function CoursesPopup() {

	var selectedCourse;
	var $selectedModule;
	var $popup = $("#courses-popup");

	function confirm() {
		if (selectedCourse == undefined) {
			alert("Bitte wählen Sie eine Lehrveranstaltung")
			return;
		}

		$selectedModule.removeClass("todo");
		$selectedModule.addClass("doing");
		$selectedModule.unbind("click");
		close();
	}

	function diselectAll() {
		$("#courses-popup #courses-list .course-option").removeClass("selected");
	}

	function close() {
		diselectAll();
		selectedCourse = undefined;
		$selectedModule = undefined;
		$popup.hide();
		$(".course-description").hide();
	}

	this.select = function(caller) {
		var $this = $(caller);
		var courseId = $this.attr("data-course-id");

		selectedCourse = $.grep(courses, function(x) { return x.id == courseId; })[0];
		
		diselectAll();
		$(".course-option[data-course-id="+courseId+"]").addClass("selected");

		//
		$("#docent").html(selectedCourse.docent);
		$("#place").html(selectedCourse.place);
		$("#credits").html(selectedCourse.credits);
		$("#description").html(selectedCourse.description);
		//
		
		$(".course-description").show();
	}

	this.open = function(caller) {
		var moduleId = $(caller).attr("data-module-id");
		$selectedModule = $(".todo[data-module-id="+moduleId+"]");

		if (moduleId == undefined) {
			invalidAction();
			close();
		} else {
			$(document).scrollTop(0);
			$popup.show();
		}
	}

	//

	$("#courses-popup #close").click(close);
	$("#courses-popup #confirm").click(confirm);
	
	$(".todo").click(function() {
		URSULA.coursesPopup.open(this);
	});
	
	$("#courses-popup #courses-list .course-option").click(function() {
		URSULA.coursesPopup.select(this);
	});

}
