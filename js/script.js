$(document).ready(function(){
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#navbar").collapse('hide');
			$(".btn3d").removeClass("btn-lg");
			$(".btn3d").addClass("btn-sm");
		}
	});

	$(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    
    $('#back-to-top').tooltip('show');
});

(function (global){
    var kanban = {};

    var homeHtml = "snippets/home-snippet.html";
    //Convinience function for inserting innerHtml for 'select'
    var insertHtml = function(selector, html){
        var targetElem = document.querySelector(selector);
        targetElem.innerHtml = html;
    };

    //Show loading icon inside element identified by 'selector'
    var showLoading = function(selector){
        var html = "<div class='text-center'>";
        html = "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    //On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function(event){
        //On first load
        showLoading(".main-content");
        $ajaxUtils.sendGetRequest(homeHtml, function(responseText){
            document.querySelector(".main-content").innerHTML = responseText;
        }, false);
    });

    global.$kanban = kanban;

})(window);

var placeToInsert = document.getElementById("dataRewriting");
var rewriteIt = document.getElementById("dataToSave");
var valuesArray = [];
var data = sessionStorage.getItem('key')
if (data !== null){
    placeToInsert.removeChild(rewriteIt);
    placeToInsert.innerHTML = data;
}

checkIfMoveButtonClicked();

function savingChanges(){
    var values = {};
    values.name = document.getElementById("taskName").value;
    values.description = document.getElementById("taskDescription").value;
    if (document.getElementById('low').checked) {
        values.priority = document.getElementById('low').value;
    } else if (document.getElementById('normal').checked){
        values.priority = document.getElementById('normal').value;
    } else if (document.getElementById('high').checked){
        values.priority = document.getElementById('high').value;
    }
    values.date = new Date();
    valuesArray.push(values);
    return valuesArray;
}

var idCounter = 0;

function addNewTask(){
    var idButton = "idButton" + idCounter.toString();
    var idTask = idButton + "Task";
    var valuesArray = savingChanges();
    var value = valuesArray[idCounter];
    if (value.priority === 'low'){
        document.getElementById("doIt").innerHTML += '<div class="panel panel-info" id="' + idTask +'" data-time="' + value.date.getTime() + '" data-priority=0><div class="panel-heading"><h2 class="panel-title">' + value.name + '</h2></div><div class="panel-body"><span class="description">' + value.description + '</span><br><br><span class="the-date">' + value.date + '</span></div><div class="panel-footer text-center"><button class="btn btn-success pull-left btnMoveToInProgress" id="' + idButton +'">Start</button><div class="btn-group" role="group" aria-label="taskSettingsGroup"><button data-toggle="modal" data-target="#myThirdModal" class="btn btn-default glyphicon glyphicon-edit changeDescriptionBtn" id="' + idButton +'"></button><button data-toggle="modal" data-target="#mySecondModal" class="btn btn-default glyphicon glyphicon-align-right changePriorityBtn" id="' + idButton +'"></button></div><button class="btn btn-danger pull-right btnMoveFromDoItToAborted" id="' + idButton +'">Abort</button></div></div>';
        idCounter += 1; 
    } else if (value.priority === 'normal'){
        document.getElementById("doIt").innerHTML += '<div class="panel panel-warning" id="' + idTask +'"data-time="' + value.date.getTime() + '" data-priority=1><div class="panel-heading"><h2 class="panel-title">' + value.name + '</h2></div><div class="panel-body"><span class="description">' + value.description + '</span><br><br><span class="the-date">' + value.date + '</span></div><div class="panel-footer text-center"><button class="btn btn-success pull-left btnMoveToInProgress" id="' + idButton +'">Start</button><div class="btn-group" role="group" aria-label="taskSettingsGroup"><button data-toggle="modal" data-target="#myThirdModal" class="btn btn-default glyphicon glyphicon-edit changeDescriptionBtn" id="' + idButton +'"></button><button data-toggle="modal" data-target="#mySecondModal" class="btn btn-default glyphicon glyphicon-align-right changePriorityBtn" id="' + idButton +'"></button></div><button class="btn btn-danger pull-right btnMoveFromDoItToAborted" id="' + idButton +'">Abort</button></div></div>';
        idCounter += 1;
    } else if (value.priority === 'high'){
        document.getElementById("doIt").innerHTML += '<div class="panel panel-danger" id="' + idTask +'"data-time="' + value.date.getTime() + '" data-priority=2><div class="panel-heading"><h2 class="panel-title">' + value.name + '</h2></div><div class="panel-body"><span class="description">' + value.description + '</span><br><br><span class="the-date">' + value.date + '</span></div><div class="panel-footer text-center"><button class="btn btn-success pull-left btnMoveToInProgress" id="' + idButton +'">Start</button><div class="btn-group" role="group" aria-label="taskSettingsGroup"><button data-toggle="modal" data-target="#myThirdModal" class="btn btn-default glyphicon glyphicon-edit changeDescriptionBtn" id="' + idButton +'"></button><button data-toggle="modal" data-target="#mySecondModal" class="btn btn-default glyphicon glyphicon-align-right changePriorityBtn" id="' + idButton +'"></button></div><button class="btn btn-danger pull-right btnMoveFromDoItToAborted" id="' + idButton +'">Abort</button></div></div>';
        idCounter += 1;
    }
    sortDoItFieldByPriority();
    sortDoItFieldByTime();

    checkIfMoveButtonClicked();
}

function sortDoItFieldByTime(){
    var $wrapper = $('#doIt');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.time - +b.dataset.time;
    })
    .appendTo($wrapper);
}

function sortInProgressFieldByTime(){
    var $wrapper = $('#inProgress');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.time - +b.dataset.time;
    })
    .appendTo($wrapper);
}

function sortDoneFieldByTime(){
    var $wrapper = $('#done');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.time - +b.dataset.time;
    })
    .appendTo($wrapper);
}

function sortAbortedFieldByTime(){
    var $wrapper = $('#aborted');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.time - +b.dataset.time;
    })
    .appendTo($wrapper);
}

function sortDoItFieldByPriority(){
    var $wrapper = $('#doIt');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.priority - +b.dataset.priority;
    })
    .appendTo($wrapper);
}

function sortInProgressFieldByPriority(){
    var $wrapper = $('#inProgress');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.priority - +b.dataset.priority;
    })
    .appendTo($wrapper);
}

function sortDoneFieldByPriority(){
    var $wrapper = $('#done');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.priority - +b.dataset.priority;
    })
    .appendTo($wrapper);
}

function sortAbortedFieldByPriority(){
    var $wrapper = $('#aborted');
    $wrapper.find('.panel').sort(function (a, b) {
        return +a.dataset.priority - +b.dataset.priority;
    })
    .appendTo($wrapper);
}

function moveToInProgress(idButton){
    var column = document.getElementById("doIt");
    var idTask = idButton + "Task"
    var task = document.getElementById(idTask);
    column.removeChild(task);
    task.children[2].firstChild.classList.remove('btnMoveToInProgress');
    task.children[2].firstChild.classList.add('btnMoveToDone');
    task.children[2].lastChild.classList.remove('btnMoveFromDoItToAborted');
    task.children[2].lastChild.classList.add('btnMoveFromInProgressToAborted');
    task.children[2].firstChild.innerHTML = "Finish";
    var descriptionChangeButton = task.children[2].children[1].firstChild;
    task.children[2].children[1].removeChild(descriptionChangeButton);
    document.getElementById("inProgress").appendChild(task);

    sortInProgressFieldByPriority();
    sortInProgressFieldByTime();

    checkIfMoveButtonClicked();
}

function moveFromDoItToAborted(idButton){
    var column = document.getElementById("doIt");
    var idTask = idButton + "Task"
    var task = document.getElementById(idTask);
    column.removeChild(task);
    footer = task.children[2];
    task.removeChild(footer);
    document.getElementById("aborted").appendChild(task);
    task.classList.remove('panel-info');
    task.classList.remove('panel-warning');
    task.classList.remove('panel-danger');
    task.classList.add('panel-default');
    task.children[0].innerHTML += '<button type="button" class="close close-panel" data-target="#' + idTask +'" data-dismiss="alert" onclick="alert("detected")"> <span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>';

    sortAbortedFieldByPriority();
    sortAbortedFieldByTime();

    checkIfMoveButtonClicked();
}

function moveToDone(idButton){
    var column = document.getElementById("inProgress");
    var idTask = idButton + "Task"
    var task = document.getElementById(idTask);
    column.removeChild(task);
    footer = task.children[2];
    task.removeChild(footer);
    document.getElementById("done").appendChild(task);
    task.classList.remove('panel-info');
    task.classList.remove('panel-warning');
    task.classList.remove('panel-danger');
    task.classList.add('panel-success');
    task.children[0].innerHTML += '<button type="button" class="close close-panel" data-target="#' + idTask +'" data-dismiss="alert"> <span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>';

    sortDoneFieldByPriority();
    sortDoneFieldByTime();

    checkIfMoveButtonClicked();
}

function moveFromInProgressToAborted(idButton){
    var column = document.getElementById("inProgress");
    var idTask = idButton + "Task"
    var task = document.getElementById(idTask);
    column.removeChild(task);
    footer = task.children[2];
    task.removeChild(footer);
    document.getElementById("aborted").appendChild(task);
    task.classList.remove('panel-info');
    task.classList.remove('panel-warning');
    task.classList.remove('panel-danger');
    task.classList.add('panel-default');
    task.children[0].innerHTML += '<button type="button" class="close close-panel" data-target="#' + idTask +'" data-dismiss="alert"> <span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>';

    sortAbortedFieldByPriority()
    sortAbortedFieldByTime();

    checkIfMoveButtonClicked();
}

checkIfMoveButtonClicked();

function saveData(){
    data = document.getElementById("dataRewriting").innerHTML;
    sessionStorage.setItem('key', data);
}

var idPriorityChangingTask;
var priorityChangingTask;

function changePriority(idButton){
    if (idButton !== undefined){
        idPriorityChangingTask = idButton + "Task";
        priorityChangingTask = document.getElementById(idPriorityChangingTask);
    }

    if (document.getElementById('lowPriority').checked) {
        priorityChangingTask.classList.remove('panel-info');
        priorityChangingTask.classList.remove('panel-warning');
        priorityChangingTask.classList.remove('panel-danger');
        priorityChangingTask.classList.add('panel-info');
        priorityChangingTask.setAttribute("data-priority", 0);
    } else if (document.getElementById('normalPriority').checked){
        priorityChangingTask.classList.remove('panel-info');
        priorityChangingTask.classList.remove('panel-warning');
        priorityChangingTask.classList.remove('panel-danger');
        priorityChangingTask.classList.add('panel-warning');
        priorityChangingTask.setAttribute("data-priority", 1);
    } else if (document.getElementById('highPriority').checked){
        priorityChangingTask.classList.remove('panel-info');
        priorityChangingTask.classList.remove('panel-warning');
        priorityChangingTask.classList.remove('panel-danger');
        priorityChangingTask.classList.add('panel-danger');
        priorityChangingTask.setAttribute("data-priority", 2);
    }

    checkIfMoveButtonClicked();
}

var idDescritionChangingTask;
var descriptionChangingTask;

function changeDescription(idButton){
    if (idButton !== undefined){
        idDescriptionChangingTask = idButton + "Task";
        descriptionChangingTask = document.getElementById(idDescriptionChangingTask);
    }
    if (document.getElementById("newTaskDescription").value.length > 0){
        descriptionChangingTask.children[1].firstChild.innerHTML = document.getElementById("newTaskDescription").value;
    }

    checkIfMoveButtonClicked();
}

function checkIfMoveButtonClicked(){
    var doItMoveButtons = document.getElementsByClassName("btnMoveToInProgress");
    var doItAbortButtons = document.getElementsByClassName("btnMoveFromDoItToAborted");
    for (var i = 0; i < doItMoveButtons.length; i += 1){
        doItMoveButtons[i].onclick = function(){
            moveToInProgress(this.id);
        }
    };
    for (var i = 0; i < doItAbortButtons.length; i += 1){
        doItAbortButtons[i].onclick = function(){
            moveFromDoItToAborted(this.id);
        }
    };

    var inProgressMoveButtons = document.getElementsByClassName("btnMoveToDone");
    var inProgressAbortButtons = document.getElementsByClassName("btnMoveFromInProgressToAborted");
    for (var i = 0; i < inProgressMoveButtons.length; i += 1){
        inProgressMoveButtons[i].onclick = function(){
            moveToDone(this.id);
        }
    };
    for (var i = 0; i < inProgressAbortButtons.length; i += 1){
        inProgressAbortButtons[i].onclick = function(){
            moveFromInProgressToAborted(this.id);
        }
    };

    var changePriorityButtons = document.getElementsByClassName("changePriorityBtn");
    for (var i = 0; i < changePriorityButtons.length; i += 1){
        changePriorityButtons[i].onclick = function(){
            var radioButtons = document.getElementsByName("priority");
            for(var i=0;i<radioButtons.length;i++)
                radioButtons[i].checked = false;
            changePriority(this.id);
        }
    };

    var changeDescriptionButtons = document.getElementsByClassName("changeDescriptionBtn");
    for (var i = 0; i < changeDescriptionButtons.length; i += 1){
        changeDescriptionButtons[i].onclick = function(){
            changeDescription(this.id);
        }
    };
};


window.onbeforeunload = function(event){
    saveData();
};