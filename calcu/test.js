"use strict";
const keyPadSelector = document.getElementsByTagName("input");
const outputText = document.querySelector("#outputValue");
const calculator = document.querySelector(".Calculator");

//add event
(function () {
  for (let i = 0; i < keyPadSelector.length; i++) {
    // loop through input tag and add a click event on each
    // which calls the calculation operation
    let inputText = keyPadSelector[i].getAttribute("value");
    keyPadSelector[i].addEventListener("click", (event) => {
      // calculation operation
      if (inputText === null) return;
      //declarations (key returns the selected button)
      const key = event.target;
      const keyValue = key.value;
      const displayValue = outputText.value;
      const { previousKeyType } = calculator.dataset;
      // resetting the value of c
      if (
        (Number(inputText) >= 0 && Number(inputText) <= 9) ||
        inputText === "."
      ) {
        const clearButton = calculator.querySelector("#clear");
        clearButton.value = "C";
      }
      // input number: first check if the key clicked is a number
      if (Number(inputText) >= 0 && Number(inputText) <= 9) {
        if (
          displayValue === "0" ||
          previousKeyType === "operator" ||
          previousKeyType === "calculation" ||
          previousKeyType === "percent"
        ) {
          // how number is handled on first of number click and
          //after operators and calculations have been performed
          outputText.value = keyValue;
        } else if (outputText.value.toString().length < 9) {
          // number is handled on consecutive clicks
          outputText.value = displayValue + keyValue;
        }
        //setting the previous key clicked to number
        calculator.dataset.previousKeyType = "number";
      } else if (inputText === ".") {
        //how decimal is handled
        if (
          previousKeyType === "operator" ||
          previousKeyType === "calculation"
        ) {
          //how decimal is handled after operations and equal
          outputText.value = "0.";
        } else if (
          !displayValue.includes(".") &&
          outputText.value.toString().length < 9
        ) {
          //how decimal is handled on consecutive clicks
          outputText.value = displayValue + keyValue;
        }
        // setting previous key to decimal
        calculator.dataset.previousKeyType = "decimal";
      } else if (inputText === "=") {
        //perform calculation after equal sign is pressed
        let firstNumber = calculator.dataset.firstNumber;
        const operator = calculator.dataset.operator;
        let secondNumber = displayValue;
        // create variables to store operation values
        if (
          (operator === "plus" ||
            operator === "minus" ||
            operator === "times" ||
            operator === "divide") &&
          firstNumber
        ) {
          // check type of operator and if first number exist
          if (previousKeyType === "calculation") {
            // check if last button clicked was equal sign to perform
            //repeated calculations when = is clicked
            firstNumber = displayValue;
            //assign the number on screen as first number every time = is clicked
            secondNumber = calculator.dataset.modValue;
            // create a variable to store modifying value, i.e the second number in the equation
            // the set second number back to modifier every time = is clicked
          }
          // display the calculated value on screen
          outputText.value = calculate(firstNumber, operator, secondNumber);
        }
        //set modifier back to the second number called when = is pressed
        //so that it can be used again when equal is pressed
        calculator.dataset.modValue = secondNumber;
        //set previous selected key to calculation
        calculator.dataset.previousKeyType = "calculation";
      } else if (inputText === "AC") {
        // clear
        if (
          //check if previous key was clear or calculation
          //so as to reset the values when clear is selected after calculation
          //i.e equal to
          previousKeyType === "clear" ||
          previousKeyType === "calculation" ||
          previousKeyType === "number"
        ) {
          //revert the clear key value to its original state
          // after operations have been completed
          // remove all memory value if clear is clicked after clear
          //or calculation
          delete calculator.dataset.firstNumber;
          delete calculator.dataset.modValue;
          delete calculator.dataset.operator;
          delete calculator.dataset.previousKeyType;
          delete calculator.dataset.modifier;
        }
        key.value = "AC";
        outputText.value = "0";
        calculator.dataset.previousKeyType = "clear";
      } else if (inputText === "⁺∕₋") {
        // perform negate operation
        outputText.value = compute(displayValue, key.dataset.key);
        //perform negate on output value directly then set
        // previous key to negate
        calculator.dataset.previousKeyType = "negate";
      } else if (inputText === "%") {
        //perform percent
        outputText.value = compute(displayValue, key.dataset.key);
        //perform percent on output value directly then set
        // previous key to percent
        calculator.dataset.previousKeyType = "percent";
      } else {
        // what we are left with are the operators
        //so create memory variable, i.e variables that
        //holds number used in calculation
        let firstNumber = calculator.dataset.firstNumber;
        //self invoking function I use to set second number
        //between modifier and display value
        let secondNumber = displayValue;
        // create a modifier for operations after clear
        const modifier = calculator.dataset.modifier;
        //create an operator data attribute to store the type operator clicked in it
        const operator = calculator.dataset.operator;
        //value i want to display when operator is clicked again after
        //clear
        if (previousKeyType === "clear" && calculator.dataset.modifier) {
          outputText.value = calculator.dataset.modifier;
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
          outputText.value = calValue;
          calculator.dataset.firstNumber = calValue;
        } else if (previousKeyType === "clear" && calculator.dataset.modifier) {
          //the value for first number if operator was clicked
          //after clear
          calculator.dataset.firstNumber = calculator.dataset.modifier;
        } else {
          //if first number doesn't exist set it to the displayed value
          // or update first number after every operation
          calculator.dataset.firstNumber = displayValue;
        }
        // self invoking function I used to create modifier
        calculator.dataset.modifier = (function () {
          if (previousKeyType === "clear") return calculator.dataset.modifier;
          if (previousKeyType !== "clear")
            return calculator.dataset.firstNumber;
        })();
        // store the type operator clicked
        calculator.dataset.operator = key.dataset.key;
        // set previous key to operator
        calculator.dataset.previousKeyType = "operator";
      }
    });
  }
})();

const compute = (x, operator) => {
  x = parseFloat(x);
  if (isNaN(x)) {
    return "Error";
  }

  switch (operator) {
    case "negate":
      return -x;
    case "percent":
      const percentage = x / 100;
      const threshold = 1e-9; // adjust this value to control the threshold
      if (Math.abs(percentage) < threshold) {
        return percentage.toExponential(1);
      } else {
        return percentage.toString().length > 9
          ? percentage.toPrecision(3)
          : percentage;
      }
    default:
      return "Error";
  }
};

const operations = {
  plus: (x, y) => x + y,
  minus: (x, y) => x - y,
  times: (x, y) => x * y,
  divide: (x, y) => {
    if (y === 0) {
      return "Error";
    }
    return x / y;
  },
};

const calculate = (x, operator, y) => {
  const num1 = parseFloat(x);
  const num2 = parseFloat(y);
  const result = operations[operator](num1, num2);

  if (
    !operations[operator] ||
    isNaN(result) ||
    result === Infinity ||
    result === -Infinity
  ) {
    return "Error";
  }

  const negativeThreshold = 1e-7;
  const threshold = 1e8;

  switch (operator) {
    case "divide":
      if (Math.abs(result) < negativeThreshold) {
        return result.toExponential(1);
      } else {
        return result.toString().length > 9 ? result.toPrecision(3) : result;
      }
    case "times":
      if (Math.abs(result) > threshold) {
        return result.toExponential(1);
      } else {
        return result;
      }
    case "plus":
      if (Math.abs(result) > threshold) {
        return result.toExponential(1);
      } else {
        return result;
      }
    case "minus":
      if (Math.abs(result) < negativeThreshold) {
        return result.toExponential(1);
      } else {
        return result.toString().length > 9 ? result.toPrecision(1) : result;
      }
    default:
      return typeof result === "number" && result.toString().length > 9
        ? result.toExponential(4)
        : result || 0;
  }
};
