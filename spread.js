let obj={
    name:"amrit",
    roll:20
}

let obj2={
    name:"amit",
    roll:21
}

let obj3 ={
    name:"deepak",
    roll:22
}

let obj4={
    name:"shahshank",
    roll:62
}


let arr=[obj,obj2,obj3,obj4]

// let a = arr.filter((item)=>{
//     return (item.name.startsWith("a") || item.name.startsWith("d"))
// })

// console.log(a,arr);


let a=arr.reduce((acc,item)=>{
    return acc+item.roll
},0)

console.log(a);