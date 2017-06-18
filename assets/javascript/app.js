//document ready function.
//The rest of the app will be within this function
$(document).ready(function(){
  //global variables
  var datetime = null;
  var date = null;
  var trainName;
  var trainDest;
  var firstTime;
  var trainFreq;
  var currentTime = moment();
//military time input for form

//function to set current time
var update = function () {
    date = moment(new Date())
    datetime.text(date.format('h:mm:ss A'));
};

//display current time in #current-time id within the jumbotron
datetime = $("#current-time")
  update();
  setInterval(update, 1000);

  //firebase JSON config object
  var config = {
    apiKey: "AIzaSyDagB4fbwO5j4CPatgW12QExbiZtqcV1KQ",
    authDomain: "train-schedule-eb2b7.firebaseapp.com",
    databaseURL: "https://train-schedule-eb2b7.firebaseio.com",
    projectId: "train-schedule-eb2b7",
    storageBucket: "",
    messagingSenderId: "1072137358264"
  };

 //call of firebase API
 firebase.initializeApp(config);

//variable to call firebase database
 var dataRef = firebase.database();
////adding train submit event listener
$("#submit").on("click", function() {
	trainName = $('#nameInput').val().trim();
  trainDest = $('#destInput').val().trim();
  firstTime = $('#timeInput').val().trim();
  trainFreq = $('#freqInput').val().trim();
console.log(trainName,trainDest,firstTime,trainFreq);
// PUSH NEW ENTRY TO FIREBASE
	dataRef.ref().push({
		name: trainName,
		dest: trainDest,
    	time: firstTime,
    	freq: trainFreq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP,
	});
	// NO REFRESH
	$("input").val('');
    return false;
});
//moment.js functionality

dataRef.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val().name);
  console.log(childSnapshot.val().dest);
  console.log(childSnapshot.val().time);
  console.log(childSnapshot.val().freq);
  console.log(childSnapshot.val().timeAdded);
  $('#tschedule').append(
  		"<tr><td class='text-center' id='nameDisplay'>" + childSnapshot.val().name +
  		"</td><td class='text-center' id='destDisplay'>" + childSnapshot.val().dest +
  		"</td><td class='text-center' id='freqDisplay'>" + childSnapshot.val().freq +
      "</td><td class='text-center' id='nextDisplay'>" + childSnapshot.val().nextTrain +
      "</td><td class='text-center' id='nextDisplay'>" + childSnapshot.val().tMinutesTillTrain +"</td></tr>");
   });
});
