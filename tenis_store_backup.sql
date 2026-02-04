-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: tenis_store
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (12,43,5,10,'2025-07-15 06:51:26');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbots`
--

DROP TABLE IF EXISTS `chatbots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chatbots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_message` text NOT NULL,
  `bot_response` text NOT NULL,
  `intent` varchar(50) DEFAULT 'general',
  `resolved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_chatbots_user` (`user_id`),
  CONSTRAINT `fk_chatbots_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbots`
--

LOCK TABLES `chatbots` WRITE;
/*!40000 ALTER TABLE `chatbots` DISABLE KEYS */;
INSERT INTO `chatbots` VALUES (1,NULL,'hola','??Hola! ???? Bienvenido a Sneakers Store. Soy tu asistente virtual y estoy aqu?? para ayudarte. Puedo asesorarte sobre:\n\n???? Productos y cat??logo\n???? Precios y ofertas\n???? Env??os y entregas\n???? Cambios y devoluciones\n???? M??todos de pago\n???? Seguimiento de pedidos\n\n??En qu?? puedo ayudarte hoy?','general',0,'2026-02-04 02:55:32'),(2,NULL,'metdos de pago ','???? **M??todos de Pago Disponibles:**\n\n??? **Tarjetas de cr??dito:**\n??? Visa, Mastercard, American Express\n??? Hasta 12 cuotas sin inter??s\n??? 3 cuotas SIN INTER??S en compras +$100\n\n???? **Otros medios:**\n??? D??bito (un solo pago)\n??? Mercado Pago\n??? Transferencia bancaria (5% descuento)\n??? Efectivo en sucursal\n\n???? Pagos 100% seguros con encriptaci??n SSL. ??Quer??s proceder con tu compra?','payment',0,'2026-02-04 03:01:31');
/*!40000 ALTER TABLE `chatbots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,120.00),(2,1,3,1,110.00),(3,2,2,1,95.50),(4,2,6,1,125.00),(5,3,2,1,95.50),(6,3,5,1,105.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,10,230.00,'2025-06-03 06:04:23'),(2,19,220.50,'2025-06-03 06:22:08'),(3,33,200.50,'2025-06-03 12:41:52');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nike Air Zoom Vapor','Tenis deportivos ligeros y c??modos, ideales para partidos intensos. Suela antideslizante y dise??o moderno.',120.00,'assets/img/nike_ari_zoom.jpg','2025-05-19 20:24:57'),(2,'Adidas CourtJam Bounce','Zapatos de tenis con excelente amortiguaci??n y soporte lateral. Perfectos para jugadores de todos los niveles.',95.50,'assets/img/adidas_court.jpg','2025-05-19 20:24:57'),(3,'Wilson Rush Pro 3.0','Tenis de alto rendimiento con gran estabilidad y transpirabilidad. Recomendados para superficies duras.',110.00,'assets/img/wilson_pro.jpg','2025-05-19 20:24:57'),(4,'Asics Gel-Resolution 8','Calzado profesional con tecnolog??a Gel para m??xima absorci??n de impactos. Muy duraderos.',130.00,'assets/img/asics_resolution.jpg','2025-05-19 20:24:57'),(5,'New Balance 996v4','Tenis ultraligeros con suela resistente y dise??o elegante. Ideales para largas sesiones de juego.',105.00,'assets/img/new_balance_fuelcell.jpg','2025-05-19 20:24:57'),(6,'Babolat Jet Mach II','Zapatos de tenis con ajuste perfecto y excelente tracci??n. Favorecen la velocidad en la cancha.',125.00,'assets/img/babolat_jet.jpg','2025-05-19 20:24:57'),(37,'Tenis Pro Runner','Tenis ligeros para entrenamiento diario',89.99,'assets/images/default-shoe.jpg','2026-02-04 02:43:05'),(38,'Tenis Urban Classic','Estilo urbano con suela antideslizante',109.50,'assets/images/default-shoe.jpg','2026-02-04 02:43:05'),(39,'Tenis Trail Force','Dise??ados para senderismo y terreno irregular',129.00,'assets/images/default-shoe.jpg','2026-02-04 02:43:05');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'juan','$2y$10$eImiTXuWVxfM37uY4JANjQ==','juan@email.com','2025-05-19 20:24:57'),(2,'maria','$2y$10$eImiTXuWVxfM37uY4JANjQ==','maria@email.com','2025-05-19 20:24:57'),(10,'pepe','$2y$10$q0XgaunXumb0T6ByutxLfOCYVAXegVqOSaeZ4otoGJEhA7gWReWj2','thebigboss99.jfl@gmail.com','2025-06-03 06:01:56'),(19,'Raul','$2y$10$DGqg5VX5wqgvIlW9gZtQbOWNn5YbIay4JiI5CTsV4zl7IyJyDTwT2','raul@gmail.com','2025-06-03 06:21:01'),(33,'toscano','$2y$10$0PmWXxUBjknxF1M2wPQsMOyoefNOjRlMNb.b.F8.EX8o9MDCdRLHy','toscano@gmail.com','2025-06-03 12:40:47'),(37,'testuser_3639','$2y$10$HUWWjdn3rS5Wx9CW4vrnpe3AW8IyINWB3rAP9g.Ui6W1jT21KzWz6','testuser_3639@test.com','2025-06-03 12:49:01'),(38,'usuario_existente','$2y$10$Rk09ZC1D0TDzIBiSvmsVJuZMd5IndqDhyRcPYlvOh1gNTz.P6gqGW','correo_existente@test.com','2025-06-03 12:49:01'),(42,'testuser_3766','$2y$10$4TKbiWGwdAXtcZ7AL/9E8eidIuZf8m90gxu1hEjcD7JOecjqBkcK2','testuser_3766@test.com','2025-06-03 12:49:53'),(43,'jaferrin','$2a$10$VcrNUy0kmUW6M3.6wwlyZO2fCk60F5Srs606Inq4XgcEqkYhO4I.C','jaferrin1@example.com','2025-07-15 06:39:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04  1:18:44
