import {
  lookupBlock,
  getLogs,
} from "./index";

jest.setTimeout(20000);

function getDiff(a: number, b: number): number {
  return (a > b) ? a - b : b - a;
}

test("lookupBlock", async () => {
  const block = await lookupBlock(1669037786);
  // Approximation, DP's sdk returns { timestamp: 1669037786, block: 16018720 }
  expect(getDiff(block.block, 16018720)).toBeLessThanOrEqual(50); // 50 blocks appromiates to 10 minute difference
  expect(getDiff(block.timestamp, 1669037786)).toBeLessThanOrEqual(15 * 60); // difference should be under 15 minutes

  const block2 = await lookupBlock(1594112416);
  // Approximation, DP's sdk returns { timestamp: 1594112416, block: 10411348 }
  expect(getDiff(block2.block, 10411348)).toBeLessThanOrEqual(50); // 50 blocks appromiates to 10 minute difference
  expect(getDiff(block2.timestamp, 1594112416)).toBeLessThanOrEqual(15 * 60); // difference should be under 15 minutes
});

test("lookupBlock bsc", async () => {
  const block = await lookupBlock(1669051521, {chain: 'bsc'});
  // Approximation, DP's sdk returns { timestamp: 1669051521, block: 23252691 }
  expect(getDiff(block.block, 23252691)).toBeLessThanOrEqual(200); // 200 blocks appromiates to 10 minute difference
  expect(getDiff(block.timestamp, 1669051521)).toBeLessThanOrEqual(15 * 60); // difference should be under 15 minutes
  
  const block2 = await lookupBlock(1638821718, {chain: 'bsc'});
  // Approximation, DP's sdk returns { timestamp: 1638821718, block: 13252691 }
  expect(getDiff(block2.block, 13252691)).toBeLessThanOrEqual(200); // 200 blocks appromiates to 10 minute difference
  expect(getDiff(block2.timestamp, 1638821718)).toBeLessThanOrEqual(15 * 60); // difference should be under 15 minutes
});

test("getLogs", async () => {
  let poolLogs = await getLogs({
    target: "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
    topic: "LOG_NEW_POOL(address,address)",
    keys: ["topics"],
    fromBlock: 9562480,
    toBlock: 9575480,
  });
  expect(poolLogs).toEqual({
    output: [
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x000000000000000000000000165a50bc092f6870dc111c349bae5fc35147ac86",
      ],
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x00000000000000000000000057755f7dec33320bca83159c26e93751bfd30fbe",
      ],
      [
        "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
        "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
        "0x000000000000000000000000e5d1fab0c5596ef846dcc0958d6d0b20e1ec4498",
      ],
    ],
  });
});

test("getLogs supports it's old API", async () => {
  expect(
    (
      await getLogs({
        keys: [],
        toBlock: 12047406,
        target: "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b",
        fromBlock: 8928152,
        topics: [
          "0x65fae35e00000000000000000000000000000000000000000000000000000000",
        ],
      } as any)
    ).output.slice(0, 2)
  ).toEqual([
    {
      address: "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
      blockHash:
        "0x4e0c6d0ceaade9476d0798a44452117c42300389f43ad8397e91092827019fed",
      blockNumber: 8928152,
      data:
        "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e065fae35e000000000000000000000000baa65281c2fa2baacb2cb550ba051525a480d3f40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      logIndex: 64,
      removed: false,
      topics: [
        "0x65fae35e00000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000baa65281c2fa2baacb2cb550ba051525a480d3f4",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
      transactionHash:
        "0xa39edcdeb7310150d7be44b8da94e5043d1cf8600d59f855a65c7a9c035b06a7",
      transactionIndex: 66,
      //id: 'log_4301d412' // SHOULD BE SUPPORTED BUT HEH
    },
    {
      address: "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
      blockHash:
        "0x4e0c6d0ceaade9476d0798a44452117c42300389f43ad8397e91092827019fed",
      blockNumber: 8928152,
      data:
        "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e065fae35e00000000000000000000000065c79fcb50ca1594b025960e539ed7a9a6d434a30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      logIndex: 68,
      removed: false,
      topics: [
        "0x65fae35e00000000000000000000000000000000000000000000000000000000",
        "0x00000000000000000000000065c79fcb50ca1594b025960e539ed7a9a6d434a3",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
      transactionHash:
        "0xa39edcdeb7310150d7be44b8da94e5043d1cf8600d59f855a65c7a9c035b06a7",
      transactionIndex: 66,
      //id: 'log_eaa6bc34' // SHOULD BE SUPPORTED BUT HEH
    },
  ]);
});

test("sushiswap getLogs follow the old API", async () => {
  expect(
    (
      await getLogs({
        keys: [],
        toBlock: 12052813,
        target: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac",
        fromBlock: 10794229,
        topic: "PairCreated(address,address,address,uint256)",
      })
    ).output.slice(0, 2)
  ).toEqual([
    {
      address: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
      blockHash:
        "0xf59ff7fcf1443e7e61582224359a030bb7178871182cc543acb16627e81ec1a8",
      blockNumber: 10794352,
      data:
        "0x000000000000000000000000680a025da7b1be2c204d7745e809919bce0740260000000000000000000000000000000000000000000000000000000000000001",
      logIndex: 81,
      removed: false,
      topics: [
        "0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9",
        "0x0000000000000000000000006b3595068778dd592e39a122f4f5a5cf09c90fe2",
        "0x000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7",
      ],
      transactionHash:
        "0x64318dfffc6544cb4782715ad914e335039cda02f5e8d3e47f0dac47f53565d2",
      transactionIndex: 56,
      //id: 'log_20f0cd7e'
    },
    {
      address: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
      blockHash:
        "0x25c6da25c999e1c668d60a5068128eb521ef121e4b46fb24575ed6fb037ede67",
      blockNumber: 10822038,
      data:
        "0x00000000000000000000000006da0fd433c1a5d7a4faa01111c044910a1845530000000000000000000000000000000000000000000000000000000000000002",
      logIndex: 202,
      removed: false,
      topics: [
        "0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9",
        "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "0x000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7",
      ],
      transactionHash:
        "0xaf215158cef8da66b2f6addc48d8683199468560599ac568b8981d9d67dc04b6",
      transactionIndex: 89,
      //id: 'log_2758f079'
    },
  ]);
});
