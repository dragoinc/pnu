const maxValue2=30;

function modulus(num, denom){
    if (num%denom >= 0){
        return Math.abs(num%denom);
    }
    else{
        return num%denom + denom;
    }
}


function generate_p(){
	
	var p=0;
	var flag=true;
	while (flag){
		p=getRandomInt(maxValue2-2)+2;
		var tmp=findPrimality(p, maxRounds); 
		if (tmp && (p !=0 )) {
			flag=false;
		}
	}
	return p;
}

function getRandom(min,max) {
  while (true){
	  var tmp=Math.floor(Math.random() * max);
	  if ((tmp>min) && (tmp<max)) return tmp;
  }
}

function generate_g(value_p){
	var g=0;
	while (true){
		g=getRandom(2,value_p);
		if (is_generator(value_p,g)) {
			console.log(test_g(g,value_p));	
			return g;
		}
	}
}

function generate_x(value_p){
	return getRandom(2,value_p-1);
}

function generate_y(value_g, value_x, value_p){
	return expmod(value_g, value_x, value_p);
}

function test_g(g,p){
	var tmpArr=[];
	for (var i = 1; i < p-1; i++) {
		tmpArr.push(expmod(g,i,p));
	}
	tmpArr.sort();
	console.log(tmpArr);
	if (tmpArr.length == p-2) return true;
	return false;
}


function is_generator(p,g){
	for (var i = 1; i < p-1; i++) {
		if (expmod(g,i,p)==1) return false;
	}
	return true;
}


function go(){
    var value_p=generate_p();
    document.getElementById("p_value").value=value_p;
    var value_g=generate_g(value_p);
	document.getElementById("g_value").value=value_g;
    var value_a=parseInt(document.getElementById("a_value").value);
    var value_b=parseInt(document.getElementById("b_value").value);

	var a_pass=expmod(value_g,value_a,value_p);
	var b_pass=expmod(value_g,value_b,value_p);

    document.getElementById("a_pass_value").value=a_pass;
    document.getElementById("b_pass_value").value=b_pass;
	var alice_secret_value=expmod(a_pass,value_b,value_p);
	var bob_secret_value=expmod(b_pass,value_a,value_p);

    document.getElementById("alice_secret_value").value=alice_secret_value;
    document.getElementById("bob_secret_value").value=bob_secret_value;

}

function generate2(){
    var value_p=parseInt(document.getElementById("p_value").value);
    var value_g=parseInt(document.getElementById("g_value").value);
    if(!((value_p)&&(value_g))) return;

    var value_x=generate_x(value_p);
	document.getElementById("x_value").value=value_x;
    var value_y=generate_y(value_g,value_x,value_p);
	document.getElementById("y_value").value=value_y;
	var value_m=getRandom(1,value_p-1);
	document.getElementById("m_value").value=value_m;

}

function encrypt(){
    var value_p=parseInt(document.getElementById("p_value").value);
    var value_g=parseInt(document.getElementById("g_value").value);
    var value_x=parseInt(document.getElementById("x_value").value);
    var value_y=parseInt(document.getElementById("y_value").value);
    var value_m=parseInt(document.getElementById("m_value").value);

	if(!((value_p)&&(value_g)&&(value_x)&&(value_y)&&(value_m))) return;
	value_k = getRandom(1, value_p-1);
	var a_cipher=expmod(value_g, value_k, value_p);
	document.getElementById("a_cipher").value=a_cipher;
	document.getElementById("a_cipher_2").value=a_cipher;
	var b_cipher=modulus((Math.pow(value_y,value_k)*value_m),value_p);
	document.getElementById("b_cipher").value=b_cipher;
	document.getElementById("b_cipher_2").value=b_cipher;
}

function decrypt(){
	var value_p=parseInt(document.getElementById("p_value").value);
	var value_g=parseInt(document.getElementById("g_value").value);
	var value_x=parseInt(document.getElementById("x_value").value);
	var a_cipher=parseInt(document.getElementById("a_cipher_2").value);
	var b_cipher=parseInt(document.getElementById("b_cipher_2").value);
	if(!((value_p)&&(value_g)&&(a_cipher)&&(b_cipher)&&(value_x))) return;
	var res = modulus(b_cipher*(Math.pow(a_cipher,(value_p - 1 - value_x))),value_p)
	document.getElementById("res").value=res;
}