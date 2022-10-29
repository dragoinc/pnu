//check if column key is enough to encrypt the matrix
function badMatrixHeight (message, columnKey, rowKey){
  
  //init
  var matrixWidth = columnKey.length;
  var matrixHeight = Math.ceil(message.length/matrixWidth);
  
  return (matrixHeight > rowKey.length) ? true : false;
}


//check the key if it has duplicate chacters
function badKey(key){
  for (var i = 0; i < key.length; i++) { 
   var e=(key.split(key[i])).length - 1;
   if (e>1) return true;
  }
  return false;
} 


//create and populate matrix for the encrypion
function createMatrix(message, key_col){

  //init
  var matrixWidth = key_col.length;
  var matrixHeight=Math.ceil(message.length/matrixWidth);
  var matrix = [];
  var j=0;
  var k=0;

  //create matrix
  do {
    matrix[j]=new Array(matrixWidth);
    for (var i = 0; i < matrixWidth; i++) { 
        matrix[j][i] = message[k];
      k++;
    }
    j++;
  } while (j < matrixHeight);

  //matrix check and fix
   for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (!matrix[i][j]) matrix[i][j]=' ';
    }
  } 

  //return matrix
  return matrix;
}


//helper function to prepare matrix for population
function prepareMatrix(matrix){
   for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      matrix[i][j]=' ';
    }
  }

  //return matrix 
  return matrix;
}


//matrix population
function populateMatrix(matrix, message, key_col){

  //init
  var matrixWidth = key_col.length;
  var matrixHeight=Math.ceil(message.length/matrixWidth);
  var k=0;
  var j=0;

  //matrix population
  do {
    for (var i = 0; i < matrixHeight; i++) { 
        matrix[i][j] = message[k];
        k++;
    }
    j++;
  } while (j < matrixWidth);

  //return matrix
  return matrix;
}


//transform matrix to a message
function printMatrix(matrix, orderForward){

  //init
  var result="";

  //read the message from the matrix - one way or another
  //depending on the order - reverse order (for encryption) or
  //direct order (for decryption)
  if (!orderForward) {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        result +=matrix[i][j];
      }
    }
  } else {
    for (var i = 0; i < matrix[0].length; i++) {
      for (var j = 0; j < matrix.length; j++) {
        result += matrix[j][i];
      }
    }    
  }

  //return message
  return result;
}


//helper function to alphabetize the string
function alphabetize(str){
  var arr = str.toString().split('');
  var sorted = arr.sort();
  return sorted.join('');
}


//prepare for sorting - identify the sorting instructions depending on the order -
//direct for encryption, reverse for decryption
function prepareSort (string, array1, array2, orderForward){

  //populate an initial instruction
  for (var i = 0; i < array1.length; i++) {
    array1[i]=i;
  }  
  //alphabetize string
  var stringA = alphabetize(string);

  //find the new order (instruction) - direct or reverse 
  //depending on the method (encryption or decryption)
  for (var i = 0; i < array1.length; i++) {
    if (orderForward) {
      array2[i]=string.toString().split('').indexOf(stringA.split('')[i]);
    } else {
      array2[i]=stringA.toString().split('').indexOf(string.split('')[i]);     
    }
  }
}


//sort columns of rows in matrix depending on the parameter rowSort 
//(true - sort rows, false - sort columns)
function sortMatrix (string, matrix, orderForward, rowSort){

  //initialize
  var initialArray=new Array(string.length);
  var newArray=new Array(string.length);

  //identify sorting instructions
  prepareSort (string,initialArray,newArray,orderForward);    

  //sort init
  var tempMatrix=new Array;
  var j=0;
  var matrixWidth=0;
  
  //sorting width determination for rows (rowSort=true) and columns (rowSort=false)
  if (!rowSort) {
    matrixWidth=string.length;
  } else {
    matrixWidth=matrix[0].length;
  }
  
  //sorting
  do {
    tempMatrix[j]=new Array(matrixWidth);
    
    if (!rowSort) {
      for (var i = 0; i < matrixWidth; i++) { 
        var c=newArray[i];
        tempMatrix[j][i] = matrix[j][c];
      }
    } else {
      var c=newArray[j];
      for (var i = 0; i < matrixWidth; i++) { 
        tempMatrix[j][i] = matrix[c][i];
      }
    }

    j++;
  } while (j < matrix.length);

  //done
  return tempMatrix;
}


//decryption main function
function decrypt(){
  
  //init
  var keyColText=document.getElementById("key_col").value;
  var keyRowText=document.getElementById("key_row").value;
  var messageText = document.getElementById("enc_message").value;
  var el=document.getElementById("scene");
  var matrix = [];
  var result="";
  var orderForward=false;

  //decryption process
  matrix=createMatrix(messageText, keyColText);
  matrix=prepareMatrix(matrix);
  matrix=populateMatrix(matrix, messageText,keyColText);
  matrix=sortMatrix(keyRowText,matrix,orderForward,true);
  matrix=sortMatrix(keyColText,matrix,orderForward,false);
  el.innerHTML=printMatrix (matrix,orderForward);
}


//encryption process
function encrypt(){
  //init
  var keyColText=document.getElementById("key_col").value;
  var keyRowText=document.getElementById("key_row").value;
  var messageText = document.getElementById("message").value;
  var matrix = [];
  var result="";
  var orderForward=true;
  var el=document.getElementById("scene");
  el.innerHTML ="";

  //main flow
  var error = badMatrixHeight(messageText, keyColText, keyRowText); 
  if (error) {
    el.innerHTML += "Рядковий ключ закороткий для шифрування! ";
  } else {
    if (badKey(keyColText)) {
      el.innerHTML += "Стовпцевий ключ містить повторювані літери! ";
    } else {  
      if (badKey(keyRowText)) {
        el.innerHTML += "Рядковий ключ містить повторювані літери! ";
      } else {
        matrix=createMatrix(messageText, keyColText);
        matrix=sortMatrix(keyColText,matrix,orderForward,false);
        matrix=sortMatrix(keyRowText,matrix,orderForward,true);
        el.innerHTML=printMatrix (matrix, orderForward);

        //prepare to decrypt - populate decryption field with encrypted message
        var el1=document.getElementById("enc_message");
        el1.value = el.innerHTML;
      }
    }
  }
}