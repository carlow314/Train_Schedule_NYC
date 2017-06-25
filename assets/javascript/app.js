//document ready function
$(document).ready(function(){

//configuration data to map to firebase
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

//declaration of firebase database variable
var dataRef = firebase.database();

//establish display of current time to jumbotron element
var datetime = null;
var date = null;
var update = function () {
  date = moment(new Date())
  dateTime.text(date.format('hh:mm A'));
};

//setInterval to update current time every 60 seconds
dateTime = $("#current-time")
  update();
  setInterval(update, 60000);

//setInterval to update train data every 60 seconds
  updateTrains();
  setInterval(updateTrains,60000);

//train form submit event listener, and subsequently send values to database.
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

//wrap all display data in update train functions so that it will update every 60 seconds.
// when SetInterval(updateTrains,60000) is ran the train data will update.
 function updateTrains (){
  //initially empty the table so that all previous rows that are appended are cleared out.
  $('#tschedule').empty();
  //call the firebase database to grab all child data that had been sent to firebase through the form on-click event listener
 dataRef.ref().on("child_added", function(childSnapshot){
//define local variables for updateTrain function
  var childKey;
  var timeBetweenTrains = childSnapshot.val().freq;
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrainTime = childSnapshot.val().time;
  var train =childSnapshot.val();
  var currentTime = moment();
  var toDoCount = 0;
 // The first train converted to one year prior to prevent missing any train times
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
 // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
 // Time apart (remainder)
  var tRemainder = diffTime % timeBetweenTrains;
 // Minute Until Train
  var tMinutesTillTrain = timeBetweenTrains - tRemainder;
 // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
// attach key and count to each row so that the remove and update function can be attached to the correct record.
  var tableRow = $('<tr>').attr('id', toDoCount).attr('data-key', childKey);
// Add column for name
  var nameColumn= $('<td class="text-center">').text(name);
// Add column for destination
  var destinationColumn = $('<td class="text-center">').text(destination);
// Add coolumn for frquency
  var frequencyColumn = $('<td class="text-center">').text(timeBetweenTrains);
// Add column for next train time
  var nextTrainTimeColumn = $('<td class="text-center">').text(nextTrain,"hh:mm");
// Add column for minutes until next train
  var tMinutesTillTrainColumn = $('<td class="text-center">').text(tMinutesTillTrain);
// child object from Firebase without the key
  var train = childSnapshot.val();
// key object for train
  train.id = childSnapshot.key;
// creation of delete button
  var deleteButton = $('<button class= "center-block">');
// add attribute to delete-button with counter
deleteButton.attr('data-todo', toDoCount);
// add ID to train with its key
deleteButton.data('train-id', train.id);
// add class to button
deleteButton.addClass('btn btn-danger delete-button');
// add text to button
deleteButton.append('x');
// append all cells to tablerow
tableRow.append(nameColumn).append(destinationColumn).append(frequencyColumn).append(nextTrainTimeColumn).append(tMinutesTillTrainColumn).append(deleteButton);
// add table to DOM
  $('#tschedule').append(tableRow);
      });
   };
   //delete button on click event listener
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
