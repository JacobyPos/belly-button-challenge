//bellybutton info source
const jsonUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data;

// main code
d3.json(jsonUrl).then(function(myData) {
  data = myData;
  console.log(data);                  // Using D3 to log json
  dropdownPopulate(data);             // calling function to populate the dropdown menu
  var initialSample = data.names[0];
  makeBarChart(data, initialSample);
  updateMetadata(data, initialSample);
  makeBubbleChart(data, initialSample);
});


//function to populate the dropdown menu
function dropdownPopulate(data) {
    var dropdown = d3.select("#selDataset");
    data.names.forEach((sampleId) => {
        dropdown.append("option").text(sampleId).property("value",sampleId);
    });
}

//function to make bar chart
function makeBarChart(data, sampleId) {
    var selectedSample = data.samples.find((sample) => sample.id === sampleId);
    var topTenSamples = selectedSample.sample_values.slice(0, 10).reverse();
    var topTenSampleValues = selectedSample.otu_ids.slice(0, 10).reverse();
  
    // Format OTU IDs with the "OTU" prefix
    var formattedOTUIds = topTenSampleValues.map(otuId => `OTU ${otuId}`);
  
    var trace = {
      type: "bar",
      x: topTenSamples,
      y: formattedOTUIds,  // Use the formatted OTU IDs
      text: formattedOTUIds,  // Use the formatted OTU IDs in hover text
      orientation: 'h'
    };
  
    var plotData = [trace];
    var layout = {
      title: 'Top 10 OTUs',
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
  
    Plotly.newPlot("bar", plotData, layout);
  }


// Function to handle dropdown change
function optionChanged(selectedSample) {
    // Update all plots with the selected sample
    makeBarChart(data, selectedSample);
    makeBubbleChart(data, selectedSample);
    updateMetadata(data, selectedSample);
  }


// Function to update metadata
function updateMetadata(data, sampleId) {
    var metadataPanel = d3.select("#sample-metadata");
    var selectedMetadata = data.metadata.find((metadata) => metadata.id === parseInt(sampleId));
  
    // Clear existing metadata
    metadataPanel.html("");
  
    // Display each key-value pair in the metadata
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }


// Function to make bubble chart
function makeBubbleChart(data, sampleId) {
    var traceBubble = {
      type: "bubble",
      x:    data.samples.find((sample) => sample.id === sampleId).otu_ids,
      y:    data.samples.find((sample) => sample.id === sampleId).sample_values,
      text: data.samples.find((sample) => sample.id === sampleId).otu_labels,
      mode: 'markers',
      marker: {
        size:  data.samples.find((sample) => sample.id === sampleId).sample_values,
        color: data.samples.find((sample) => sample.id === sampleId).otu_ids,
      }
    };
  
    var layoutBubble = {
      title: 'Bubble Chart',
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
  
    var dataBubble = [traceBubble];
  
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
  }