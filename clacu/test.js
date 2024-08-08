"use strict";
const keyPadSelector = document.getElementsByTagName("input");
const outputer = document.querySelector("#outputValue");
const calculator = document.querySelector(".Calculator");

//add event
( function () {
  for(let i = 0; i < keyPadSelector.length; i++){
// loop through input tag and add a click event on each
// which calls the calculation operation
    let inputer = keyPadSelector[i].getAttribute("value");
    keyPadSelector[i].addEventListener("click", event => {
// calculation operation
      if (inputer === null) return;
//declarations (key returnts the slected button)
      const key = event.target;
      const keyValue = key.value;
      const displayValue = outputer.value;
      const { previousKeyType } = calculator.dataset;
// reseting the value of c
      if ((Number(inputer) >= 0 && Number(inputer) <= 9) || inputer === ".") {
        const clearButton = calculator.querySelector("#clear");
        clearButton.value = "C";
      }
// input number: first check if the key clicked is a number
      if(Number(inputer) >= 0 && Number(inputer) <= 9) {
            if(displayValue === "0" || 
              previousKeyType === "operator" ||
              previousKeyType === "calculation" ||      
              previousKeyType === "percent"
            ){
// how number is handled on first of number click and 
//after operators and calculations have beeen performed
              outputer.value = keyValue;
            }else{
// number is handled on consecutive clicks
              outputer.value = displayValue + keyValue;  
            }
//setting the previous key clicked to number 
            calculator.dataset.previousKeyType = "number";
        }else if (inputer === "." ) {
//how decimal is handled
          if(
            previousKeyType === "operator"||
            previousKeyType === "calculation" 
          ){
//how decimal is handled after operations and equal
            outputer.value = "0."
          }else if( !displayValue.includes(".") ){   
//how decimal is handled on consecutive clicks         
            outputer.value = displayValue + keyValue;
          }
// setting previous key to decimal
          calculator.dataset.previousKeyType = "decimal";
        }else if (inputer === "=") {
//perform calculation after equal sign is pressed         
          let firstNumber = calculator.dataset.firstNumber;
          const operator = calculator.dataset.operator;
          let secondNumber = displayValue;
// create variables to store operation values
          if ((operator === 'plus' || 
            operator === 'minus' || 
            operator === 'times' || 
            operator === 'divide') && firstNumber
          ) {
// check type of operator and if first number exist
              if (previousKeyType === "calculation") {
// check if last button clicked was equal sign to perform
//repeted calculations when = is clicked
                firstNumber = displayValue;
//assign the number on screen as firstnumber evry time = is clicked
                secondNumber = calculator.dataset.modValue;
// create a variable to store modifying value, i.e the second number in the equation
// the set second number back to modifier every time = is clicked
              }
// display the calculated value on screen
            outputer.value = calculate(firstNumber, operator, secondNumber)
          }
//set modifier back to the second number called when = is pressed
//so that it can be used again when equal is pressed
          calculator.dataset.modValue = secondNumber;
//set previous selected key to calculation
          calculator.dataset.previousKeyType = "calculation";
        }else if (inputer === "AC") {
// clear
          if (
//check if previous key was clear or calculation
//so as to reset the values when clear is selected after calculatio
//i.e equal to
            previousKeyType === "clear" ||
            previousKeyType === "calculation" ||
            previousKeyType === "number" 
             ) {
//revert the clear key value to its original state 
// after operations have been completed 
// remove all memory value if clear is clicked after clear
//or calculation
            delete calculator.dataset.firstNumber 
            delete calculator.dataset.modValue 
            delete calculator.dataset.operator 
            delete calculator.dataset.previousKeyType
            delete calculator.dataset.modifier        
          }
          key.value= "AC";
          outputer.value = '0';
          calculator.dataset.previousKeyType = "clear";
        }else if(inputer === "⁺∕₋" ){
// perform negate operation
          outputer.value = calcu(displayValue, key.dataset.key);
//perform negate on output value directly then set 
// previous key to negate
          calculator.dataset.previousKeyType = "negate";
        }else if(inputer === "%"){
//perform percent
          outputer.value = calcu(displayValue, key.dataset.key);
//perform percent on output value directly then set 
// previous key to percent
          calculator.dataset.previousKeyType = "percent";
        }else{
// what we are left with are the operators
//so create memory variable, i.e variables that 
//holds number used in calculation
          let firstNumber = calculator.dataset.firstNumber;
//self invoking function I use to set second number 
//between modifier and displayvalue
          let secondNumber = displayValue;
// create a modifier for operations after clear
          const modifier = calculator.dataset.modifier;
//create an operator data attribute to store the type operator clicked in it
          const operator = calculator.dataset.operator;
//value i want to display when operator is clicked again after
//clear
          if (previousKeyType === "clear" &&
             calculator.dataset.modifier 
            ) {
            outputer.value = calculator.dataset.modifier
          }
//perform operation on values after
//operator is clicked 
          if (
            firstNumber &&   
            secondNumber &&
            previousKeyType !== "operator" &&
            previousKeyType !== "calculation" &&
            previousKeyType !== "clear"
            ) {
//first check if first number and second number exist
//the check if previous key is not operator & equal
            const calValue = calculate(firstNumber, operator, secondNumber);
            outputer.value = calValue;
            calculator.dataset.firstNumber = calValue;
          }else if(
            previousKeyType === "clear" &&
            calculator.dataset.modifier
            ){
//the value for first number if operator was clicked 
//after clear
            calculator.dataset.firstNumber = calculator.dataset.modifier
          }else{
//if first number doesnt exist set it to the displayed value
// or update firstnumber after every operation
            calculator.dataset.firstNumber = displayValue;
          }
// self invoking function I used to create modifier
            calculator.dataset.modifier = (function(){
            if (previousKeyType === "clear") return calculator.dataset.modifier
            if (previousKeyType !== "clear") return calculator.dataset.firstNumber
          })();     
// store the type operator clicked 
          calculator.dataset.operator = key.dataset.key;
// set previous key to operator
          calculator.dataset.previousKeyType = "operator";
        }
    });
  }
})();

// function for normal operator 
function calculate (x, operator, y) {
  x = parseFloat(x)
  y = parseFloat(y)
  
  let addition = precisionRound( x + y, 10);
  let subtraction = precisionRound( x - y, 10);
  let multiplication = precisionRound( x * y, 100);
  let divison = x / y;


  if (operator === 'plus'){
    if (addition.toString().length > 9) {
      return addition.toExponential(3); 
    } else{
      return addition;
    }
  }
  if (operator === 'minus'){
    if (subtraction.toString().length > 9) {
      return subtraction.toExponential(3); 
    } else{
      return subtraction;
    }
  }
  if (operator === 'times'){
    if (multiplication.toString().length > 9) {
      return multiplication.toExponential(3); 
    } else{
      return multiplication;
    }
  }
  if (operator === 'divide'){
    if (divison.toString().length > 9) {
      return divison.toExponential(3); 
    } else{
      return divison;
    }
  }
}
// function for percent and negate operator 
function calcu (x, operator) {
  x = parseFloat(x)
  let y = parseFloat(-1);
  let z = parseFloat(100);
  let negation = precisionRound(x * y, 150);
  let percentage = precisionRound(x / z, 150);


  if (operator === 'negate') return negation;
  if (operator === 'percnt'){
    if (percentage.toString().length > 9) {
      return percentage.toExponential(1); 
    } else{
      return percentage;
    }
  }
}
//MDN function
function precisionRound(number,precision){
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}