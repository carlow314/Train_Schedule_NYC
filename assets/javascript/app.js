//document ready function
$(document).ready(function(){
//function to set current time
  var datetime = null;
  var date = null;
  var update = function () {
    date = moment(new Date())
    dateTime.text(date.format('hh:mm A'));
};
//display current time in #current-time id within the jumbotron with update every second
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

var dataRef = firebase.database();
dateTime = $("#current-time")
  update();
  setInterval(update, 60000);

  updateTrains();
  setInterval(updateTrains,60000);


  //firebase JSON config object

//variable to call firebase database;

//adding train submit event listener and pushing form results to firebase
$("#submit").on("click", function() {
	var trainName = $('#nameInput').val().trim();
  var trainDest = $('#destInput').val().trim();
  var firstTrain = $('#timeInput').val().trim();
   var trainFreq = $('#freqInput').val().trim();

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
//grabs data from firebase for each child object

//empty table so that is can be updated every minute with set interval function
 function updateTrains (){
  $('#tschedule').empty();
 dataRef.ref().on("child_added", function(childSnapshot){
//define variables for childSnapshot values
  var toDoCount;
  var childKey;
  var timeBetweenTrains = childSnapshot.val().freq;
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrainTime = childSnapshot.val().time;
  var train =childSnapshot.val();
  var currentTime = moment();
  var toDoCount = 0;
 // The first train
 var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
 // Difference between the times
 var diffTime = moment(currentTime).diff(moment(firstTimeConverted), "minutes");
 // Time apart (remainder)
 var tRemainder = diffTime % timeBetweenTrains;
 // Minute Until Train
 var tMinutesTillTrain = timeBetweenTrains - tRemainder;
 // Next Train
 var nextTrain = moment(currentTime).add(tMinutesTillTrain, "minutes").format("hh:mm A");


var tableRow = $('<tr>').attr('id', toDoCount).attr('data-key', childKey);
        // Add cell for name
        var nameColumn= $('<td class="text-center">').text(name);
        // Add cell for destination
        var destinationColumn = $('<td class="text-center">').text(destination);
        // Add cell for frequency
        var frequencyColumn = $('<td class="text-center">').text(timeBetweenTrains);
        // Add cell for firstTrainTime

        var nextTrainTimeColumn = $('<td class="text-center">').text(nextTrain,"hh:mm");
        // Add cell for tMinutesTillTrain
        var tMinutesTillTrainColumn = $('<td class="text-center">').text(tMinutesTillTrain);
        // child object from Firebase minus the key
        var train = childSnapshot.val();
        // key object for train
        train.id = childSnapshot.key;
        // button to delete row
        var deleteButton = $('<button class= "center-block">');
        // add attribute to delete-button with counter
        deleteButton.attr('data-todo', toDoCount);
        // add ID to train with its key
        deleteButton.data('train-id', train.id);
        // add class to button
        deleteButton.addClass('delete-button');
        // add X to button
        deleteButton.append('Remove');
        // add 1 to counter everytime function runs
        toDoCount++;
        // append all cells to tablerow
        tableRow.append(nameColumn).append(destinationColumn).append(frequencyColumn).append(nextTrainTimeColumn).append(tMinutesTillTrainColumn).append(deleteButton);
        // add table to DOM
        $('#tschedule').append(tableRow);
      });
   };
   $(document).on('click', '.delete-button', function () {
       // add attr to button selected
       var counter = $(this).attr('data-todo');
       // add ID to button
       var id = $(this).data('train-id');
       // removing data from row
       dataRef.ref().child(id).remove();
       // remove row from DOM
       $('#' + counter).remove();
   });
});
