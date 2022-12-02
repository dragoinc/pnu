function copyMatrix(matrix){
	var tmpMatrix=[];
	for (var i = 0; i < 4; i++) {
		tmpMatrix.push([]);
	}
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			tmpMatrix[i][j]=matrix[i][j];
		}
	}
	return tmpMatrix;
}

function createMatrix(someString){
	var tempString=someString;
	var matrix=[];
	for (var i = 0; i < 4; i++) {
		matrix.push([]);
	}
	var i=0;
	var j=0;

	while (tempString.length > 0){
		matrix[i][j]=tempString.slice(0,2);;
		tempString=tempString.slice(2);
		i++;
		if (i>3) {j++;i=0;}
	}

	return matrix;
}

function createString(matrix){
	var string='';

	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			string+=matrix[j][i];
		}
	}

	return string;
}

function rotWord(matrix, rotateIndex){
	var tmpMatrix=copyMatrix(matrix);
	var tmp=tmpMatrix[0][rotateIndex];
	for (var i = 0; i < 3; i++) {
		tmpMatrix[i][rotateIndex]=tmpMatrix[i+1][rotateIndex];
	}
	tmpMatrix[3][rotateIndex]=tmp;
	return tmpMatrix;
}



function subBytesElement(element,sBoxMatrix){
	var tmpArrRow=[];
	var tmpArrCol=[];
	var el='';
	var row='';
	var col='';

	  //split array element into coordinates
	  //rows
	  tmpArrRow=hex2arr(element).slice(0,4);
	  
	  //columns
	  tmpArrCol=hex2arr(element).slice(4,8);
	  
	  //transform coordinates into numbers
	  row=parseInt(tmpArrRow.join(''),2);
	  col=parseInt(tmpArrCol.join(''),2);
	 
	  //define element per the row and column coordinates
	  el=sBoxMatrix[row][col];

	  return el;
}

function subBytesWord(matrix,sBoxMatrix,index){
    //init
	var tmpMatrix=copyMatrix(matrix);

	for (var i = 0; i < 4; i++) {
	  tmpMatrix[i][index]=subBytesElement(matrix[i][index],sBoxMatrix);
	}
  
  return tmpMatrix;
}

function subBytesMatrix(matrix,sBoxMatrix){
	var tmpMatrix=copyMatrix(matrix);
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
		  tmpMatrix[i][j]=subBytesElement(matrix[i][j],sBoxMatrix);
		}
	}
  
  return tmpMatrix;
}


//logical XOR for each pare elements of two arrays
function xorArr(arr1,arr2){
  var tmpArr=[];
  for (var i = 0; i < arr1.length; i++) {
    (arr1[i]==arr2[i]) ? tmpArr[i]=0:tmpArr[i]=1;
  }
  
  return tmpArr;
}

function xorHex (string1, string2){
	var hex='';
	var arrValue1=[];
	var arrValue2=[];

	arrValue1=hex2arr(string1);
	arrValue2=hex2arr(string2);
	hex=arr2hex(xorArr(arrValue1,arrValue2));
	return hex;
}

function xorWord(matrix, wordNumber1,wordNumber2){
	var tmpMatrix=[];
	for (var i = 0; i < matrix.length; i++) {
		tmpMatrix[i]=xorHex(matrix[i][wordNumber1],matrix[i][wordNumber2]);
	}
	return tmpMatrix;
}

function xorMatrix(matrix1,matrix2){
	var tmpMatrix=[];
	for (var i = 0; i < 4; i++) {
		tmpMatrix.push([]);
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			tmpMatrix[i][j]=xorHex(matrix1[i][j],matrix2[i][j]);
		}
	}

	return tmpMatrix;
}

function shiftRows(matrix, order){
	var tmpMatrix=copyMatrix(matrix);
	for (var i = 0; i < matrix.length; i++) {
		var j=0;
		while(j<i){
			if(order){
				var tmp=tmpMatrix[i].shift();
				tmpMatrix[i].push(tmp);						
			}
			else {
				var tmp=tmpMatrix[i].pop();
				tmpMatrix[i].unshift(tmp);
			}
			j++;
		}
	}
	return tmpMatrix;
}


function mixColumns(matrix,mixColumnsMatrix){
	var tmpMatrix=[];
	for (var i = 0; i < 4; i++) {
		tmpMatrix.push([]);
	}
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			var el='';
			for (var k = 0; k < mixColumnsMatrix[i].length; k++) {
				if (mixColumnsMatrix[i][k]=='02') {
					tmp=arr2hex(mul02(hex2arr(matrix[k][j])));
				} 
				else if (mixColumnsMatrix[i][k]=='03') {
					tmp=arr2hex(mul03(hex2arr(matrix[k][j])));
				} 
				else if (mixColumnsMatrix[i][k]=='09') {
					tmp=arr2hex(mul09(hex2arr(matrix[k][j])));
				} 
				else if (mixColumnsMatrix[i][k]=='11') {
					tmp=arr2hex(mul11(hex2arr(matrix[k][j])));
				} 
				else if (mixColumnsMatrix[i][k]=='13') {
					tmp=arr2hex(mul13(hex2arr(matrix[k][j])));
				} 
				else if (mixColumnsMatrix[i][k]=='14') {
					tmp=arr2hex(mul14(hex2arr(matrix[k][j])));
				} 
				else
				tmp=matrix[k][j];

				if(!el){el=tmp}else el=xorHex(el,tmp);
			}
			tmpMatrix[i][j]=el;
		}
	}

	return tmpMatrix;
}


function pushWord2Matrix(word,matrix){
	var tmpMatrix=copyMatrix(matrix);
	for (var i = 0; i < matrix.length; i++) {
		tmpMatrix[i].push(word[i]);
	}
	return tmpMatrix;
}

function RConWord(matrix,RConArray,index, keyNumber){
	var tmpMatrix=copyMatrix(matrix);
	for (var i = 0; i < 4; i++) {
		
		if (i==0) {tmpArrayRCon=RConArray[keyNumber];}
			else {tmpArrayRCon='00';}

		tmpMatrix[i][index]=xorHex(tmpMatrix[i][index],tmpArrayRCon);
	}

	return tmpMatrix;
}

function gFunc(matrix, wordNumber,keyNumber){
	var tmpMatrix=copyMatrix(matrix);
	tmpMatrix=rotWord(tmpMatrix,wordNumber);
	tmpMatrix=subBytesWord(tmpMatrix,sBoxesMatrix,wordNumber);
	tmpMatrix=RConWord(tmpMatrix,RConArray,wordNumber,keyNumber);
	return tmpMatrix;
}

function getFirstKey(matrix){
	var tmpMatrix=[];
	for (var i = 0; i < 4; i++) {
		tmpMatrix.push([]);
	}

	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			tmpMatrix[i].push(matrix[i][j]);
		}
	}

	return tmpMatrix;
}

function getRoundKey(matrix,roundNumber){
	var tmpMatrix=copyMatrix(matrix);
	var tmp=copyMatrix(matrix);
	for (var i = 0; i < 4; i++) {
		var xorWord1=[];
		if (i==0) {
			tmp=gFunc(tmp,(tmpMatrix[i].length-1),roundNumber);
			xorWord1=xorWord(tmp, (tmpMatrix[i].length-1),(tmpMatrix[i].length-4));
		} else {
			xorWord1=xorWord(tmpMatrix, (tmpMatrix[i].length-1),(tmpMatrix[i].length-4));
		}
		tmpMatrix=pushWord2Matrix(xorWord1,tmpMatrix);
	}
	return tmpMatrix;
}

function getAllKeys(matrix){

  	var tmpKeys=getFirstKey(matrix);
  	for (var i = 0; i < rounds; i++) {
		tmpKeys=getRoundKey(tmpKeys,i);
  	}

	return tmpKeys;
}

function constructKey(matrix,roundNumber){

	var tmpMatrix=[];
	for (var i = 0; i < 4; i++) {
		tmpMatrix.push([]);
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			tmpMatrix[i][j]=matrix[i][j+(roundNumber*4)];
		}
	}
	return tmpMatrix;
}





function encrypt(){

  	//init
  	var keyText=document.getElementById("key").value;
	var messageText = document.getElementById("message").value;
  	var finalOutput=document.getElementById("scene");
  	document.getElementById("key_hex").value=keyText.str2hex();
  	document.getElementById("message_hex").value=messageText.str2hex();

  	var matrixKey=createMatrix(keyText.str2hex()); 	
	var matrixText=createMatrix(messageText.str2hex());

	keys=getAllKeys(matrixKey);
	var matrix=[];

	//initial round
	matrixKey=constructKey(keys,0);
	matrix=xorMatrix(matrixText,matrixKey);
		//console.log(matrix);

	for (var i = 1; i <= rounds; i++) {
		matrix=subBytesMatrix(matrix,sBoxesMatrix);
		matrix=shiftRows(matrix,true);
		
		if (i!=rounds) matrix=mixColumns(matrix,mixColumnsMatrix);

		
		matrixKey=constructKey(keys,i);

		matrix=xorMatrix(matrix,matrixKey);
		//if (i==10) {console.log(matrix);}

	}
	
	var encrypted=createString(matrix);
		//console.log(encrypted);
	finalOutput.innerHTML=encrypted;
    //var el1=document.getElementById("enc_message");
    //el1.value = finalOutput.innerHTML;
}

function decrypt(){
  //init
  var keyText=document.getElementById("key").value;
  var messageText = document.getElementById("enc_message").value;
  var finalOutput=document.getElementById("scene");
  finalOutput.innerHTML ="";
  var matrixText=createMatrix(messageText.str2hex());
  var matrixKey=createMatrix(keyText.str2hex());
  	keys=getAllKeys(matrixKey);
	var matrix=[];

	//initial round
	matrixKey=constructKey(keys,10);
	matrix=xorMatrix(matrixText,matrixKey);
		//console.log(matrix);

	for (var i = rounds - 1; i >= 0; i--) {
		
		matrix=shiftRows(matrix, false);
		matrix=subBytesMatrix(matrix,inverseSBoxesMatrix);
		matrixKey=constructKey(keys,i);
		matrix=xorMatrix(matrix,matrixKey);
		if (i!=0) matrix=mixColumns(matrix,inverseMixColumnsMatrix);
	}

	var decrypted=createString(matrix);
	finalOutput.innerHTML=decrypted;
}