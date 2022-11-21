//value to choose during randomizer
const maxValue=255;


//const 1B
const value02=27;


//get random value between 0 and maxValue
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//prepare text transforming string to an array
function prepare(text){
  var arr=[];
  arr=text.split("");
  return fixBinArray(arr);
}


//filling in leading zeros
function fixBinArray(array){
	while (array.length < 8){
		array.splice(0, 0, '0');
	}
	return array;
}


//logical XOR for each pare elements of two arrays
function xorArr(arr1,arr2){
  var tmpArr=[];
  for (var i = 0; i < arr1.length; i++) {
    (arr1[i]==arr2[i]) ? tmpArr[i]=0:tmpArr[i]=1;
  }
  
  console.log("XORed array:");
  console.log(tmpArr);
  return tmpArr;
}


//shifting array to the left 
function leftShiftArr(arr){
	var tmpArr = new Array(arr.length);

	for (var i = 0; i < tmpArr.length; i++) {
		tmpArr[i]=arr[i];
	}

	for (var i = 0; i < (tmpArr.length-1); i++) {
		tmpArr[i]=arr[i+1];
	}

	tmpArr[tmpArr.length-1]="0";

	console.log("Left shifted array:");
	console.log(tmpArr);
	return tmpArr;
}


//multiplying on hex 03
function mul03(array){

	var arr=mul02(array);
	console.log("Initial again array:");
	console.log(array);

	arr=xorArr(array,arr);
	return arr;
}


//multiplying on hex 02
function mul02(array){
	var b7_bit=array[0];
	var arr=[];
	arr=leftShiftArr(array);
	if (parseInt(b7_bit)){
		var tmpVal=value02;
   		var tmpArr=prepare(value02.toString(2));
		console.log("1B array:");
		console.log(tmpArr);

   		arr=xorArr(arr,tmpArr);
	}
	console.log("Transformed array:");
	console.log(arr);
	return arr;
}


//randomizer
function getRandom(){
	var random=getRandomInt(maxValue);
	if (!random) {random = 2;} else if (random==1) {random=2;}
	return random;
}


//main function for task 1 (mul02)
function go2(){
	var s=parseInt(document.getElementById("s2_value").value);
    if (!s) {
    	s=getRandom();
    	document.getElementById("s2_value").value=s;
    }

    var hex_s=s.toString(16);
   	document.getElementById("hex_s2_value").value=hex_s.toUpperCase();

    var bin_s=s.toString(2);
   	var arr1=prepare(bin_s);
   	console.log("Initial arr:");
   	console.log(arr1);

   	arr1=mul02(arr1);
   	
   	var res=arr1.join("").bin2hex().toUpperCase();
   	console.log(res);
   	
   	document.getElementById("res2_value").value=res.toUpperCase();
}


//main function for task 2 (mul03)
function go3(){

	var s=parseInt(document.getElementById("s3_value").value);
    if (!s) {
    	s=getRandom();
    	document.getElementById("s3_value").value=s;
    }

    var hex_s=s.toString(16);
   	document.getElementById("hex_s3_value").value=hex_s.toUpperCase();

    var bin_s=s.toString(2);
   	var arr1=prepare(bin_s);
   	console.log("Initial arr:");
   	console.log(arr1);

   	var arr2=mul03(arr1);

   	var res=arr2.join("").bin2hex().toUpperCase();
   	console.log(res);

   	document.getElementById("res3_value").value=res.toUpperCase();
}