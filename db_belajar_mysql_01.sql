-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: belajar_mysql_01
-- ------------------------------------------------------
-- Server version	8.0.25

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
-- Table structure for table `phone`
--

DROP TABLE IF EXISTS `phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone` (
  `phone_id` int NOT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`phone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone`
--

LOCK TABLES `phone` WRITE;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(70) DEFAULT NULL,
  `role_id` int DEFAULT '3',
  `address` varchar(100) DEFAULT NULL,
  `usercol` varchar(45) DEFAULT NULL,
  `phone_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_id_UNIQUE` (`phone_id`),
  KEY `phone_id_idx` (`phone_id`),
  CONSTRAINT `phone_id` FOREIGN KEY (`phone_id`) REFERENCES `phone` (`phone_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Princess','1234',3,'Jl. Mario Bros',NULL,NULL),(3,'Yoda','force',3,'Jl. Dagobah',NULL,NULL),(4,'Raymond Hamilton','dictum',3,'Ap #304-8456 Vehicula Ave',NULL,NULL),(5,'Dante Evans','nunc.',3,'187-1291 Dolor Road',NULL,NULL),(6,'Kasper Hogan','Duis',3,'P.O. Box 980, 5889 Lectus. Av.',NULL,NULL),(7,'Alisa Ford','urna',3,'P.O. Box 540, 487 Ante Av.',NULL,NULL),(8,'Troy Hayden','elit,',3,'Ap #588-7583 Sit Rd.',NULL,NULL),(9,'Akeem Merrill','dapibus',3,'P.O. Box 389, 8776 Et St.',NULL,NULL),(10,'Ray Ayala','bibendum',3,'6109 At St.',NULL,NULL),(11,'Ezekiel Lloyd','eu',3,'148-4853 Volutpat St.',NULL,NULL),(12,'Armand Campos','nec',3,'589-3911 Tellus Rd.',NULL,NULL),(13,'Teagan Mills','Pellentesque',3,'Ap #953-9570 Metus. Avenue',NULL,NULL),(14,'Colette Green','nec',3,'665 Neque. Rd.',NULL,NULL),(15,'Eliana Benjamin','lectus',3,'345-792 Pede Rd.',NULL,NULL),(16,'Kirestin Gillespie','dolor',3,'P.O. Box 202, 1238 Ipsum Rd.',NULL,NULL),(17,'Devin Acevedo','lorem',3,'450-9237 Donec St.',NULL,NULL),(18,'Nelle Stevenson','lorem',3,'Ap #275-3973 Bibendum Rd.',NULL,NULL),(19,'Josephine Cameron','ornare',3,'837-9081 Nunc Street',NULL,NULL),(20,'Dieter Nixon','Cum',3,'P.O. Box 379, 714 Varius Rd.',NULL,NULL),(21,'Chester Pickett','a,',3,'Ap #617-6762 Sit Rd.',NULL,NULL),(22,'Uriah Huber','urna.',3,'Ap #392-179 Mi St.',NULL,NULL),(23,'Ignatius Tyler','ut',3,'Ap #390-4786 Metus. Road',NULL,NULL),(24,'Nathan Hartman','augue',3,'Ap #423-4036 Et, Av.',NULL,NULL),(25,'Ivory Hendrix','Vivamus',3,'748-4377 Mauris Street',NULL,NULL),(26,'Daquan Waller','at,',3,'Ap #192-4865 Aenean Av.',NULL,NULL),(27,'Belle Saunders','Donec',3,'P.O. Box 152, 8320 Eu Street',NULL,NULL),(28,'Ifeoma Bowers','sociis',3,'Ap #858-686 Dapibus Rd.',NULL,NULL),(29,'Ava Phelps','et',3,'Ap #629-5383 Sed St.',NULL,NULL),(30,'Naida Mckinney','enim.',3,'741-8871 Sagittis Road',NULL,NULL),(31,'Gary Fitzpatrick','et,',3,'Ap #534-8844 Nec Avenue',NULL,NULL),(32,'Fredericka Wong','Etiam',3,'174-7838 In Avenue',NULL,NULL),(33,'Isaiah Donovan','felis',3,'Ap #798-1590 Molestie Road',NULL,NULL),(34,'Julian Case','laoreet',3,'Ap #614-5064 Arcu. Avenue',NULL,NULL),(35,'Zenaida Ryan','sit',3,'8815 Velit. Rd.',NULL,NULL),(36,'Samantha Patel','malesuada',3,'4147 Consectetuer St.',NULL,NULL),(37,'Tasha Hopkins','mattis.',3,'Ap #847-2662 Mollis Ave',NULL,NULL),(38,'William Huff','mollis.',3,'882-2413 Fringilla Av.',NULL,NULL),(39,'Dennis Middleton','taciti',3,'700-3334 Et St.',NULL,NULL),(40,'Maite Key','inceptos',3,'P.O. Box 452, 6112 Sed Ave',NULL,NULL),(41,'Xander Wells','nascetur',3,'1698 Imperdiet Street',NULL,NULL),(42,'Nell Buckley','nec',3,'5228 Nisl Street',NULL,NULL),(43,'Ria Marsh','dui,',3,'P.O. Box 804, 4695 Feugiat Ave',NULL,NULL),(44,'Lacota Fisher','sit',3,'6467 Lectus Ave',NULL,NULL),(45,'Kathleen Grimes','sed',3,'Ap #858-4597 Aenean Ave',NULL,NULL),(46,'Rowan Clark','eros',3,'778 Gravida Rd.',NULL,NULL),(47,'Vaughan Coffey','egestas.',3,'P.O. Box 839, 9386 Blandit St.',NULL,NULL),(48,'Aiko Powers','pede,',3,'6059 Vel Rd.',NULL,NULL),(49,'Kay Briggs','risus.',3,'Ap #135-5358 Aliquam Rd.',NULL,NULL),(50,'Chester Hewitt','ante',3,'992-2388 Donec Avenue',NULL,NULL),(51,'Guy Mckay','fringilla,',3,'Ap #342-6523 Dui. Road',NULL,NULL),(52,'September Riggs','Vivamus',3,'454-5759 At, Rd.',NULL,NULL),(53,'Tanya Lara','Donec',3,'Ap #689-2129 Proin St.',NULL,NULL),(54,'Coby Snyder','eget',3,'Ap #747-2251 Nunc Road',NULL,NULL),(55,'Emi Allison','magna',3,'7014 Donec Avenue',NULL,NULL),(56,'Callie Robles','sem.',3,'468-5600 Commodo St.',NULL,NULL),(57,'Griffin Skinner','enim',3,'P.O. Box 514, 6675 Vitae Rd.',NULL,NULL),(58,'Petra Hardy','non,',3,'Ap #659-8494 Ipsum. Rd.',NULL,NULL),(59,'Leslie Nicholson','amet',3,'P.O. Box 976, 4063 Netus Rd.',NULL,NULL),(60,'Ralph Cannon','ut',3,'588-3388 Augue Av.',NULL,NULL),(61,'Stacey Brewer','eget',3,'4563 Justo. St.',NULL,NULL),(62,'Holly Kent','Donec',3,'Ap #742-1201 Blandit Av.',NULL,NULL),(63,'Abraham Weeks','justo.',3,'Ap #696-3692 Luctus Rd.',NULL,NULL),(64,'Ralph Luna','sed',3,'244-9632 Non Ave',NULL,NULL),(65,'Malachi Sawyer','nibh.',3,'157-5889 Tellus Road',NULL,NULL),(66,'Forrest Harvey','Maecenas',3,'P.O. Box 628, 3744 Sit Street',NULL,NULL),(67,'Benedict Ashley','penatibus',3,'1036 Scelerisque Av.',NULL,NULL),(68,'Wylie Dalton','turpis.',3,'328-9267 Aliquam Ave',NULL,NULL),(69,'Xaviera Pearson','nec',3,'8724 Magna St.',NULL,NULL),(70,'Shoshana Vargas','faucibus',3,'Ap #679-1249 Ligula Road',NULL,NULL),(71,'Jerry Cox','hendrerit',3,'241-8578 Ut Ave',NULL,NULL),(72,'Carlos Kaufman','pede.',3,'364-8263 Viverra. Road',NULL,NULL),(73,'David Jacobson','sodales',3,'5403 Est St.',NULL,NULL),(74,'Kameko Yang','tempus',3,'702-4913 Quisque Rd.',NULL,NULL),(75,'Dana Gilmore','placerat,',3,'Ap #266-6543 Sem Avenue',NULL,NULL),(76,'Allistair Matthews','felis.',3,'600-2151 Eget, Rd.',NULL,NULL),(77,'Kamal Rasmussen','eros',3,'Ap #246-6805 Fames Rd.',NULL,NULL),(78,'Luke Morin','interdum',3,'3360 Semper Avenue',NULL,NULL),(79,'Sharon Singleton','est.',3,'Ap #826-7488 Est. Av.',NULL,NULL),(80,'Perry Fitzpatrick','nonummy',3,'Ap #710-3269 Lectus St.',NULL,NULL),(81,'Burke Bradshaw','semper',3,'108-6737 Sed Rd.',NULL,NULL),(82,'Illana Sellers','nec',3,'Ap #525-4602 Amet, Rd.',NULL,NULL),(83,'Amery Cash','commodo',3,'809-8358 Aliquet Road',NULL,NULL),(84,'Wynter Bartlett','ornare,',3,'950-7371 Vel, St.',NULL,NULL),(85,'Lilah Copeland','mus.',3,'P.O. Box 956, 8571 A Av.',NULL,NULL),(86,'Raymond Burnett','lectus',3,'Ap #357-8027 Ante Ave',NULL,NULL),(87,'Maggie Rasmussen','Donec',3,'250-8434 Metus Avenue',NULL,NULL),(88,'Paki Lambert','interdum.',3,'410-8979 Sed Street',NULL,NULL),(89,'Kasimir Little','urna.',3,'350-6155 Non, Road',NULL,NULL),(90,'Caryn Snyder','urna',3,'2117 Malesuada St.',NULL,NULL),(91,'Geraldine Mendez','dui,',3,'356-808 Mi Rd.',NULL,NULL),(92,'Blythe Goodman','Donec',3,'2792 Sapien Rd.',NULL,NULL),(93,'April Shaffer','Duis',3,'Ap #521-1032 Purus Ave',NULL,NULL),(94,'Sandra Baldwin','nulla.',3,'P.O. Box 525, 9831 Pellentesque Street',NULL,NULL),(95,'Yolanda Graves','nibh',3,'963 Ut, Rd.',NULL,NULL),(96,'Octavia Lara','Proin',3,'Ap #502-5134 Purus, St.',NULL,NULL),(97,'Vladimir Gross','malesuada',3,'9216 Enim, Rd.',NULL,NULL),(98,'Thor Rhodes','auctor.',3,'9577 Ipsum. Ave',NULL,NULL),(99,'Yvonne Snider','luctus',3,'897-336 Sed Avenue',NULL,NULL),(100,'Thane Austin','leo.',3,'P.O. Box 571, 7167 Est Avenue',NULL,NULL),(101,'Emerson Santos','Proin',3,'7323 Congue, St.',NULL,NULL),(102,'Leah Burt','magna',3,'4179 Augue Avenue',NULL,NULL),(103,'Rosalyn Stone','arcu.',3,'8164 Commodo Avenue',NULL,NULL),(104,'User Percobaan','abc123',3,'Jl. Testing 123',NULL,NULL),(105,'Coba Edit','edit123',3,'Jl. Edit 321',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-12 12:26:17
