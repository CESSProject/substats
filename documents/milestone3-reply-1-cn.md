## Possible problems
> 1. The Transactions trend chart seems to not work properly, both in the Kusama and Moonbeam demos you provided and locally. Also, days go from right to the left in the x axis.

- a. Transactions trend chart 数据停留在前几天是因为我们服务器在同步节点数据时，会一直请求RPC接口，可能是节点觉得我们请求太频繁，拒绝了我们的请求，所以数据就没有更新了，也就没有同步到区块信息和交易信息，Kusama and Moonbeam demo 也同样遇到了这个情况，服务器资源有限，我们暂时关停了Kusama and Moonbeam demo，在我们本地开发环境中测试是完全正常的。

- b. X 轴的顺序也已经更换

> 2. I tried other RPCs (Rococo Contracts and Statemint) and the first 127 blocks have 0 txs and 1970-01-01 01:00:00 as time. Do you know if it's a problem on your end or on the RPCs? For those blocks, I see this in the console:

- 我们测试了Rococo Contracts链（wss://rococo-contracts-rpc.polkadot.io），发现是正常的，没有重现您截图中的情况。我猜测最有可能是您在更新RPC后，没有运行“npm run reset"重置数据库造成的。

> 3. If I go to the Blocks page, which are the first blocks shown?

- 在Blocks页面，我们首先展示的最新同步到的区块，如果要查看其它区块的信息，可以往后面翻页。在使用本系统时，开发者可以从第一个区块开始同步，这样就能查询查询到第一个区块信息了。

> 4. There are accounts with millions of coins and no transactions, is it something on your end or the RPC data is wrong / they're some edge cases?

 - accounts的coins数量是从链状态API中查询到的，但accounts的transactions数量是指本地已经同步到的交易笔数，由于我们仅仅为了开发和测试，就没有从第一个区块信息开始同步，所以会出现没有transactions的情况，这是完全正常的。

> 5. While the server is retrieving the blocks, I try to search for a one that has just been found, but I get the error.

- 在首页的最新区块高度显示版块上显示的是链上最新区块高度，这时候本地还没有同步过来，所以如果查询，就会查询不到，所以出错了，这是本系统的运行机制决定的，未来如果有大规模应用了，我们会完善这个BUG，感谢你的建议，我们现在捕获了这个错误并加上了友好提示。

> 6. Note: this is the block I'm looking for, maybe the blocknumber is 516 instead of 3316885 and I misinterpreted the logs?

- 从你截图上看，3316885是链上最新区块高度，516是本地正在同步的区块高度。我们的log提示不太准确，给你造成困惑了，我们现在已经修改了log.

## UI suggestions (feel free to ignore them)

感谢你的建议，都是不错的意见，我们采纳了你大部分的建议并进行了修改，请一条条看：

> 1. I'd rename "Transfers" to "Transactions", as it's more general;

- 是的，使用Transactions更准确，已经修改

> 2. I'd make possible to zoom in/out the Transactions trend chart;

- 由于我们只显示最新几天的趋势图，暂时无法做到zoom in/out，抱歉。

> 3. If I input something in the research bar and search and then I change page, I'd remove the input value;

- 已经修改

> 4. In the Account page, I'd make the txs shrinkable (and already shrinked if I open the page), so that I can see more txs at once;

- 已经修改

> 5. In the Transfer detail page, the first column resizes if I change the selected event.

- 已经修改，我们把event单独放在一个box中，避免了这个问题



