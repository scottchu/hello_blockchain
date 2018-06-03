const fs = require("fs")
const path = require("path")

const solc = require("solc")
const Web3 = require("web3")

/*
  Solidity compile helper
*/
const compile = (filepath) => {
  const source = fs.readFileSync(filepath, 'utf8')
  const compiled = solc.compile(source)
  return compiled
}

/*
  Wrap codes in a main function for async/await purpose
*/
const main = async () => {
  // set Ganache address
  const url = "http://localhost:7545"

  // instantiate a new web3 instance with url
  const web3 = new Web3(url)

  // get the absolute file path
  const filepath = path.join(__dirname, "../contracts/Hello.sol")

  // load and compile the given contract file
  const code = compile(filepath)

  // get the contract
  const contract = code.contracts[":Hello"]

  // get the contract's abi (Application Binary Interface)
  const abi = contract.interface

  // parse the json interface from contract's abi
  const interface = JSON.parse(abi)

  // get the contract's byte code
  const bytecode = contract.bytecode

  // estimate the gas for contract
  const gasEstimate = await web3.eth.estimateGas({ data: bytecode })

  // load all existing accounts from web3
  const accounts = await web3.eth.getAccounts()

  /*
    create a new contract instance with all it's method
    and events defined in it's json interface

    data: the contracts bytecode
    from: the address transactions should be made from,
    gas: the maximum gas provided for the transaction
  */
  const hello = new web3.eth.Contract(
    interface,
    null,
    {
      data: bytecode,
      from: accounts[0],
      gas: gasEstimate
    }
  )

  // calling deploy methods on the contract
  const deployed = await hello
    .deploy()
    .send()

  // get the contract's address from the deployed contract
  const address = deployed
    .options
    .address

  console.log("================================================")
  console.log("Contract Deployed")
  console.log("Address: ", address)
  console.log("=================================================\n")

  // calling getGreeting on the contract and get the response
  const greeting1 = await deployed
    .methods
    .getGreeting()
    .call()

  console.log("================================================")
  console.log("Calling method 'getGreeting' before 'setGreeting'")
  console.log("Output: ", greeting1)
  console.log("================================================\n")

  /*
    calling setGreeting on the contract with given params
    and send it from a different account
  */
  await deployed
    .methods
    .setGreeting("Wasup!")
    .send({
      from: accounts[1]
    })

  /*
    calling getGreeting on the contract and expects the response
    to be different this time.
  */
  const greeting2 = await deployed
    .methods
    .getGreeting()
    .call()

  console.log("===============================================")
  console.log("Calling method 'getGreeting' after 'setGreeting'")
  console.log("Output: ", greeting2)
  console.log("================================================\n")
}

main()