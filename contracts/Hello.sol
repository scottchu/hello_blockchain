pragma solidity ^0.4.24;

contract Hello {
  string greeting;

  function Hello() public {
    greeting = "hello";
  }

  function getGreeting() public view returns (string) {
    return greeting;
  }

  function setGreeting(string _greeting) public {
    greeting = _greeting;
  }
}