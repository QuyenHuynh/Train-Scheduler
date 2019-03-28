// Initialize Firebase
var config = {
  apiKey: "AIzaSyBp04fglvSgzD9nwoPTKlJngut04a6A7no",
  authDomain: "train-scheduler-590b6.firebaseapp.com",
  databaseURL: "https://train-scheduler-590b6.firebaseio.com",
  projectId: "train-scheduler-590b6",
  storageBucket: "train-scheduler-590b6.appspot.com",
  messagingSenderId: "207614208609"
};
firebase.initializeApp(config);

var database = firebase.database();


function currentTime() {
  var current = moment().format('LT');
  $("#currentTime").text("The current time is: " + current);
  //updates time every minute
  setTimeout(currentTime, 1000 * 60);
};
currentTime();

//on-click function for adding new trains to the database
$("#submit-btn").on("click", function (event) {

  event.preventDefault();

  //get information from text boxes
  var name = $("#name").val().trim();
  var dest = $("#dest").val().trim();
  var traintime = $("#traintime").val().trim();
  var freq = $("#freq").val().trim();

  var newTrain = {
    name: name,
    dest: dest,
    traintime: traintime,
    freq: freq
  }
  database.ref().push(newTrain);

  //reset text boxes
  $("#name").val("");
  $("#dest").val("");
  $("#time").val("");
  $("#freq").val("");
});

//runs if a child has been added to the database
database.ref().on("child_added", function (snapshot) {
  var data = snapshot.val();
  console.log(data);

  //assign our values to new variables
  var trainName = data.name;
  var trainDest = data.dest;
  var startTime = data.traintime;
  var trainFreq = data.freq;

  //reformat the time
  var formattedTime = moment(startTime, "hh:mm").subtract(1, "years")
  //calculate the time from startTime and now in minutes
  var timeDifference = moment().diff(moment(formattedTime), "minutes");
  //use train freq to calculate the remaining time
  var remainingTime = timeDifference % trainFreq;
  //calculate minutes until next arrival time
  var minutesAway = trainFreq - remainingTime;
  //calculate next arrival time
  var nextArrival = moment().add(minutesAway, "minutes");

  //create new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(moment(nextArrival).format("LT")),
    $("<td>").text(minutesAway),
    );
    
    $("tbody").append(newRow);
    
});