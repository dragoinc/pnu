function roughScale(x, base) {
  const parsed = parseInt(x, base);
  if (isNaN(parsed)) { return 0; }
  return parsed * 100;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}


function check(value, modulo){
	var res='';

	if ((Math.abs(modulo+1-2*Math.sqrt(modulo))<=value) &&
		((Math.abs(modulo+1-2*Math.sqrt(modulo))<=value)))
	
		res = 'Перевірка за алгоритмом Шуфа успішна!';
	 else 
		res='Перевірка за алгоритмом Шуфа неуспішна!';
	

	return res;
}

function countCycle(dot,a,modulo){
	var tmpArr=[];
	var nextDot=addDots(dot,dot,a,modulo);
	var counter=2;
	while (dot[0] != nextDot[0]){
		counter++;
		nextDot=addDots(dot,nextDot,a,modulo);
	}
	counter++;
	return counter;
}

function scalarDots(p,number,a,modulo){
	var nextDot=p;
	for (var i = 1; i < number; i++) {
		nextDot=addDots(p,nextDot,a,modulo);
	}
	return nextDot;
}

function scalarAllDots(p,a,modulo){
	var tmpArr=new Array(countCycle(p,a,modulo));
	for (var i = 0; i < tmpArr.length; i++) {
		
		tmpArr[i]=scalarDots(p,i,a,modulo);
	}
	//console.log(tmpArr);
	return tmpArr;
}

function addDots(p,q,a,modulo){
	var xp=p[0];
	var yp=p[1];
	var xq=q[0];
	var yq=q[1];

	var arr=[];
	var xr=0;
	var yr=0;
	var s=0;

	if ((xp!=xq)&&(yp!=yq)) {
		var num=yq-yp;
		var denom=xq-xp;
		var tmp=(num*inverse_element(denom,modulo))
		s=mod(tmp,modulo);
		xr=mod((s*s-xp-xq),modulo);
		yr=mod((s*(xp-xr)-yp),modulo);
	} else {
		s=mod(((3*xp*xp+a)*inverse_element((2*yp),modulo)),modulo);
		xr=mod(s*s-2*xp,modulo);
		yr=mod(s*(xp-xr)-yp,modulo);
	}

	arr.push(xr);
	arr.push(yr);

	return arr;
}


function task1_go(){
	var max=23;
	var arr=[];
	for (var x = 0; x < max; x++) {
		for (var y = 0; y < max; y++) {
			if ((y*y-(x*x*x+x+1))%max==0) {
				var tmpArr=[];
				tmpArr.push(x);
				tmpArr.push(y);
				arr.push(tmpArr);
			}
		}
	}
	console.log(arr);
	document.getElementById("check").value=check(arr.length,max);
	document.getElementById("n_value").value=arr.length;
}


function task2_go(){
		var value_x=parseInt(document.getElementById("x_value").value);
		var value_y=parseInt(document.getElementById("y_value").value);
		var value_a=parseInt(document.getElementById("a_value").value);
		var value_p=parseInt(document.getElementById("p_value").value);
		var value_n=countCycle([value_x,value_y],value_a,value_p);
		document.getElementById("n2_value").value=value_n;
}

function task3_go(){
	task2_go();
	var value_a=parseInt(document.getElementById("a_value").value);
	var value_n=parseInt(document.getElementById("n2_value").value);
	var value_x=parseInt(document.getElementById("x_value").value);
	var value_y=parseInt(document.getElementById("y_value").value);
	var value_p=parseInt(document.getElementById("p_value").value);
	var value_m=parseInt(document.getElementById("m_value").value);
	var value_d=getRandom(2,value_n-1);
	document.getElementById("d_value").value=value_d;
	var tmpArr=scalarAllDots([value_x,value_y],value_a,value_p);
	document.getElementById("Qx_value").value=tmpArr[value_d][0];
	document.getElementById("Qy_value").value=tmpArr[value_d][1];
	var value_k=getRandom(2,value_n-1);
	document.getElementById("k_value").value=value_k;
	
	var H=SHA1(value_m.toString());

	var h=calcBigMod(roughScale(H,16),1,value_n);
	var resSign=[];
	resSign=sign_EC(tmpArr,value_a,value_p,value_n,h,value_d,value_k);
	document.getElementById("r_value").value=resSign[0];
	document.getElementById("s_value").value=resSign[1];

	if ((resSign[0]==0)||(resSign[1]==0)) task3_go();
}


function sign_EC(allDots,a,modulo,value_n,value_h,value_d,value_k){
	var arrC=[];
	var value_r=0;
	var value_s=0;
	var resArr=[];
	arrC=allDots[value_k];
	value_r=arrC[0]%value_n;

	tmp=inverse_element(value_k,value_n);
	value_s=(((value_h+value_d*value_r)*tmp)%value_n);

	resArr.push(value_r);
	resArr.push(value_s);

	return resArr;
}

function verify_EC(){
		var value_r=parseInt(document.getElementById("r_value").value);
		var value_s=parseInt(document.getElementById("s_value").value);
		var value_m=parseInt(document.getElementById("m_value").value);
		var value_n=parseInt(document.getElementById("n2_value").value);
		var value_x=parseInt(document.getElementById("x_value").value);
		var value_y=parseInt(document.getElementById("y_value").value);
		var value_Qx=parseInt(document.getElementById("Qx_value").value);
		var value_Qy=parseInt(document.getElementById("Qy_value").value);
		var value_a=parseInt(document.getElementById("a_value").value);
		var value_p=parseInt(document.getElementById("p_value").value);

		var H=SHA1(value_m.toString());
		var h=calcBigMod(roughScale(H,16),1,value_n);
		var tmpArrP=scalarAllDots([value_x,value_y],value_a,value_p);
		var tmpArrQ=scalarAllDots([value_Qx,value_Qy],value_a,value_p);
		var u=mod((h*inverse_element(value_s,value_n)),value_n);
		var v=mod((value_r*inverse_element(value_s,value_n)),value_n);
		rPlus=value_r||addDots(tmpArrP[u],tmpArrQ[v],value_a,value_n)[0];

		document.getElementById("r_plus_value").value=rPlus;
		if (rPlus == value_r) {
			document.getElementById("check2").value="Підпис вірний!" 
		}
		else {
			document.getElementById("check2").value="Підпис невірний!" 

		}
}