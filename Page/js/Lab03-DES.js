//check if key is less than 8 characters
function badKey(key){
  return (key.length<8) ? true : false; 
}


//prepare text transforming it to an array
function prepare(text){
  var arr=[];
  arr=text.split("");
  return arr;
}


//perform permutation oer the instruction provided and change the length of the returning array
function performPermutation (arr,arr_inst,changeArr){
  var tmp=0;
  var arr1=new Array(arr.length+changeArr);
  for (var i = 0; i < arr1.length; i++) {
    arr1[i]=arr[arr_inst[i]-1];
  }
  return arr1;
}


//get half of the key, left if leftPart=true, right if leftPart=false
function getHalf(key, leftPart){
  var halfLength=Math.floor((key.length)/2);
  var arr=[];
  var tmp;
  (leftPart) ? tmp=0 : tmp=halfLength;
  for (var i = 0; i < halfLength; i++) {
    arr[i]=key[i+tmp];
  }
  return arr;
}


//shift key/array left for the array
function shiftKey(arr){
  var tmpArr=new Array();
  tmpArr=arr;
  var cell=tmpArr[0];
  for (var i = 0; i < tmpArr.length-1; i++) {
    tmpArr[i]=tmpArr[i+1]
  }
  tmpArr[tmpArr.length-1]=cell;
  return tmpArr;
}


//join two arrays
function joinArr(arr1,arr2){
  return [].concat(arr1, arr2);
}


//logical XOR for each pare elements of two arrays
function xorArr(arr1,arr2){
  var tmpArr=[];
  for (var i = 0; i < arr1.length; i++) {
    (arr1[i]==arr2[i]) ? tmpArr[i]=0:tmpArr[i]=1;
  }
  return tmpArr;
}


//split array into chunks for S-Boxes
function splitForSBoxes(arr){
  //init
  var tmpArr=new Array(bitsForSBox);
  var j=0;
  var k=0;

  do {
    tmpArr[j]=[];
    for (var i = 0; i < bitsForSBox; i++) {
      tmpArr[j][i]=arr[k];
      k++;
    }
    j++;
  } while (k < arr.length);
  return tmpArr;
}


//process array in the S-box
function processSBox(elementArr,sBoxArr){
  //init
  var outputArr=[];
  var tmpArrRow=[];
  var tmpArrCol=[];
  var element;
  var row='';
  var col='';

  //split array element into coordinates
  //rows
  tmpArrRow[0]=elementArr[0];
  tmpArrRow[1]=elementArr[5];

  //columns
  for (var i = 1; i < 5; i++) {
    tmpArrCol[i-1]=elementArr[i];
  }
  
  //transform coordinates into numbers
  row=parseInt(tmpArrRow.join(''),2);
  col=parseInt(tmpArrCol.join(''),2);
 
  //define element per the row and column coordinates
  element=sBoxArr[col+(row*16)];
  elementString=element.toString(2);

  //add missing leading zeros
  (elementString.length<4) ? (
    (elementString.length<3) ? (
      (elementString.length<2) ? (
        elementString="000"+elementString
        ) : (elementString="00"+elementString)
      ) : (elementString="0"+elementString)
    ) : (elementString=elementString);

  //return array with bins for the element
  return elementString.split("");
}


//create all encryption keys from key text in the order set - if true in the direct order for encryption, if false in the reverse order for decryption
function getAllKeys(keyText){
  var keyArr=new Array(iterationsNumber);
  
  //prepare encryption key and convert to bin array
  tmpKeyArr=prepare(keyText.str2bin());

  //perform Permuted Choice 1 and go to 56 bit array
  tmpKeyArr=performPermutation(tmpKeyArr,permutedChoice1Table,-8);

  //get left and right halves - 28bit each
  keyLeft=getHalf(tmpKeyArr,true);
  keyRight=getHalf(tmpKeyArr,false);



    //get 16 keys values
    for (var i = 0; i < iterationsNumber; i++) {
    //perform shifts of left and right keys per the table of shifts
      for (var j = 0; j < shiftKeyTimesTable[i]; j++) {
        keyLeft=shiftKey(keyLeft);
        keyRight=shiftKey(keyRight);
      }
      //join back two parts into one array
      keyArr[i]=joinArr(keyLeft,keyRight);
      
      //perform Permuted Choice 2 and go to 48 bit array
      keyArr[i]=performPermutation(keyArr[i],permutedChoice2Table,-8);
    }

  return keyArr;
}


//perform encryption round having keft part, right part and the key
function performRound(leftArr,rightArr,keyArr){
  //init
  var roundResArr=new Array(2);
  var expArr=[];
  var xorResArr=[];
  var sArr=[];
  var splitResArr=[];
  var sBoxResArr=[];
  var pResArr=[];
  var finalRoundArr=[];

  //left side is known
  roundResArr[0]=rightArr;

  //calculating right side
  //expand right side to 48 bit
  expArr=performPermutation(rightArr,expansionTable,16);

  //xor it with the key
  xorResArr=xorArr(expArr,keyArr);
  
  //split for S-boxes in preparation
  sArr=splitForSBoxes(xorResArr);

  //for each S-box process the appropriate part
  for (var i = 0; i < sArr.length; i++) {
    splitResArr[i]=[];
    splitResArr[i]=processSBox(sArr[i],sBoxesTable[i]);  
  }
  
  //bring all results to one array back
  for (var i = 0; i < splitResArr.length; i++) {
    for (var j = 0; j < splitResArr[i].length; j++) {
      sBoxResArr.push(splitResArr[i][j]);
    }    
  }    

  //perform P-permutation for the result
  pResArr=performPermutation(sBoxResArr,pPermutationTable,0);

  //perform xor with the left part
  finalRoundArr=xorArr(leftArr,pResArr);

  //identify the right part
  roundResArr[1]=finalRoundArr;
  
  return roundResArr;
}


//encryption process
function encrypt(){
  //init
  var keyText=document.getElementById("key").value;
  var messageText = document.getElementById("message").value;
  var finalOutput=document.getElementById("scene");
  var initialLeft=[];
  var initialRight=[];
  var orderForward=true;
  finalOutput.innerHTML ="";

  //set hex values for initial text and encryption key
  document.getElementById("key_hex").value=keyText.str2hex();
  document.getElementById("message_hex").value=messageText.str2hex();

  //main flow
  //check for encryption key validity
  var error = badKey(keyText); 
  if (error) {
    finalOutput.innerHTML += "Ключ закороткий для шифрування (8 символів)! ";
  } else {
    
    //prepare initial message, convert it to bin
    var messageArr=[];
    messageArr=prepare(messageText.str2bin());

    //perform initial permutation
    messageArr=performPermutation(messageArr,initialPermutationTable,0);

    //get all keys
    var keys=[];
    keys=getAllKeys(keyText);

    //create a place to store all transformations
    var partsArr=new Array(iterationsNumber+2);
    partsArr[0]=new Array(2);
    
    //populate initial left and right sides - L0 and R0
    partsArr[0][0]=getHalf(messageArr,true);;
    partsArr[0][1]=getHalf(messageArr,false);

    //perform all rounds of tranformations
    for (var i = 1; i <= iterationsNumber; i++) {
      partsArr[i]=performRound(partsArr[i-1][0],partsArr[i-1][1],keys[i-1]);
    }

    //final swap
    //[a, b] = [b, a];
    [partsArr[16][0], partsArr[16][1]] = [partsArr[16][1], partsArr[16][0]];

    //get all elements into one 64-bit array
    var resArr=[];
    for (var i = 0; i < partsArr[16].length; i++) {
      for (var j = 0; j < partsArr[16][i].length; j++) {
        resArr.push(partsArr[16][i][j]);
      }    
    }

    //perform final permutation
    var finalResult=[];
    finalResult=performPermutation(resArr,finalPermutationTable,0);

    //set the encrypted value to the form
    encodedMessage=finalResult.join("").toString().bin2hex();
    finalOutput.innerHTML=encodedMessage;

    //prepare to decrypt - populate decryption field with encrypted message
    var el1=document.getElementById("enc_message");
    el1.value = finalOutput.innerHTML;
  }
}


//decryption method
function decrypt(){
  //init
  var keyText=document.getElementById("key").value;
  var messageText = document.getElementById("enc_message").value;
  var finalOutput=document.getElementById("scene");
  var initialLeft=[];
  var initialRight=[];
  var orderForward=true;
  finalOutput.innerHTML ="";

  //decryption code goes here
  //main flow
  //check for encryption key validity
  var error = badKey(keyText); 
  if (error) {
    finalOutput.innerHTML += "Ключ закороткий для шифрування (8 символів)! ";
  } else {
    
    //prepare initial message, convert it to bin
    var messageArr=[];
    messageArr=prepare(messageText.hex2bin());

    //perform initial permutation
    messageArr=performPermutation(messageArr,initialPermutationTable,0);

    //get all keys
    var keys=[];
    keys=getAllKeys(keyText);
    keys.reverse();

    //create a place to store all transformations
    var partsArr=new Array(iterationsNumber+2);
    partsArr[0]=new Array(2);
    
    //populate initial left and right sides - L0 and R0
    partsArr[0][0]=getHalf(messageArr,true);;
    partsArr[0][1]=getHalf(messageArr,false);

    //perform all rounds of tranformations
    for (var i = 1; i <= iterationsNumber; i++) {
      partsArr[i]=performRound(partsArr[i-1][0],partsArr[i-1][1],keys[i-1]);
    }

    //final swap
    //[a, b] = [b, a];
    [partsArr[16][0], partsArr[16][1]] = [partsArr[16][1], partsArr[16][0]];

    //get all elements into one 64-bit array
    var resArr=[];
    for (var i = 0; i < partsArr[16].length; i++) {
      for (var j = 0; j < partsArr[16][i].length; j++) {
        resArr.push(partsArr[16][i][j]);
      }    
    }

    //perform final permutation
    var finalResult=[];
    finalResult=performPermutation(resArr,finalPermutationTable,0);

    //set the encrypted value to the form
    encodedMessage=finalResult.join("").toString().bin2hex();
    finalOutput.innerHTML=encodedMessage;

  }
}