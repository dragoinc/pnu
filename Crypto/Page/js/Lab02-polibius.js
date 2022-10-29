//make the message characters all lowercase
function prepareMessage(message){
  return message.toString().toLowerCase();
}


//process message depending on the order - encryption or decryption
function processMessage (message,matrix,orderForward){
  //init
  var tmpMessage ="";
  var matrixHeight = matrix.length;
  var matrixWidth = matrix[0].length;
  var k=0;
  
  //process each symbol
  do {
    var j=0;
    //search in matrix for the symbol
    do {
      for (var i = 0; i < matrixWidth; i++) {
        if (matrix[j][i]==message[k]){
          var m=0; 
    
          //select a cell depending on the order - 
          //encryption (forward) or decryption (backward)
          if (orderForward){
            if ((j+1)>(matrixHeight-1)) {m=0} else {m=j+1;} 
          } else {
            if ((j-1)<0) {m=matrixHeight-1} else {m=j-1;} 
          }
          
          //add a new encrypted/decrypted symbol to the temp message
          tmpMessage +=matrix[m][i] 
          
          k++;
        }
      }
      j++;
    } while (j < matrixHeight);
  } while (k<message.length);

  //return the encrypted/decrypted string
  return tmpMessage; 
}


//create and populate alphabetical matrix
function createMatrix(){

  //init
  var matrixWidth = 6;
  var matrixHeight = 5;
  var matrix = [];
  var j=0;
  var k=0;

  //create matrix
  do {
    matrix[j]=new Array(matrixWidth);
    for (var i = 0; i < matrixWidth; i++) { 
        
        //special characters of the phrase are put to the matrix - 
        //space, comma, apostrophe and exclamation mark
        if (k==26) 
          matrix[j][i]=" ";
         else if (k==27) 
          matrix[j][i]=",";
         else if (k==28) 
          matrix[j][i]="'";
         else if (k==29) 
          matrix[j][i]="!";
         
          //alphabet characters are put in the matrix
         else matrix[j][i] = String.fromCharCode(k + 97);

      k++;
    }
    j++;
  } while (j < matrixHeight);

  //return created matrix
  return matrix;
}


//print message to the HTML div
function printMessage(message){
  var tmpMessage ="";
  for (var i = 0; i < message.length; i++) {
    tmpMessage += message[i];
  }
  return tmpMessage; 
}


//encryption method
function encrypt(){
  //init
  var messageText = document.getElementById("message").value;
  var matrix = [];
  var el=document.getElementById("scene");
  var orderForward=true;
  var result="";

  //encryption
  var preparedMessage=prepareMessage(messageText);
  matrix=createMatrix();
  result=processMessage (preparedMessage,matrix,orderForward);

  //print message
  el.innerHTML= printMessage(result);
  
  //prepare for decryption
  var el=document.getElementById("enc_message");
  el.value = result;
}


//decryption method
function decrypt(){
  //init
  var el=document.getElementById("scene");
  var messageText = document.getElementById("enc_message").value;
  var matrix = [];
  var result="";
  var orderForward=false;

  //decryption
  matrix=createMatrix();
  result=processMessage (messageText,matrix,orderForward);

  //print message
  el.innerHTML=printMessage(result);
}