
var cvs_data = "";

$( document ).ready(function() {
  cvs_data = loadData();

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawLineChart);
});
  

// LOAD CSV-DATA
function loadData(){
  $.ajax({
    type: "GET",
    url: "graficos.csv",
    dataType: "text",
    success: function(data){
      cvs_data = processData(data);
    }
  });
}

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  var lines = [];

  for (var i=1; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    if (data.length == headers.length) {
      var tarr = [];
      for (var j=0; j<headers.length; j++) {
        tarr.push(headers[j]+":"+data[j]);
      }
      lines.push(tarr);
    }
  }
  console.log(lines);
  return lines;
}



// DRAWING CHARTS

function drawPieChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
  ]);

  // Set chart options
  var options = {'title':'How Much Pizza I Ate Last Night',
                 'width':600,
                 'height':500};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}




function drawLineChart() {
  var normalized_data = [];
  var row_array_formated = [];

  cvs_data.forEach(function(row_array, row_index){
    if(row_index < 13){

    //deletes exceed elements
    row_array.shift();  
    while(row_array[row_array.length - 1] === ":" || row_array[row_array.length - 1] === ":#N/A"){
      row_array.pop();
    }

    row_array_formated = row_array.map(function(obj){
      obj = obj.replace(':','');
      obj = obj.replace('PUNTOS','');
      
      if (parseInt(obj)){
        obj = parseInt(obj);
      }
      
      return obj;
    });

    normalized_data.push(row_array_formated); 
    }
  });

  normalized_data = transpose(normalized_data);

  // var normalized_data2 = normalized_data[0].map(function(col, i) {
  //   return normalized_data.map(function(row) {
  //     return row[i]
  //   })
  // });

  console.log("normalized_data", normalized_data);

  var data = google.visualization.arrayToDataTable(normalized_data);

  var options = {
    title: 'Distancias',
    curveType: 'function',
    legend: { position: 'right' },
    'width':800,
    'height':500
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}








// AUXILIARY FUNCIONS

transpose = function(a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};