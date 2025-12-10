-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: game_store_db
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carts`
--
CREATE DATABASE game_store_db;

USE game_store_db;

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `items` json NOT NULL DEFAULT (_utf8mb4'[]'),
  `totalItems` smallint unsigned DEFAULT '0',
  `totalPrice` decimal(10,2) DEFAULT '0.00',
  `sessionId` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiresAt` timestamp NULL DEFAULT ((now() + interval 30 day)),
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  KEY `idx_session` (`sessionId`),
  KEY `idx_expires` (`expiresAt`),
  KEY `idx_updated` (`updatedAt`),
  CONSTRAINT `fk_carts_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'[]',0,0.00,NULL,'2025-10-12 00:22:23','2025-09-12 00:22:23'),(2,2,'[]',0,0.00,NULL,'2025-10-12 00:22:23','2025-09-12 00:22:23'),(3,3,'[]',0,0.00,NULL,'2025-10-12 00:22:23','2025-09-12 00:22:23'),(4,5,'[]',0,0.00,NULL,'2025-10-12 01:36:30','2025-09-12 04:40:39'),(5,6,'[{\"game\": {\"id\": 1, \"size\": null, \"slug\": \"cyberpunk-2077\", \"tags\": [\"RPG\", \"Ciencia Ficción\", \"Mundo Abierto\"], \"price\": \"59.99\", \"stock\": 25, \"title\": \"Cyberpunk 2077\", \"active\": true, \"rating\": \"4.20\", \"category\": \"RPG\", \"discount\": \"0.20\", \"featured\": false, \"imageUrl\": \"/asset/cyber.png\", \"language\": \"Spanish\", \"ageRating\": \"M\", \"createdAt\": \"2025-09-12T00:22:23.000Z\", \"developer\": \"CD Projekt RED\", \"publisher\": \"CD Projekt RED\", \"unitsSold\": 0, \"updatedAt\": \"2025-09-12T02:16:51.000Z\", \"trailerUrl\": \"https://www.youtube.com/watch?v=8X2kIfS6fb8\", \"viewsCount\": 1, \"description\": \"Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en el futuro sombrío de Night City.\", \"ratingCount\": 1, \"releaseDate\": \"2020-12-10\", \"screenShots\": [\"https://via.placeholder.com/800x450/00FFFF/000000?text=Cyberpunk+Screenshot+1\", \"https://via.placeholder.com/800x450/FF00FF/000000?text=Cyberpunk+Screenshot+2\"], \"systemRequirements\": {\"minimum\": \"OS: Windows 7 64-bit, Processor: Intel Core i5-3570K\", \"recommended\": \"OS: Windows 10 64-bit, Processor: Intel Core i7-4790\"}}, \"quantity\": 1}]',1,47.99,NULL,'2025-10-12 02:27:54','2025-09-12 03:04:20'),(6,7,'[]',0,0.00,NULL,'2025-10-31 18:02:13','2025-10-01 18:02:53');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_usage`
--

DROP TABLE IF EXISTS `coupon_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_usage` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `couponId` smallint unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `orderId` int unsigned NOT NULL,
  `discountAmount` decimal(8,2) NOT NULL,
  `usedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_coupon` (`couponId`),
  KEY `idx_user` (`userId`),
  KEY `idx_order` (`orderId`),
  CONSTRAINT `fk_coupon_usage_coupon_id` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_usage_order_id` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_usage_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_usage`
--

LOCK TABLES `coupon_usage` WRITE;
/*!40000 ALTER TABLE `coupon_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `discountType` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountValue` decimal(8,2) NOT NULL,
  `minOrderAmount` decimal(8,2) DEFAULT '0.00',
  `maxDiscount` decimal(8,2) DEFAULT NULL,
  `usageLimit` smallint unsigned DEFAULT '1',
  `usedCount` smallint unsigned DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `validFrom` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `validUntil` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code_active` (`code`,`isActive`),
  KEY `idx_active_dates` (`isActive`,`validFrom`,`validUntil`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME10','Bienvenida 10%','Descuento del 10% para nuevos usuarios','percentage',10.00,25.00,50.00,100,0,1,'2025-09-12 00:22:23','2025-10-12 00:22:23','2025-09-12 00:22:23','2025-09-12 00:22:23'),(2,'SUMMER25','Verano 25% OFF','Descuento especial de verano','percentage',25.00,50.00,75.00,50,0,1,'2025-09-12 00:22:23','2025-11-11 00:22:23','2025-09-12 00:22:23','2025-09-12 00:22:23'),(3,'FIXED5','Descuento Fijo $5','Descuento fijo de $5 en cualquier compra','fixed',5.00,15.00,5.00,200,0,1,'2025-09-12 00:22:23','2025-10-27 00:22:23','2025-09-12 00:22:23','2025-09-12 00:22:23');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forums`
--

DROP TABLE IF EXISTS `forums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forums` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` char(7) COLLATE utf8mb4_unicode_ci DEFAULT '#007bff',
  `isActive` tinyint(1) DEFAULT '1',
  `position` tinyint unsigned DEFAULT '0',
  `threadCount` int unsigned DEFAULT '0',
  `postCount` int unsigned DEFAULT '0',
  `lastPostId` int unsigned DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_position` (`isActive`,`position`),
  KEY `idx_last_post` (`lastPostId`),
  CONSTRAINT `fk_forums_last_post_id` FOREIGN KEY (`lastPostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forums`
--

LOCK TABLES `forums` WRITE;
/*!40000 ALTER TABLE `forums` DISABLE KEYS */;
INSERT INTO `forums` VALUES (1,'General Discussion','Discusiones generales sobre videojuegos y la comunidad','G','#007bff',1,1,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(2,'Game Reviews','Comparte tus opiniones y reseñas sobre los juegos','R','#007bff',1,2,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(3,'Technical Support','Obtén ayuda con problemas técnicos y bugs','T','#007bff',1,3,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(4,'News & Updates','Últimas noticias del mundo gaming y actualizaciones de la tienda','N','#007bff',1,4,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(5,'Suggestions','Sugiere nuevas características y mejoras para la plataforma','S','#007bff',1,5,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(6,'Trading & Sales','Intercambio y venta de juegos entre usuarios','M','#007bff',1,6,0,0,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23');
/*!40000 ALTER TABLE `forums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_keys`
--

DROP TABLE IF EXISTS `game_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_keys` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameId` int unsigned NOT NULL,
  `gameTitle` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int unsigned DEFAULT NULL,
  `orderId` int unsigned DEFAULT NULL,
  `activationPlatform` enum('Steam','Epic Games','Origin','Uplay','GOG','Game Store') COLLATE utf8mb4_unicode_ci DEFAULT 'Game Store',
  `isUsed` tinyint(1) DEFAULT '0',
  `purchaseDate` timestamp NULL DEFAULT NULL,
  `assignedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_key_code` (`keyCode`),
  KEY `idx_game_status` (`gameId`,`isUsed`),
  KEY `idx_platform_status` (`activationPlatform`,`isUsed`),
  KEY `idx_user` (`userId`),
  KEY `idx_order` (`orderId`),
  CONSTRAINT `fk_game_keys_game_id` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_game_keys_order_id` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_game_keys_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_keys`
--

LOCK TABLES `game_keys` WRITE;
/*!40000 ALTER TABLE `game_keys` DISABLE KEYS */;
INSERT INTO `game_keys` VALUES ('550e8400-e29b-41d4-a716-446655440001',1,'Cyberpunk 2077','CYBER-2077A-BCDEF-GHIJK-LMNOP',NULL,NULL,'Steam',0,NULL,NULL,'2025-09-12 00:22:23'),('550e8400-e29b-41d4-a716-446655440002',2,'The Last of Us Part II','TLOU2-ABCDE-FGHIJ-KLMNO-PQRST',NULL,NULL,'Epic Games',0,NULL,NULL,'2025-09-12 00:22:23'),('550e8400-e29b-41d4-a716-446655440003',3,'FIFA 23','FIFA2-3ABCD-EFGHI-JKLMN-OPQRS',NULL,NULL,'Origin',0,NULL,NULL,'2025-09-12 00:22:23'),('550e8400-e29b-41d4-a716-446655440004',4,'Elden Ring','ELDEN-RABCD-EFGHI-JKLMN-OPQRS',NULL,NULL,'Steam',0,NULL,NULL,'2025-09-12 00:22:23'),('550e8400-e29b-41d4-a716-446655440005',5,'Call of Duty: Modern Warfare II','COD22-ABCDE-FGHIJ-KLMNO-PQRST',NULL,NULL,'Steam',0,NULL,NULL,'2025-09-12 00:22:23');
/*!40000 ALTER TABLE `game_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_ratings`
--

DROP TABLE IF EXISTS `game_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_ratings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `gameId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci,
  `isVerifiedPurchase` tinyint(1) DEFAULT '0',
  `helpfulVotes` int unsigned DEFAULT '0',
  `reportCount` tinyint unsigned DEFAULT '0',
  `isHidden` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_game_rating` (`userId`,`gameId`),
  KEY `idx_game_rating` (`gameId`,`rating` DESC),
  KEY `idx_verified` (`gameId`,`isVerifiedPurchase`),
  KEY `idx_hidden` (`isHidden`),
  CONSTRAINT `fk_game_ratings_game_id` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_game_ratings_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_ratings_chk_1` CHECK (((`rating` >= 1.0) and (`rating` <= 5.0)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_ratings`
--

LOCK TABLES `game_ratings` WRITE;
/*!40000 ALTER TABLE `game_ratings` DISABLE KEYS */;
INSERT INTO `game_ratings` VALUES (1,1,3,4.20,'Increíble mundo abierto y narrativa envolvente, aunque tiene algunos bugs menores.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(2,2,3,4.80,'Una secuela emotiva y bien ejecutada. Los gráficos y la actuación son excepcionales.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(3,3,3,4.00,'Buen juego de fútbol, pero no hay muchas novedades respecto al año anterior.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(4,4,3,4.90,'Una obra maestra absoluta. La dificultad es perfecta y el mundo es fascinante.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(5,5,3,4.30,'Excelente gameplay y gráficos. El multijugador es muy adictivo.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(6,6,3,4.70,'Impresionante visualmente y con una historia cautivadora. Aloy es un gran personaje.',0,0,0,0,'2025-09-12 00:22:23','2025-09-12 00:22:23');
/*!40000 ALTER TABLE `game_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(8,2) NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screenShots` json DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `releaseDate` date DEFAULT NULL,
  `publisher` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `developer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `ratingCount` int unsigned DEFAULT '0',
  `stock` int unsigned DEFAULT '0',
  `unitsSold` int unsigned DEFAULT '0',
  `viewsCount` int unsigned DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `featured` tinyint(1) DEFAULT '0',
  `discount` decimal(3,2) DEFAULT '0.00',
  `tags` json DEFAULT NULL,
  `trailerUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ageRating` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `systemRequirements` json DEFAULT NULL,
  `language` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Spanish',
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_active_featured` (`active`,`featured`),
  KEY `idx_category_active` (`category`,`active`),
  KEY `idx_price_active` (`price`,`active`),
  KEY `idx_rating_active` (`rating` DESC,`active`),
  KEY `idx_release_active` (`releaseDate` DESC,`active`),
  KEY `idx_units_sold` (`unitsSold` DESC),
  KEY `idx_views_count` (`viewsCount` DESC),
  KEY `idx_slug` (`slug`),
  KEY `idx_discount` (`discount` DESC,`active`),
  FULLTEXT KEY `idx_search` (`title`,`description`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Cyberpunk 2077','cyberpunk-2077','Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en el futuro sombrío de Night City.',59.99,'/asset/cyber.png','[\"https://via.placeholder.com/800x450/00FFFF/000000?text=Cyberpunk+Screenshot+1\", \"https://via.placeholder.com/800x450/FF00FF/000000?text=Cyberpunk+Screenshot+2\"]','RPG','2020-12-10','CD Projekt RED','CD Projekt RED',4.20,1,25,0,2,1,0,0.20,'[\"RPG\", \"Ciencia Ficción\", \"Mundo Abierto\"]','https://www.youtube.com/watch?v=8X2kIfS6fb8','M','{\"minimum\": \"OS: Windows 7 64-bit, Processor: Intel Core i5-3570K\", \"recommended\": \"OS: Windows 10 64-bit, Processor: Intel Core i7-4790\"}','Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 02:42:21'),(2,'The Last of Us Part II','the-last-of-us-part-ii','Cinco años después de su peligroso viaje a través de los Estados Unidos, Ellie y Joel se han establecido en Jackson, Wyoming.',49.99,'/asset/us.jpg','[\"https://via.placeholder.com/800x450/8B4513/FFFFFF?text=The+Last+of+Us+Screenshot+1\"]','Acción/Aventura','2020-06-19','Sony Interactive Entertainment','Naughty Dog',4.80,1,15,0,12,1,0,0.00,'[\"Acción\", \"Aventura\", \"Post-Apocalíptico\"]',NULL,'M',NULL,'Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 02:32:07'),(3,'FIFA 23','fifa-23','FIFA 23 nos acerca al mayor juego del mundo con avances tecnológicos que aumentan el realismo.',39.99,'/asset/fifa23.png','[\"https://via.placeholder.com/800x450/228B22/FFFFFF?text=FIFA+23+Screenshot+1\"]','Deportes','2022-09-30','EA Sports','EA Sports',4.00,1,50,0,0,1,0,0.15,'[\"Deportes\", \"Fútbol\", \"Multijugador\"]','https://www.youtube.com/watch?v=0tIW9jZarcY','E',NULL,'Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(4,'Elden Ring','elden-ring','Elden Ring es un RPG de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment.',59.99,'/asset/elden.png','[\"https://via.placeholder.com/800x450/8B4513/FFFFFF?text=Elden+Ring+Screenshot+1\"]','RPG','2022-02-25','Bandai Namco','FromSoftware',4.90,1,30,0,0,1,0,0.00,'[\"RPG\", \"Souls-like\", \"Fantasy\"]',NULL,'M',NULL,'Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(5,'Call of Duty: Modern Warfare II','call-of-duty-modern-warfare-ii','Call of Duty: Modern Warfare II es un videojuego de disparos en primera persona desarrollado por Infinity Ward.',69.99,'/asset/call.png','[\"https://via.placeholder.com/800x450/FF4500/FFFFFF?text=Call+of+Duty+Screenshot+1\"]','FPS','2022-10-28','Activision','Infinity Ward',4.30,1,40,0,0,1,0,0.00,'[\"FPS\", \"Multijugador\", \"Guerra\"]',NULL,'M',NULL,'Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(6,'Horizon Forbidden West','horizon-forbidden-west','Horizon Forbidden West continúa la historia de Aloy, una cazadora que viaja a una nueva frontera.',49.99,'/asset/horizon.png','[\"https://via.placeholder.com/800x450/4682B4/FFFFFF?text=Horizon+Screenshot+1\"]','Acción/Aventura','2022-02-18','Sony Interactive Entertainment','Guerrilla Games',4.70,1,20,0,0,1,0,0.10,'[\"Aventura\", \"RPG\", \"Ciencia Ficción\"]',NULL,'T',NULL,'Spanish',NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(7,'PEAK','peak','escalar una fokin montana',5.00,'https://peakpeakpeak.com/assets/images/share.jpg?v=20f94728','[\"https://media.vandal.net/m/6-2025/17/20256179123963_1.jpg\", \"https://i.blogs.es/fe7dcf/peak-repo-juego-gratis-twitch-conquistando/500_333.jpeg\"]','adventure','2025-09-11','nose','ANTUANE ',5.00,0,10,0,2,1,0,0.00,'[\"acción\", \"aventura\"]','https://www.youtube.com/watch?v=LnlTksWoXBE','AO','{\"minimum\": \"Requisitos Mínimos:\\nRAM: 8 GB\\nEspacio en Disco: 4 GB\\nTarjeta Gráfica: GeForce GTX 1060 3 GB. \\n2\\nRequisitos Recomendados:\\nCPU: Intel Core i5 @ 3.0 GHz o AMD Ryzen 5\\nRAM: 16 GB\\nTarjeta Gráfica: GeForce RTX 2060 o AMD RX 470. \\n2\\n\\nEstos requisitos aseguran que el juego funcione de manera óptima en tu PC.\", \"recommended\": \"nothing...\"}','Spanish',NULL,'2025-09-12 02:24:12','2025-10-01 17:41:45'),(8,'jorge','jorge','sdfghjk',100.00,'https://zeldacentral.com/wp-content/uploads/2025/03/Tears-of-the-Kingdom-wallpaper-1024x576.jpg','[]','rpg','2001-09-29','Nintendo','nintendo',5.00,0,100,0,0,1,0,0.00,'[\"RPG\", \"Mundo Abierto\"]','','','{\"minimum\": \"\", \"recommended\": \"\"}','Spanish',NULL,'2025-10-01 17:54:12','2025-10-01 17:54:12');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orderId` int unsigned NOT NULL,
  `gameId` int unsigned NOT NULL,
  `gameTitle` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameSlug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` tinyint unsigned NOT NULL DEFAULT '1',
  `price` decimal(8,2) NOT NULL,
  `totalPrice` decimal(8,2) NOT NULL,
  `gameImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `digitalKeyId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`orderId`),
  KEY `idx_game` (`gameId`),
  KEY `idx_digital_key` (`digitalKeyId`),
  CONSTRAINT `fk_order_items_game_id` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_order_items_order_id` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int unsigned NOT NULL,
  `userEmail` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','processing','completed','cancelled','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `paymentStatus` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(8,2) DEFAULT '0.00',
  `discount` decimal(8,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `billingAddress` json DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `purchaseDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `processedAt` timestamp NULL DEFAULT NULL,
  `completedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderNumber` (`orderNumber`),
  KEY `idx_user_status` (`userId`,`status`),
  KEY `idx_status_created` (`status`,`createdAt` DESC),
  KEY `idx_payment_status` (`paymentStatus`),
  KEY `idx_order_number` (`orderNumber`),
  KEY `idx_customer_email` (`userEmail`),
  KEY `idx_completed` (`completedAt` DESC),
  CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `threadId` int unsigned NOT NULL,
  `authorId` int unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAcceptedAnswer` tinyint(1) DEFAULT '0',
  `likes` smallint unsigned DEFAULT '0',
  `isEdited` tinyint(1) DEFAULT '0',
  `editedAt` timestamp NULL DEFAULT NULL,
  `editedBy` int unsigned DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `deletedBy` int unsigned DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_thread_created` (`threadId`,`createdAt`),
  KEY `idx_author` (`authorId`),
  KEY `idx_solution` (`isAcceptedAnswer`,`threadId`),
  KEY `idx_deleted` (`isDeleted`),
  KEY `idx_edited_by` (`editedBy`),
  KEY `idx_deleted_by` (`deletedBy`),
  FULLTEXT KEY `idx_content` (`content`),
  CONSTRAINT `fk_posts_author_id` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_posts_deleted_by_id` FOREIGN KEY (`deletedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_posts_edited_by_id` FOREIGN KEY (`editedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_posts_thread_id` FOREIGN KEY (`threadId`) REFERENCES `threads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_config`
--

DROP TABLE IF EXISTS `system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `configKey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `configValue` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `dataType` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `isEditable` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `configKey` (`configKey`),
  KEY `idx_key` (`configKey`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_config`
--

LOCK TABLES `system_config` WRITE;
/*!40000 ALTER TABLE `system_config` DISABLE KEYS */;
INSERT INTO `system_config` VALUES (1,'site_name','Game Store','Nombre del sitio web','string','general',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(2,'site_description','La mejor tienda de videojuegos online','Descripción del sitio','string','general',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(3,'tax_rate','0.10','Tasa de impuestos (10%)','number','finance',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(4,'currency','USD','Moneda del sitio','string','finance',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(5,'currency_symbol','$','Símbolo de la moneda','string','finance',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(6,'support_email','support@gamestore.com','Email de soporte','string','contact',1,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(7,'admin_email','admin@gamestore.com','Email del administrador','string','contact',1,'2025-09-12 00:22:23','2025-09-12 00:22:23');
/*!40000 ALTER TABLE `system_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `threads`
--

DROP TABLE IF EXISTS `threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `threads` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `forumId` int unsigned NOT NULL,
  `authorId` int unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `viewCount` int unsigned DEFAULT '0',
  `replyCount` smallint unsigned DEFAULT '0',
  `isPinned` tinyint(1) DEFAULT '0',
  `isLocked` tinyint(1) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `lastPostAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastPostUserId` int unsigned DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_forum_pinned` (`forumId`,`isPinned` DESC,`lastPostAt` DESC),
  KEY `idx_author` (`authorId`),
  KEY `idx_last_post` (`lastPostAt` DESC),
  KEY `idx_last_post_user` (`lastPostUserId`),
  FULLTEXT KEY `idx_search` (`title`,`content`),
  CONSTRAINT `fk_threads_author_id` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_threads_forum_id` FOREIGN KEY (`forumId`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_threads_last_post_user_id` FOREIGN KEY (`lastPostUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `threads`
--

LOCK TABLES `threads` WRITE;
/*!40000 ALTER TABLE `threads` DISABLE KEYS */;
/*!40000 ALTER TABLE `threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','moderator','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `joinDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `emailVerified` tinyint(1) DEFAULT '0',
  `resetPasswordToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resetPasswordExpires` timestamp NULL DEFAULT NULL,
  `resetPasswordCode` char(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resetPasswordCodeExpires` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username_active` (`username`,`isActive`),
  KEY `idx_email_verified` (`email`,`emailVerified`),
  KEY `idx_role_active` (`role`,`isActive`),
  KEY `idx_last_login` (`lastLogin`),
  KEY `idx_reset_token` (`resetPasswordToken`),
  KEY `idx_verification_code` (`resetPasswordCode`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@gamestore.com','$2a$10$8ZJK.3QvjGVN8rO3E7W4n.XJvM2NwI1qAA7.8xU5Xz6cI9jB7Oq.a','Admin','User','admin',NULL,NULL,'2025-09-12 00:22:23',NULL,1,1,NULL,NULL,NULL,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(2,'moderator','mod@gamestore.com','$2a$10$7YIJ.2PviGUN7qN2D6V3m.WIuL1MvH0pAA6.7wT4Wz5bH8iA6Np.b','Moderator','User','moderator',NULL,NULL,'2025-09-12 00:22:23',NULL,1,1,NULL,NULL,NULL,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(3,'testuser','test@gamestore.com','$2a$10$6XIH.1OuhFTM6pM1C5U2l.VHtK0LuG0oAA5.6vS3Vy4aG7hA5Mo.c','Test','User','user',NULL,NULL,'2025-09-12 00:22:23',NULL,1,1,NULL,NULL,NULL,NULL,'2025-09-12 00:22:23','2025-09-12 00:22:23'),(5,'kawiim89','kawiim98@gmail.com','$2b$10$6FwQT0GPr9r0l.FRhZ5sTeaAYOhyh4o9/DXuHZ2eYK9yhifw3xmGq','kevin','herrera mendoza','user',NULL,NULL,'2025-09-12 01:26:13',NULL,1,0,NULL,NULL,NULL,NULL,'2025-09-12 01:26:13','2025-09-12 03:07:52'),(6,'Anontuane','l221080175@iztapalapa.tecnm.mx','$2b$10$kEhjAk7B/7fNgivV.N9A7.pCjkq8xlKddDEvx7ZXTeYy0njNNzyim','antonelly','mi perra','user',NULL,NULL,'2025-09-12 02:27:31',NULL,1,0,NULL,NULL,NULL,NULL,'2025-09-12 02:27:31','2025-09-12 02:27:31'),(7,'antonymox','4nt0n1MM@gmail.com','$2b$10$Z1Nb1H6ZFYVzwh5DcfuOnePgLIIc1DvRMRdoifHzyom/bxFBhlU5u','antonelly','mi perra','user',NULL,NULL,'2025-10-01 17:58:12',NULL,1,0,'cf5be9ba860bb3cffbabbc9b1b80422e10e5b9c7af7d77fd7427a77a779c228e','2025-10-01 19:01:39','983337','2025-10-01 18:16:39','2025-10-01 17:58:12','2025-10-01 18:01:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `gameId` int unsigned NOT NULL,
  `addedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_game_wish` (`userId`,`gameId`),
  KEY `idx_user` (`userId`),
  KEY `idx_game` (`gameId`),
  CONSTRAINT `fk_wishlist_game_id` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,3,1,'2025-09-12 00:22:23'),(2,3,4,'2025-09-12 00:22:23'),(3,3,6,'2025-09-12 00:22:23');
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-06 10:02:13

-- phpMyAdmin SQL Dump
