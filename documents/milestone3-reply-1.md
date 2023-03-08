## Possible problems
> 1. The Transactions trend chart seems to not work properly, both in the Kusama and Moonbeam demos you provided and locally. Also, days go from right to the left in the x axis.

- a. The reason is that the server request RPC frequently. So the server reject the request and the data updating is failed. The resource of server is limited, we closed Kusama and Moonbeam server. Polkadot demo is running: https://polkadot.cess.cloud/
- b. The order of the X axis has been changed.

> 2. I tried other RPCs (Rococo Contracts and Statemint) and the first 127 blocks have 0 txs and 1970-01-01 01:00:00 as time. Do you know if it's a problem on your end or on the RPCs? For those blocks, I see this in the console:

- We tested Rococo Contracts（wss://rococo-contracts-rpc.polkadot.io）, and we can not find the problem. We suppose that "npm run reset" has not been executed after you updated RPC. 

> 3. If I go to the Blocks page, which are the first blocks shown?

- It depends on when the block starts to synchronize. If the developer starts syncing from the first block,  users can see all the blocks.

> 4. There are accounts with millions of coins and no transactions, is it something on your end or the RPC data is wrong / they're some edge cases?

 - Because the block is not synchronized from the first block, some transaction can not be found . The demo just for testing and the data is from database instead of chain. It is normal.

> 5. While the server is retrieving the blocks, I try to search for a one that has just been found, but I get the error.

- The reason is that the local has not been synchronized timely. 
- This is a phenomenon caused by the mechanism of the system. We will fix this BUG in the future if there is a large scale application. Thanks for your advice, we added an error message.

> 6. Note: this is the block I'm looking for, maybe the blocknumber is 516 instead of 3316885 and I misinterpreted the logs?

- 3316885 is latest block height, 516 is the block height where synchronizing to local. The log hint is inaccurate, we have fixed the log.

## UI suggestions

Thanks for your suggestions, it sounds advisable.

Most of suggestions has been adopted:

> 1. I'd rename "Transfers" to "Transactions", as it's more general;

- "Transfers" sounds more correct, so it has been changed.

> 2. I'd make possible to zoom in/out the Transactions trend chart;

- Sorry, the component is unsupported to zoom in/out.

> 3. If I input something in the research bar and search and then I change page, I'd remove the input value;

- It has been changed.

> 4. In the Account page, I'd make the txs shrinkable (and already shrinked if I open the page), so that I can see more txs at once;

- It has been changed.

> 5. In the Transfer detail page, the first column resizes if I change the selected event.

- It has been changed.



