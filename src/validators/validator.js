const isValid = function (value) {
    if (typeof value === undefined || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
} 



const isValidName = function (name){
    if(!(/^[a-z ,.'-]+$/i.test(name))){
       return false
    }
    return true
}

const isValiduserName = function (name){
    if(!(/^[A-Za-z][A-Za-z0-9_]{7,29}$/i.test(name))){
       return false
    }
    return true
}


const isValidEmail = function (value) {
    if (!(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value))) {
        return false
    }
    return true
}

const isValidNumber = function (value) {
  
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value))) {
            
        return false
    }
    return true
}


const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}


const isValidPassword = function(value) {
    if(!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(value))) {
        return false
    }
    return true
}



module.exports = { isValid ,  isValidEmail , isValidNumber , isValidBody, isValidPassword , isValidName , isValiduserName}