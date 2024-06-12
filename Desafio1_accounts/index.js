const inquirer = require('inquirer');
const chalk = require('chalk')
const fs = require('fs')
operacao();

//funcao principal para setar as opções e mapear para as devidas funções
function operacao() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Qual operacão deseja realizar?',
            choices: [
                'Criar conta',
                'Ver saldo',
                'Depositar',
                'Sacar',
                'Transferencia',
                'Sair'
            ],
        },
    ]).then((answer) => {
        const action = answer['action']
        switch (action) {
            case 'Criar conta':
                BoasVindas();
                break;
            case 'Ver saldo':
                VerSaldo();
                break;
            case 'Depositar':
                Depositar();
                break;
            case 'Sacar':
                Sacar();
                break;
            case 'Transferencia':
                Transferencia();
                break;
            case 'Sair':
                console.log(chalk.yellow('Saindo... :('))
                process.exit()
        }
    }).catch((err) => console.log(err))
}

//funcão so para dar uma mensagem de boas vindas ao escolher a opção de criar conta
function BoasVindas() {
    console.log(chalk.bgYellow.black('Seja bem vindo ao banco TITAN'))
    console.log(chalk.yellow('Defina as opções da sua conta: '))
    CriarConta()
}

//funcao que cria uma conta
function CriarConta() {
    inquirer.prompt([
        {
            name: 'NomeDaConta',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        console.info(answer['NomeDaConta'])
        if (!fs.existsSync('Contas')) {
            fs.mkdirSync('Contas')
        }
        if (fs.existsSync(`Contas/${answer['NomeDaConta']}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, por favor escolha outro nome!'))
            CriarConta();
            return
        }
        fs.writeFileSync(`Contas/${answer['NomeDaConta']}.json`, '{"saldo": 0}', function (err) { console.log(err) },)
        console.log(chalk.yellow('Parabéns, sua conta TITAN foi criada!'))
        operacao()
    }).catch((err) => console.log(err))
}

//funcao para realizar o depósito
function Depositar() {
    inquirer.prompt([
        {
            name: 'NomeDaConta',
            message: 'Qual é o nome da sua conta?'
        }
    ]).then((answer) => {
        const NomeDaConta = answer['NomeDaConta']
        if (!VerificarConta(NomeDaConta)) {
            console.log(chalk.bgRed.black('Essa conta não existe, escolha outra conta!'))
            return Depositar();
        }

        inquirer.prompt([
            {
                name: 'Saldo',
                message: 'Quanto você deseja depositar?'
            },
        ]).then((answer) => {
            const saldo = answer['Saldo']
            AdicionarSaldo(NomeDaConta, saldo)
            operacao()

        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
}

//funcao para verificar se uma conta já existe
function VerificarConta(NomeDaConta) {
    if (!fs.existsSync(`Contas/${NomeDaConta}.json`)) {
        return false
    }
    return true
}

//funcao para adicionar Saldo
function AdicionarSaldo(NomeDaConta, saldo) {
    const conta = PegarConta(NomeDaConta)

    if (!saldo) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde.'))
        return Depositar()
    }
    conta.saldo = parseFloat(saldo) + parseFloat(conta.saldo)
    fs.writeFileSync(`Contas/${NomeDaConta}.json`, JSON.stringify(conta), function (err) { console.log(err) })
    console.log(chalk.yellow(`Foi depositado o valor de R$${saldo} na sua conta`))
}

//Funcao para pegar uma conta na pasta de contas
function PegarConta(NomeDaConta) {
    const contaJSON = fs.readFileSync(`Contas/${NomeDaConta}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })
    return JSON.parse(contaJSON)
}

//Funcao para imprimir o saldo atual
function VerSaldo() {
    inquirer.prompt([
        {
            name: 'NomeDaConta',
            message: 'Digite o nome da sua conta: '
        }
    ]).then((answer) => {
        const NomeDaConta = answer['NomeDaConta']
        if (VerificarConta(NomeDaConta)) {
            const conta = PegarConta(NomeDaConta)
            console.log(`O saldo da sua conta é: R$${conta.saldo}`)
            return operacao()
        }
        console.log('Não existe uma conta com esse nome, tente novamente!')
        return operacao()
    }).catch((err) => { console.log(err) })
}

//funcao para Sacar
function Sacar() {
    inquirer.prompt([
        {
            name: 'NomeDaConta',
            message: 'Digite o nome da sua conta: '
        }
    ]).then((answer) => {
        const NomeDaConta = answer['NomeDaConta']
        if (!VerificarConta(NomeDaConta)) {
            console.log("Infelizmente, não existe uma conta com esse nome, tente novamente!")
            operacao()
            return
        }
        const conta = PegarConta(NomeDaConta)
        inquirer.prompt([
            {
                name: 'Saque',
                message: 'Qual valor deseja sacar?'

            }
        ]).then((answer) => {
            const Saque = answer['Saque']
            if (Saque > conta.saldo) {
                console.log(chalk.bgRed.black("Infelizmente na sua conta não tem esse saldo disponível para saque, tente novamente!"))
                Sacar();
                return
            } else if (Saque <= 0 || !Saque) {
                console.log(chalk.bgRed.black("Não é possível sacar esse valor, tente novamente!"))
                Sacar();
                return
            } else {
                conta.saldo = parseFloat(conta.saldo) - parseFloat(Saque)
                fs.writeFileSync(`Contas/${NomeDaConta}.json`, JSON.stringify(conta), function (err) { console.log(err) })
                console.log(chalk.yellow(`Foi sacado o valor de R$${Saque} da sua conta. Saldo atual:R$${conta.saldo}`))
                operacao();
            }
        }).catch((err) => { console.log(err) })
    }).catch((err) => { console.log(err) })
}

function Transferencia() {
    inquirer.prompt([
        {
            name: 'NomeDaConta',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer => {
        const NomeDaConta = answer['NomeDaConta']
        if (!VerificarConta(NomeDaConta)) {
            console.log(chalk.bgRed("Infelizmente, não existe uma conta com esse nome, tente novamente!"))
            operacao()
            return
        }
        const contaTranferir = PegarConta(NomeDaConta)
        inquirer.prompt([
            {
                name: 'NomeDaContaTransferir',
                message: 'Qual o nome da conta que deseja transferir?'
            }
        ]).then((answer => {
            const NomeDaContaTransferir = answer['NomeDaContaTransferir']
            if (!VerificarConta(NomeDaContaTransferir)) {
                console.log("Infelizmente, não existe uma conta com esse nome, tente novamente!")
                operacao()
                return
            }
            const contaTranferida = PegarConta(NomeDaContaTransferir)

            inquirer.prompt([
                {
                    name: 'ValorTransferido',
                    message: 'Qual valor deseja transferir?'
                }

            ]).then(answer => {
                const ValorTransferido = answer['ValorTransferido']
                if (ValorTransferido > contaTranferir.saldo) {
                    console.log(chalk.bgRed.black("Infelizmente na sua conta não tem esse saldo disponível para saque, tente novamente!"))
                    Transferencia();
                    return
                } else if (ValorTransferido <= 0 || !ValorTransferido) {
                    console.log(chalk.bgRed.black("Não é possível sacar esse valor, tente novamente!"))
                    Transferencia();
                    return
                } else {
                    contaTranferir.saldo = parseFloat(contaTranferir.saldo) - parseFloat(ValorTransferido)
                    fs.writeFileSync(`Contas/${NomeDaConta}.json`, JSON.stringify(contaTranferir), function (err) { console.log(err) })

                    contaTranferida.saldo = parseFloat(contaTranferida.saldo) + parseFloat(ValorTransferido)
                    fs.writeFileSync(`Contas/${NomeDaContaTransferir}.json`, JSON.stringify(contaTranferida), function (err) { console.log(err) })

                    console.log(chalk.yellow(`Foi transferido  o valor de R$${ValorTransferido} da sua conta para ${NomeDaContaTransferir}`))
                    operacao();
                }
            }).catch((err) => { console.log(err) })
        })).catch((err) => { console.log(err) })
    })).catch((err) => { console.log(err) })
}