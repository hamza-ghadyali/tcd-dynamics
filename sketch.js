// Daniel Shiffman
// http://codingtra.in
// Earthquake Data Viz
// Video: https://youtu.be/ZiYdOwOrGyc

var mapimg;

// Center the map over the United States
var clat = 50;
var clon = -100;
var cx, cy;

// Set the map size as large as possible
var ww = 1280;
var hh = 800;

// Set a reasonable zoom level that will show all of the US
var zoom = 2.5;

//pick a default diameter for the points
var diameter = 10;

//controls for choosing between tmin and tmax and displaying count
var radio;

//variables to store the station data
var data, stns = [];

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

  data = loadStrings('alternate_tcd_data/tcd_data_K231_0_100_rescale_no_pipes.csv'); // generate this csv file from MATLAB

}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(abs(b));
  return a * c;
}

function convert_index2date(index){
  var start_date = moment("19811226", "YYYYMMDD");
  
  var my_date = moment(start_date).add(index,'days');
  my_date = moment(my_date).format('L');
  return my_date;
}

function setup() {
  //create the radio button and options
  radio = createRadio('radio');
  var headerrow = data[0].split(/,/);
  for(var j = 5; j < headerrow.length; j++) {
    radio.option(headerrow[j], j);
  }
  radio.value(6);  //set the default value

  //create the canvas
  createCanvas(ww, hh);
 
  //draw the map
  translate(width / 2, height / 2);
  imageMode(CENTER);
  colorMode(HSB);
  image(mapimg, 0, 0);

  cx = mercX(clon);
  cy = mercY(clat);
  
  //parse the csv file into a 3D array
  //we can't do this in the preload() function
  //because the CSV file is loaded asynchronously
  for (var i = 1; i < data.length; i++) {
    stns[i-1] = data[i].split(/,/);
    //we assume that the tcd data starts at the column with index 5
    //and that all of the remaining columns contain tcd data
    for(var j = 5; j < stns[i-1].length; j++) {
      //split the tcd data at every 4th character

      stns[i-1][j] = stns[i-1][j].trim().match(/[0-9]{1,3}/g);


    }
  }
}

//initialize the index for looping over our observations
var index = 0;

function draw() {
  //translate the origin to the center of the map
  translate(width / 2, height / 2);
  
  //get the value of the radio button to determine the selected tcd value
  var radioval = radio.value();
  
  //iterate over the stations and draw the points for the selected tcd value
  for (var i = 0; i < stns.length; i++) {
    var tcd = stns[i][radioval][index];

    //get the lat and lon from the parsed CSV array
    var x = mercX(stns[i][2]) - cx;
    var y = mercY(stns[i][1]) - cy;
    
    //calculate the color based on the tcd_tmin from the array
    var val = map(tcd,0,100,0,240);
    stroke(val, 100, 100, 100);
    fill(val, 100, 100, 50);
    ellipse(x, y, diameter, diameter);
  }
  
  //INSERT COLOR-BAR
  num_bins = 100;
  //hue range is [0,240]
  //values [0,1]
  var cbar_width = 10;
  var cbar_height = 2;
  //position relative to the centered coords
  var x_pos_fixed = 380;  
  var upper_y_pos_fixed = -100;
  //color-bar rectangles seqn
  for (var i=0; i < num_bins; i++){
    var val = map(i,0,100,0,240);
    stroke(val, 100, 100, 100);
      fill(val, 100, 100, 100);
      rect(x_pos_fixed,upper_y_pos_fixed+i*cbar_height,cbar_width,cbar_height);
  }
  var x_text_pos = x_pos_fixed + cbar_width + 6;
  var lower_y_text_pos = upper_y_pos_fixed + num_bins*cbar_height;
  var my_sat = 50;
  var my_text_size = 14;
  textSize(my_text_size);
  fill(0, my_sat, 100, 100);
  text("High GC", x_text_pos, upper_y_pos_fixed+my_text_size);
  fill(240, my_sat, 100, 100);
  text("Low GC", x_text_pos, lower_y_text_pos);
  //

  //update our observations index
  //assumes that all stations have the same number of observations
  index = (index + 1) % stns[0][5].length;
  index2 = convert_index2date(index);
  document.getElementById('counter').innerHTML= index2;



}

// http-server -p 8089 (nodeJS local server)
// localhost:8089

/*
next steps:
-split up the data into smaller subsets and load them on-demand
-get a mapbox api token or use a different map provider
*/



