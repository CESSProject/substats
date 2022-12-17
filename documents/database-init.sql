-- --------------------------------------------------------
--
--
--        Substats database export       
--
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- export  substats-w3f database structure
CREATE DATABASE IF NOT EXISTS `substats-w3f` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `substats-w3f`;

-- export tablesubstats-w3f.sessions structure
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- export tablesubstats-w3f.tb_block_account structure
CREATE TABLE IF NOT EXISTS `tb_block_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(300) DEFAULT NULL,
  `amount` decimal(65,0) DEFAULT NULL,
  `txCount` bigint(20) DEFAULT NULL,
  `isMiner` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `accountId` (`accountId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Transactions';



-- export tablesubstats-w3f.tb_block_event structure
CREATE TABLE IF NOT EXISTS `tb_block_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `blockHeight` bigint(20) NOT NULL DEFAULT '0',
  `txId` bigint(20) NOT NULL DEFAULT '0',
  `method` varchar(50) NOT NULL DEFAULT '0',
  `section` varchar(50) NOT NULL DEFAULT '0',
  `data` json NOT NULL,
  `index` int(10) NOT NULL DEFAULT '0',
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `txId` (`txId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='events';



-- export tablesubstats-w3f.tb_block_info structure
CREATE TABLE IF NOT EXISTS `tb_block_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(300) DEFAULT NULL,
  `signerAccount` varchar(300) DEFAULT NULL,
  `parentHash` varchar(300) DEFAULT NULL,
  `blockHeight` bigint(20) DEFAULT '0',
  `txCount` int(11) DEFAULT NULL,
  `eventCount` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`blockHeight`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=225547 DEFAULT CHARSET=utf8 COMMENT='block info';



-- export tablesubstats-w3f.tb_block_transaction structure
CREATE TABLE IF NOT EXISTS `tb_block_transaction` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(300) DEFAULT NULL,
  `blockHeight` bigint(20) DEFAULT '0',
  `status` varchar(50) DEFAULT NULL,
  `destAccount` varchar(300) DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `isSigned` tinyint(4) NOT NULL DEFAULT '0',
  `method` varchar(50) NOT NULL DEFAULT '0',
  `section` varchar(50) NOT NULL DEFAULT '0',
  `signer` varchar(300) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`),
  KEY `blockHeight` (`blockHeight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Transactions';



-- export tablesubstats-w3f.tb_dictionary structure
CREATE TABLE IF NOT EXISTS `tb_dictionary` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `category_id` int(11) NOT NULL,
  `sort_id` decimal(8,2) NOT NULL DEFAULT '0.00',
  `value` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `about` varchar(255) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `icon` varchar(200) DEFAULT NULL,
  `add_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index_category_key` (`category_id`,`value`) USING BTREE,
  KEY `index_category_id` (`category_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='the dictionary';



-- export tablesubstats-w3f.tb_dictionary_category structure
CREATE TABLE IF NOT EXISTS `tb_dictionary_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(20) NOT NULL,
  `sort_id` int(11) NOT NULL DEFAULT '0',
  `about` varchar(255) DEFAULT NULL,
  `add_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='category of the dictionary';



-- export tablesubstats-w3f.tb_miner structure
CREATE TABLE IF NOT EXISTS `tb_miner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `collateralAccount` varchar(300) DEFAULT NULL,
  `beneficiaryAccount` varchar(300) DEFAULT NULL,
  `collaterals` decimal(65,0) NOT NULL,
  `state` varchar(20) DEFAULT NULL,
  `power` decimal(65,0) NOT NULL,
  `powerPer` decimal(3,1) NOT NULL DEFAULT '0.0',
  `space` decimal(65,0) NOT NULL,
  `totalReward` decimal(65,0) NOT NULL,
  `totalRewardsCurrentlyAvailable` decimal(65,0) NOT NULL,
  `totalNotReceive` decimal(65,5) NOT NULL,
  `addTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `timerStatus` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `collateralAccount` (`collateralAccount`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='miner list';



-- export tablesubstats-w3f.tb_miner_summary structure
CREATE TABLE IF NOT EXISTS `tb_miner_summary` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `collateralAccounts` text,
  `collateralAccountCount` int(11) NOT NULL DEFAULT '1',
  `beneficiaryAccount` varchar(300) DEFAULT NULL,
  `collaterals` decimal(65,0) NOT NULL,
  `state` varchar(20) DEFAULT NULL,
  `power` decimal(65,0) NOT NULL,
  `powerPer` decimal(3,1) NOT NULL DEFAULT '0.0',
  `space` decimal(65,0) NOT NULL,
  `totalReward` decimal(65,0) NOT NULL,
  `totalRewardsCurrentlyAvailable` decimal(65,0) NOT NULL,
  `totalNotReceive` decimal(65,5) NOT NULL,
  `addTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `timerStatus` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `beneficiaryAccount` (`beneficiaryAccount`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='summary list of miner';



-- export tablesubstats-w3f.tb_power_trend structure
CREATE TABLE IF NOT EXISTS `tb_power_trend` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `power` bigint(20) NOT NULL DEFAULT '0',
  `dateStr` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `dateStr` (`dateStr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='power';

-- init dictionary data
INSERT INTO tb_dictionary_category(`name`) VALUES ('status');
INSERT INTO tb_dictionary (`category_id`, `sort_id`, `value`, `label`, `about`, `color`) VALUES (1, 1, 1, 'pending', 'status is pending', 'red');
INSERT INTO tb_dictionary (`category_id`, `sort_id`, `value`, `label`, `about`, `color`) VALUES (1, 2, 2, 'completed', 'status is completed', 'green');




/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
