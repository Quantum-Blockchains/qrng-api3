// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

/// @notice contract handling QuantumBlockchains QRNG API communication
contract QRNGApiRequester is RrpRequesterV0 {

    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => uint256[]) public fulfilledData;

    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    /// @notice makes request to QRNG API
    /// @param _provider - supported providers: qbck, qnulabs, sequre, realrandom
    /// @param _type - supported types: short (uint16), int (uint32), long (uint64), bigint (uint128)
    /// @param _size - quantity of random numbers to generate
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes32 _provider,
        bytes32 _type,
        uint _size
    ) external {
        bytes memory parameters = _encodeParams(_provider, _type, _size);
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

    /// @notice method called by Airnode in order to fulfill request
    function fulfill(bytes32 requestId, bytes calldata data)
    external
    onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        uint256[] memory decodedData = abi.decode(data, (uint256[]));
        fulfilledData[requestId] = decodedData;
    }

    /// @notice Encodes params for making request to QBCK API
    /// @param _provider - supported providers: qbck, qnulabs, sequre, realrandom
    /// @param _type - supported types: short (uint16), int (uint32), long (uint64), bigint (uint256)
    /// @param _size - quantity of random numbers to generate
    function _encodeParams(bytes32 _provider, bytes32 _type, uint _size) private pure returns (bytes memory) {
        return abi.encode(
            bytes32("1SSSS"),
            bytes32("provider"),
            _provider,
            bytes32("type"),
            _type,
            bytes32("size"),
            _size,
            bytes32("length"),
            32
        );
    }
}