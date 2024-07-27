// Data set for this project:
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

//Step 1: get the data
const req = new XMLHttpRequest();
req.open('GET',url,true);
req.send();
req.onload = function(){
    const json = JSON.parse(req.responseText);
    document.getElementById('message').innerHTML = JSON.stringify(json);
}

