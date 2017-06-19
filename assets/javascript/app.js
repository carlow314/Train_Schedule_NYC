//document ready function
$(document).ready(function(){

  //global variables//
  var datetime = null;
  var date = null;
  var currentTime;
  var trainFreq;
  var firstTrain;
  var trainName;
  var trainDest;

//function to set current time
var update = function () {
    date = moment(new Date())
    datetime.text(date.format('h:mm:ss A'));
};
//display current time in #current-time id within the jumbotron with update every second
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

//adding train submit event listener and pushing form results to firebase
$("#submit").on("click", function() {
	trainName = $('#nameInput').val().trim();
  trainDest = $('#destInput').val().trim();
  firstTrain = $('#timeInput').val().trim();
  trainFreq = $('#freqInput').val().trim();

// pushing of new entry to firebase
	dataRef.ref().push({
		name: trainName,
		dest: trainDest,
    	time: firstTrain,
    	freq: trainFreq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	// if values are blank do nothing. Prevents submission of undefined inputs
	$("input").val('');
    return false;

});
//grabs data from firebase for each child obkect
dataRef.ref().on("child_added", function(childSnapshot){

  var timeBetweenTrains = childSnapshot.val().freq;
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrainTime = childSnapshot.val().time;
  var currentTime = moment();
  console.log(timeBetweenTrains);
 // The first train
 var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
 // Difference between the times
 var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
 // Time apart (remainder)
 var tRemainder = diffTime % timeBetweenTrains;
 // Minute Until Train
 var tMinutesTillTrain = timeBetweenTrains - tRemainder;
 // Next Train
 var nextTrain = moment().add(tMinutesTillTrain, "minutes");
//adding train data to table in html
  $('#tschedule').append(
  		"<tr><td class='text-center' id='nameDisplay'>" + name +
  		"</td><td class='text-center' id='destDisplay'>" + destination +
  		"</td><td class='text-center' id='freqDisplay'>" + timeBetweenTrains +
      "</td><td class='text-center' id='nextDisplay'>" + nextTrain.format('h:mm A') +
      "</td><td class='text-center' id='timeBetweenDisplay'>" + tMinutesTillTrain +"</td></tr>");
   });
});
