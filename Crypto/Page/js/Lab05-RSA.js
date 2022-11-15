//value to choose p and q from
const maxValue=100;


//rounds for finding a primary number
const maxRounds=100;


//generate random integer number from 0 to max, including 0 and max 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//pow method with 3 parameters - base, exp, base for modulo
function expmod( base, exp, mod ){
  if (exp == 0) return 1;
  if (exp % 2 == 0){
    return Math.pow( expmod( base, (exp / 2), mod), 2) % mod;
  }
  else {
    return (base * expmod( base, (exp - 1), mod)) % mod;
  }
}

//Miller-Rabin test for value_n with suggested witness
function millerRabinTest(value_n, witness){
    if (gcdex(value_n, witness)[0] > 1) return false;
 	var s=0;
 	value_copy=value_n-1;
 	while (value_copy % 2 == 0){
 		s++;
 		value_copy = value_copy/2;
 	}

 	var d = Math.floor((value_copy - 1)/2) ** s;
 	var x = Math.pow(witness, d) % value_n;
 	if ((x == 1)||(x == -1))  return true;
 	for (var i = 1; i <= s; i++) {
 		if (Math.pow(x,2**i)%value_n ==1) return false;
 		if (Math.pow(x,2**i)%value_n ==-1) return true;
 	}
   	return true;
}


//finding primality for number value_n with rounds number specified
function findPrimality(value_n,rounds){
	var tmpArray = new Array(1);
		var k=0;
		while (tmpArray.length<rounds) {
			var tmpWitness = getRandomInt(value_n-1)+2;
			tmp=millerRabinTest(value_n, tmpWitness);
			if (tmp) {
				tmpArray[k]=tmpWitness;
				k++;		
			} else return false;
		}
	return true;
}


//task 1 calculation
function go(){
    var value_n=parseInt(document.getElementById("n_value").value);
    var value_r=parseInt(document.getElementById("r_value").value);
    var prim=findPrimality(value_n, value_r);
    if(prim) {
    	document.getElementById("res").value="Просте, імовірність похибки "+((4**(-value_r)));
    } else {
    	document.getElementById("res").value="Складене";
    }
}


//keys generation mechanism
function generate(){
	var flag=true;
	var p=0;
	var q=0;
	var e=0;
	var d=0;
	while (flag){
		p=getRandomInt(maxValue-2)+2;
		var tmp=findPrimality(p, maxRounds); 
		if (tmp && (p !=0 )) {
			document.getElementById("p_value").value=p;
			flag=false;
		}
	}
	flag=true;
	while (flag){
		q=getRandomInt(maxValue-2)+2;
		var tmp=findPrimality(q, maxRounds); 
		if (tmp && (q != p )&&(q !=0 )) {
			document.getElementById("q_value").value=q;
			flag=false;
		}
	}
    var n=p*q;
    var fi=(p-1)*(q-1);

    flag=true;
	while (flag){
		e=getRandomInt(fi-2)+2;
		var tmp=gcdex(e, fi);
		if (tmp[0]==1) {
			document.getElementById("e_value").value=e;
			d=inverse_element(e,fi);
			document.getElementById("d_value").value=d;
			flag=false;
		}
	}
}


//value encryption mechanism
function encrypt(){
    var e=parseInt(document.getElementById("e_value").value);
    var p=parseInt(document.getElementById("p_value").value);
    var q=parseInt(document.getElementById("q_value").value);
    var value_x=parseInt(document.getElementById("x_value").value);
    var n=p*q;
    var coded=expmod(value_x,e,n);
    document.getElementById("res2").value=coded;
    document.getElementById("y_value").value=coded;
}


//value decryption mechanism
function decrypt(){
    var d=parseInt(document.getElementById("d_value").value);
    var p=parseInt(document.getElementById("p_value").value);
    var q=parseInt(document.getElementById("q_value").value);
    var value_y=parseInt(document.getElementById("y_value").value);
    var n=p*q;
    var decoded=expmod(value_y,d,n);
    document.getElementById("res3").value=decoded;
}