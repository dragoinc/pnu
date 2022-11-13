// real mofulo function
//Javascript has unique function for module calculation =>
// r = a - (n * trunc(a/n))
//while Python and other languages have this implemented as
//r = a - (n * floor(a/n))
// This is why we need to reimplement the "remainder" operator (%)
function real_mod (value_a,value_b){
    return value_a - (value_b * Math.floor(value_a/value_b))
}

// Greatest common divisor calculation
function gcdex(value_a, value_b){
    var tmpA0=value_a;
    var tmpA1=value_b;
    var tmpX0=1;
    var tmpX1=0;

    var tmpY0=0;
    var tmpY1=1;

    var tmp=0;
    while (tmpA1 != 0) {
        var t_0=tmpA0;
        var t_1=tmpA1;

        tmp = Math.floor(tmpA0/tmpA1);

        t_0=tmpA1;
        t_1=tmpA0-tmpA1*tmp;
        tmpA0=t_0;
        tmpA1=t_1;

        t_0=tmpX1;
        t_1=tmpX0-tmpX1*tmp;
        tmpX0=t_0;
        tmpX1=t_1;

        t_0=tmpY1;
        t_1=tmpY0-tmpY1*tmp;
        tmpY0=t_0;
        tmpY1=t_1;
    }
    var tmpArr= {};
    tmpArr[0]=tmpA0;
    tmpArr[1]=tmpX0;
    tmpArr[2]=tmpY0;
    return tmpArr;
} 

//Inverting an element using Eueler's totient function
function inverse_element_2(value_a,value_b){
    var fi = phi(value_b);
    var tmp=real_mod(Math.pow(value_a,(fi-1)),value_b);
    return tmp;
}


//Inverting an element using GCD calculation
function inverse_element(value_a,value_b){
    var tmpArr=gcdex(value_a, value_b);
    if (tmpArr[0]==1) {
        return real_mod(tmpArr[1],value_b);
    } else {
        return "Введені числа не є взаємно простими!"      
    }
}

//Eueler's totient function calculation
function phi(value_a) {
    let result = 1;
    for (let i = 2; i < value_a; i++){
        var tmpArr=gcdex(i, value_a);
        if (tmpArr[0] == 1)
            result++;        
    }
    return result;
}

//Calculation 1
function goOne(){
    var value_a=parseInt(document.getElementById("a_value").value);
    var value_b=parseInt(document.getElementById("b_value").value);
    var arr=gcdex(value_a, value_b);
    document.getElementById("d_value").value=arr[0];
    document.getElementById("x_value").value=arr[1];
    document.getElementById("y_value").value=arr[2];
}


//Calculation 2
function goTwo(){
    var value_a=parseInt(document.getElementById("a2_value").value);
    var value_n=parseInt(document.getElementById("n2_value").value);
    var res=inverse_element(value_a, value_n);
    document.getElementById("res2").value=res;
}


//Calculation 3
function goThree(){
    var value_a=parseInt(document.getElementById("a3_value").value);
    var res=phi(value_a);
    document.getElementById("res3").value=res;
}


//Calculation 4
function goFour(){
    var value_a=parseInt(document.getElementById("a4_value").value);
    var value_n=parseInt(document.getElementById("n4_value").value);
    var res=inverse_element_2(value_a, value_n);
    document.getElementById("res4").value=res;
}