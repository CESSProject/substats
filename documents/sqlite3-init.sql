CREATE TABLE if not exists `tb_block_account` (
	`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
	`accountId` VARCHAR(300),
	`amount` REAL,
	`txCount` INTEGER,
	`isMiner` INTEGER DEFAULT '0'
)

CREATE TABLE if not exists `tb_block_event` (
	`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
	`blockHeight` INTEGER,
	`txId` INTEGER DEFAULT '0',
	`method` TEXT,
	`section` TEXT,
	`data` TEXT,
	`index` INTEGER DEFAULT '0',
	`timestamp` INTEGER
)
CREATE TABLE if not exists `tb_block_info` (
	`id` INTEGER,
	`hash` TEXT,
	`signerAccount` TEXT,
	`parentHash` TEXT,
	`blockHeight` INTEGER,
	`txCount` INTEGER,
	`eventCount` INTEGER,
	`timestamp` INTEGER,
	PRIMARY KEY ("id")
)

CREATE TABLE if not exists `tb_block_transaction` (
	`id` INTEGER,
	`hash` TEXT,
	`blockHeight` INTEGER,
	`status` TEXT,
	`destAccount` TEXT,
	`amount` INTEGER,
	`isSigned` INTEGER,
	`method`  TEXT,
	`section`  TEXT,
	`signer`  TEXT,
	`timestamp` INTEGER,
	PRIMARY KEY (`id`)
)

CREATE TABLE if not exists `tb_dictionary` (
	`id` INTEGER,
	`category_id` INTEGER,
	`sort_id` INTEGER,
	`value`  INTEGER,
	`label` TEXT,
	`about` TEXT,
	`color` TEXT,
	`icon` TEXT,
	`add_time`  INTEGER,
	`update_time`  INTEGER,
	PRIMARY KEY (`id`) 
)

CREATE TABLE if not exists `tb_dictionary_category` (
	`id` INTEGER,
	`name` TEXT,
	`sort_id` INTEGER,
	`about` TEXT,
	`add_time` INTEGER,
	`update_time` INTEGER,
	PRIMARY KEY (`id`)
)

CREATE TABLE if not exists `tb_miner` (
	`id` INTEGER,
	`collateralAccount` TEXT,
	`beneficiaryAccount` TEXT,
	`collaterals` REAL,
	`state` TEXT,
	`power` REAL,
	`powerPer` REAL,
	`space` REAL,
	`totalReward` REAL,
	`totalRewardsCurrentlyAvailable` REAL,
	`totalNotReceive` REAL,
	`addTime` INTEGER,
	`updateTime` INTEGER,
	`timerStatus` INTEGER,
	PRIMARY KEY (`id`)
)

CREATE TABLE if not exists `tb_miner_summary` (
	`id` INTEGER,
	`collateralAccounts` TEXT ,
	`collateralAccountCount` INTEGER,
	`beneficiaryAccount` TEXT ,
	`collaterals` REAL,
	`state` TEXT,
	`power` REAL,
	`powerPer` REAL,
	`space` REAL,
	`totalReward` REAL,
	`totalRewardsCurrentlyAvailable` REAL,
	`totalNotReceive` REAL,
	`addTime` INTEGER,
	`updateTime` INTEGER,
	`timerStatus` INTEGER,
	PRIMARY KEY (`id`)
)

CREATE TABLE if not exists `tb_storage_power_trend` (
	`id` INTEGER,
	`power` INTEGER,
	`dateStr` TEXT,
	PRIMARY KEY (`id`)
)