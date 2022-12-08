function calcBigMod(base,exp,mod){
	var tmpExp=exp;
	var res=1;
	var finalRes=1;
	var tmpValue=4;
	var arr=[];

	while (tmpExp>tmpValue){
		res=Math.pow(base,tmpValue)%mod;
		arr.push(res);
		tmpExp=tmpExp-tmpValue;
	}
	res=Math.pow(base,tmpExp)%mod;
	arr.push(res);

	for (i=0;i<arr.length;i++){
		finalRes=finalRes*arr[i];
	}
	finalRes=finalRes%mod;

	return finalRes;
}

function generate_parameters(){
    var value_p=generate_p();
    document.getElementById("p_value").value=value_p;
    var value_g=generate_g(value_p);
	document.getElementById("g_value").value=value_g;
    var value_x=generate_x(value_p);
	document.getElementById("x_value").value=value_x;
    var value_y=generate_y(value_g,value_x,value_p);
	document.getElementById("y_value").value=value_y;
	var value_m=getRandom(1,value_p-1);
	document.getElementById("m_value").value=value_m;
	
	var flag = true;
	while (flag){
		value_k=getRandom(2,value_p-3);
		var tmp=findPrimality(value_k, maxRounds); 
		if (tmp && (value_k !=0 )) {
			document.getElementById("k_value").value=value_k;
			flag=false;
		}
	}
}


function sign(){
	var value_g=parseInt(document.getElementById("g_value").value);
	var value_p=parseInt(document.getElementById("p_value").value);
	var value_x=parseInt(document.getElementById("x_value").value);
	var value_y=parseInt(document.getElementById("y_value").value);
	var value_k=parseInt(document.getElementById("k_value").value);
	var value_m=parseInt(document.getElementById("m_value").value);
	
	var value_r=real_mod(Math.pow(value_g,value_k),value_p);
	document.getElementById("r_value").value=value_r;
	var value_s=real_mod((value_m - value_x*value_r)*(inverse_element(value_k,value_p-1)), (value_p-1));
	document.getElementById("s_value").value=value_s;
	if ((value_r==0)||(value_s==0)){
		generate_parameters();
		sign()
	}

}

function verify(){
	
	var value_g=parseInt(document.getElementById("g_value").value);
	var value_p=parseInt(document.getElementById("p_value").value);
	var value_x=parseInt(document.getElementById("x_value").value);
	var value_y=parseInt(document.getElementById("y_value").value);
	var value_k=parseInt(document.getElementById("k_value").value);
	var value_m=parseInt(document.getElementById("m_value").value);
	var value_r=parseInt(document.getElementById("r_value").value);
	var value_s=parseInt(document.getElementById("s_value").value);

	if ((value_r>0) && (value_r<value_p)) {console.log("r is OK");} else {console.log("value_r is not OK");}
	if ((value_s>0) && (value_s<(value_p-1))) {console.log("s is OK");} else {console.log("value_s is not OK");}

	var res_left=real_mod(Math.pow(value_g,value_m),value_p);
	document.getElementById("res_left").value=res_left;
	var res_right=calcBigMod(value_y,value_r,value_p)*calcBigMod(value_r,value_s,value_p)%value_p;
	document.getElementById("res_right").value=res_right;

	if (res_left==res_right){
		document.getElementById("result").value="Підпис вірний!";		
	} else {
		document.getElementById("result").value="Підпис невірний!";		
	}
}