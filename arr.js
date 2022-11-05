console.log('line no 1',varName);
var varName=10;

function b(){
    console.log('line no 5',varName);
}
console.log('line no 7',varName);
function fun(){
    console.log('line no 9',varName);
    var varName=20;
    console.log('line no 11',varName);
    b();
}
fun();
console.log('line no 15',varName);

// 1 undefined
// 7 10
// 9 10
//11 20
// 5 10
//15 10