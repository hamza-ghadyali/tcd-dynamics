// Daniel Shiffman
// http://codingtra.in
// Earthquake Data Viz
// Video: https://youtu.be/ZiYdOwOrGyc

var mapimg;

// Center the map over the United States
var clat = -100;
var clon = 50;

// Set the map size as large as possible
var ww = 1280;
var hh = 900;

// Set a reasonable zoom level that will show all of the US
var zoom = 3;

var stns;

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

  stns = loadStrings('tcd_data_K231.csv'); // generate this csv file from MATLAB
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


function setup() {
  var magmax = sqrt(pow(10, 10));
  createCanvas(ww, hh);
 
  translate(width / 2, height / 2);
  imageMode(CENTER);
  colorMode(HSB);
  image(mapimg, 0, 0);

  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 1; i < stns.length; i++) {
    var data = stns[i].split(/,/);
    //console.log(data);
    var lat = data[1];
    var lon = data[2];
    //var mag = data[4];
    var tcd_tmin = data[5].split('|');
    var tcd_tmax = data[6].split('|');

    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;
    //mag = pow(10, mag);
    //mag = sqrt(mag);
    
    //var d = map(mag, 0, magmax, 0, 180);
    var d = 2;
    var val = map(tcd_tmin[0],0,1,0,240);
    //stroke(200, 90, 250);
    fill(val, 100, 100, 100);
    ellipse(x, y, d, d);
  }

}
/*
next steps:
-restructure the code to avoid redundant computations in parsing the csv file
-animate the points over time or wrst mouse position in the draw() method
-split up the data into smaller subsets and load them on-demand
-get a mapbox api token or use a different map provider
*/



