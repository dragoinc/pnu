const maxValue=1000;
const maxRounds=100;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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


function findPrimality(value_n,rounds){
	var tmpArray = new Array(1);
		var k=0;
		while (tmpArray.length<rounds) {
			var tmpWitness = getRandomInt(value_n-1)+1;
			//console.log("witness="+tmpWitness);
			tmp=millerRabinTest(value_n, tmpWitness);
			//console.log("miller="+tmp);

			if (tmp) {
				tmpArray[k]=tmpWitness;
				k++;		
			} else return false;
		}
	if (tmpArray.length >0) {
		console.log("Witnesses:")
		console.log(tmpArray);
	}
	return true;
}


function phi(value_a){
	var tmpInput=value_a;
	var tmpArray={};
	var i = 2;
	var k = 0;
	while (value_a%i == 0) {
		value_a=Math.floor(value_a/i);
		k++;
	}
	if (k > 0) {
		tmpArray[i] = k;
	}
	i=3;
	var break_flag = false;
	while (i*i<=value_a){
		var k = 0;
		for (var el in tmpArray) {
			if (i*i>value_a) {
				break_flag = true;
				break;
			}
			if (i%el==0) {
				i++;
				i++;
			}
		}
		if (break_flag) break;
		
		while (value_a % i==0){
			value_a=Math.floor(value_a/i);
			k++;
		}
		if (k>0) {tmpArray[i]=k;}
		
		i++;i++;
	}
	var res = tmpInput;
	if (value_a != 1) {tmpArray[value_a]=1;}
	for (var el in tmpArray) {
		res = res*(1-(1/el));
	}
	return Math.trunc(res);
}

//Calculation 1
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

function generate(){
		var flag=true;
		var p=0;
		var q=0;
		while (flag){
			p=getRandomInt(maxValue);
    		if (findPrimality(p, maxRounds) && (p !=0 )) {
    			document.getElementById("p_value").value=p;
    			flag=false;
    		}
		}
		flag=true;
		while (flag){
			q=getRandomInt(maxValue);
    		if (findPrimality(q, maxRounds) && (q != p )&&(q !=0 )) {
    			document.getElementById("q_value").value=q;
    			flag=false;
    		}
		}
}

function encrypt(){
    var value_p=parseInt(document.getElementById("p_value").value);
    var value_q=parseInt(document.getElementById("q_value").value);
    var n=value_p*value_q;
    var fi=(value_p-1)*(value_q-1);
    var flag=true;
    var e=3;
    var d=gcdex(e,fi);
    console.log(d[0]);
}