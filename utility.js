/*
Name: jdkitson
Date: 02/17/2020
Purpose: Reusable functions for form data
*/

/*
*  This function will check the value of an input text
* It changes the style of a corresponding error span based on return
*
*
* */
function checkTextField(elem,error) {

    let flag = false;

    //Just for testing - alert(elem.value);
    //if the length value of the text field is blank - show error
    if (elem.value.length < 1) {
       // document.getElementById(elem.id+"Error").innerHTML = "You must enter your first and/or last name.";
        error.style.display = "inline";
    } else {
        //if they are not blank remove error text
       // document.getElementById(elem.id+"Error").innerHTML = "";
        error.style.display = "none";
        flag =  true;

    }
    return flag;
}
/*
*  This function will check the value of an input text
* It changes the style of a corresponding error span based on return
*
* Uses "formObj.nextElementSibling;" to get access to error object
* */
function checkTextField2(elemID) {

    let flag = false;

    //Just for testing - alert(elem.value);
    //if the length value of the text field is blank - show error
    //The eval() function evaluates JavaScript code represented as a string.
    //https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/eval
    let formObj = eval("document.getElementById('" + elemID + "')");
    let formObjError = formObj.nextElementSibling;
    if (formObj.value.length < 1) {
        // document.getElementById(elem.id+"Error").innerHTML = "You must enter your first and/or last name.";
        formObjError.style.display = "inline";
    } else {
        //if they are not blank remove error text
        // document.getElementById(elem.id+"Error").innerHTML = "";
        formObjError.style.display = "none";
        flag =  true;

    }
    return flag;
}
/*
*  This function will checks input text is numeric and has a max length
* It changes the style of a corresponding error span based on return
*
*
* */
function checkNumeric(checkNumber,error,max) {

    let flag = false;
    //Just for testing - alert(val.length);
    //if the length value of the text field is blank - show error

    if (isNaN(checkNumber.value) || checkNumber.value.length < max){
        error.style.display = "inline";

    } else {
        //if they are not blank remove error text
        error.style.display = "none";
        flag = true;

    }
    return flag;
}
/*
*  This function checks a selectbox
*  making sure it has a value
* Changes borderColor to red when this is false
*
* */
function checkQuantity(qtyOfItems,error) {
    let flag = (qtyOfItems.value.length > 0);

    if (flag){
        error.style.display = "none" ;

    }else{

        error.style.display = "inline" ;
    }

    return flag;
}
