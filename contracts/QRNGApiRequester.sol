// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

contract QRNGApiRequester is RrpRequesterV0 {
    bytes public parameters = abi.encode(
        bytes32("1SSS"),
        bytes32("provider"),
        "qbck",
        bytes32("type"),
        "short",
        bytes32("size"),
        "5"
    );
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => uint256[]) public fulfilledData;

    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet

    ) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointId,
            sponsor,
            sponsorWallet,
            address(this),
            this.fulfill.selector,
            parameters
        );
        incomingFulfillments[requestId] = true;
    }

    function fulfill(bytes32 requestId, bytes calldata data)
    external
    onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        uint256[] memory decodedData = abi.decode(data, (uint256[]));
        fulfilledData[requestId] = decodedData;
    }
}