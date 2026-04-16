const isStrong = (password) => {
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let SpecialSymbols = ['!','@','#','$','%','&','*'];
    let HasSpecialSymbols = false;

    for (let x of password){
        if (x >= 'A' && x <= 'Z'){
            hasUppercase = true;
        }
        else if(x >= 'a' && x <= 'z'){
            hasLowercase = true;
        }
        else if (x >='0' && x <= '9'){
            hasDigit = true;
        }
        else if (SpecialSymbols.includes(x)){
            HasSpecialSymbols = true;
        }
    }

    return hasLowercase && hasUppercase && hasDigit && HasSpecialSymbols;   
}

module.exports = { isStrong };
