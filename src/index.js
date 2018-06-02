const fs = require("fs")
const path = require("path")
const compiler = require("solc")

const filepath = path.join(__dirname, "../contracts/Hello.sol")
const sourceCode = fs.readFileSync(filepath).toString()

const compiledCode = compiler.compile(sourceCode)

const Hello = compiledCode.contracts[":Hello"]

const helloInterface = JSON.parse(Hello.interface)
const helloByteCode = Hello.bytecode

console.log(helloInterface, helloByteCode)