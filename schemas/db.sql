-- Create syntax for TABLE 'job'
CREATE TABLE `job` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_update_by` varchar(100) DEFAULT NULL,
  `alert_emails` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'job_history'
CREATE TABLE `job_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `queue_id` int(11) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL,
  `status` enum('SUCCESS','ERROR','RUNNING') DEFAULT NULL,
  `message` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'job_mapping'
CREATE TABLE `job_mapping` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'job_schedule'
CREATE TABLE `job_schedule` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `start_at` timestamp NULL DEFAULT NULL,
  `interval` int(2) DEFAULT NULL,
  `unit` enum('MINUTES','HOURS') CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'job_transport'
CREATE TABLE `job_transport` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `type` enum('OLAPIC_FTP','FTP','SFTP','HTTP') CHARACTER SET latin1 DEFAULT NULL,
  `path` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ftp_host` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `ftp_user` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `ftp_pw` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;