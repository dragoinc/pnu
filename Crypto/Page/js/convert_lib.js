//convert string to hex
String.prototype.str2hex = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex;
    }

    return result
}

//convert hex to string
String.prototype.hex2str = function(){
    var j;
    var hexes = this.match(/.{1,2}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}


//convert string to bin
String.prototype.str2bin = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += parseInt(hex, 16).toString(2).padStart(8, '0');
    }

    return result
}

//bin to string
String.prototype.bin2str = function(){
    var j;
    var bins = this.match(/.{1,8}/g) || [];
    var back = "";
    var tmp;
    for(j = 0; j<bins.length; j++) {
        tmp = parseInt(bins[j], 2).toString(16);
        back += String.fromCharCode(parseInt(bins[j], 2));
    }

    return back;
}

//convert bin to hex
String.prototype.bin2hex = function(){
    var j;
    var bins = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<bins.length; j++) {
        back += parseInt(bins[j], 2).toString(16);

    }

    return back;
}


//convert hex to bin
String.prototype.hex2bin = function(){
    var j;
    var hexes = this.match(/.{1,2}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += (parseInt(hexes[j], 16).toString(2)).padStart(8, '0');
    }
    return back;
}

//hex value to bin array
function hex2arr(string){
    var arr=[];
    arr=Array.from(string.hex2bin());
    return arr;
}

//bin array to hex value
function arr2hex(arr){
    var str='';
    str=arr.join('');

    return str.bin2hex();
}