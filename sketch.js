
let loadbar = 0;
let failedLoads = [];
let jsonDocuments = [
  "./json/Andersen.json",
   "./NotARealJsonFile.json", //note p5 editor handles errors weirdly here
  "./json/FairyTale.json"
];

let canvas;
let files = [];
let displayText = "";

//data structure
// for cut up generator
let phrases = [];


function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  canvas.mousePressed(handleCanvasPressed);

  loadFile(0);
}

function draw() {
  background(190,230,255);

  if(loadbar < jsonDocuments.length){

    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);

  }else{

    let fontSize = map(displayText.length,0,200,30,20,true);
    textSize(fontSize);
    fill(223, 15, 114);
    textWrap(WORD);
    textAlign(CENTER);
    text(displayText,50, 50, 400);

  }

}

function handleCanvasPressed(){
  //original text
  displayText = "Don't show this boring sentence, generate some text instead!";

  //generate cut up phrases

  displayText = generateCutUpPhrases(3);

  //show text in HTML
  showText(displayText);

}

function buildModel(){
  console.log("run buildModel()");

  //create and store phrases
  
  for(let i = 0; i < files.length; i++){
    
    let text = files[i].text;
    
    // console.log(text);
    
    let textPhrases = text.split(/(?=[,.])/);
    
    for(let j = 0; j < textPhrases.length; j++){
      let puntuationless = textPhrases[j].replace(/[^a-zA-Z- ']/g,"");
      let lowerCase = puntuationless.toLowerCase();
      let trimmed = lowerCase.trim();
     // console.log(trimmed);
      
      phrases.push(trimmed);
    }
    
    
  }


}

//Text Generator Function ----------------------------------

function generateCutUpPhrases(numPhrases){
  let output = "";

  //implement your code to generate the output
  
  for(let i = 0; i < numPhrases; i++){
    let randomIndex = int(random(0,phrases.length));
    let randomPhrase = phrases[randomIndex];
    
    output += randomPhrase + ". ";
  }


  return output;
}


//Generic Helper functions ----------------------------------

function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {
    
      console.log("Loaded File");
      console.log(data);
      files.push(data);

      showText("Training text number " + (index+1));
      showText(data.text);
  
      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}

//add text as html element
function showText(text){

  let textContainer = select("#text-container");
//  textContainer.elt.innerHTML = "";//add this in if you want to replace the text each time

  let p = createP(text);
  p.parent("text-container");

}

  