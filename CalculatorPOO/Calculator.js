class Calculator {
    constructor() {
        //numero atual
        this.currentInput = "";
        //prox operador
        this.operator = null;
        //valor anterior p outros calculos
        this.previousInput = "";
    }

    //Adiciona um dígito a entrada atual
    appendNumber(number) {
        this.currentInput += number;
    }
    //define o operador para a próxima operação
    setOperator(operator) {
        if (this.currentInput === "") {
            return
        }
        this.operator = operator;
        this.previousInput = this.currentInput;
        this.currentInput = "";



    }

    //executa a operação com base no operador definido.
    calculate() {
        let calculo;
        if (this.previousInput === '' || this.currentInput === '') {
            console.log("Não é possível fazer essa operação")
            return
        }
        switch (this.operator) {
            case "+":
                calculo = parseFloat(this.previousInput) + parseFloat(this.currentInput);;
                break;
            case "-":
                calculo = parseFloat(this.previousInput) - parseFloat(this.currentInput);
                break;
            case "*":
                calculo = parseFloat(this.previousInput) * parseFloat(this.currentInput);;
                break;
            case "/":
                calculo = parseFloat(this.previousInput) / parseFloat(this.currentInput);;
                break;
            default:
                console.log("Só é possível realizar as 4 operações básicas (adição, subtração, multiplicação, divisão). Tente novamente!")
                return
        }
        console.log("O calculo é " + calculo);
        this.operator = null;
        this.previousInput = '';
        this.currentInput = '';

    }
}

const calculadora = new Calculator();

// soma
calculadora.appendNumber('25');
calculadora.setOperator('+');
calculadora.appendNumber('2');
calculadora.calculate();

//subtração 
calculadora.appendNumber('18');
calculadora.setOperator('-');
calculadora.appendNumber('13');
calculadora.calculate()

//multiplicação 
calculadora.appendNumber('9');
calculadora.setOperator('*');
calculadora.appendNumber('8');
calculadora.calculate()

//divisão
calculadora.appendNumber('13');
calculadora.setOperator('/');
calculadora.appendNumber('4');
calculadora.calculate()




