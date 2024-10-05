const crypto = require('crypto')
const bcrypt=require('bcrypt')
const value="maheshreddy"
const hashedval=crypto.createHash('sha256').update(value).digest('hex')
console.log(hashedval)

let valuenotfound=true
let initial=0
function getnonce(data){

    while(valuenotfound){
        const hashedval=crypto.createHash('sha256').update(data+initial.toString()).digest('hex')
        if(hashedval.startsWith("0000")){
            valuenotfound=false
            console.log("found",data+initial)
            return 
        }
        initial++
    }
}
const password= bcrypt.hash("mahesh",10)
console.log(password)