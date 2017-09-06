<?php
	session_start();

	if(!isset($_SESSION['session']) && !empty($_SESSION['session'])) die("Accès refusé");
?>
<!DOCTYPE html>
<html>
	<head>
		<title>CosmOS</title>
		<meta charset="utf-8" lang="fr/FR" />
		
		<link rel="icon" href="public/images/icon.png" />
		
		<link rel="stylesheet" type="text/css" href="public/css/general.css" />
		<link rel="stylesheet" type="text/css" href="public/css/header.css" />
		<link rel="stylesheet" type="text/css" href="public/css/nav.css" />
		
		<script type="text/javascript" src="https://use.fontawesome.com/431c33e408.js"></script>
	</head>
	
	<body>
		<header>
			<div id="menu">
				<span><i class="fa fa-paint-brush"></i> Apparence</span>
				<span><i class="fa fa-shopping-cart"></i> Boutique</span>
				<span><i class="fa fa-server"></i> Stockage</span>
				<span><i class="fa fa-user"></i> Mon compte</span>
				<span><i class="fa fa-power-off"></i> Déconnexion</span>
			</div>
		</header>
		
		<nav>
			<div><span><img src="applications/explorer/icon.png" /></span></div>
			<div><span><img src="applications/organize/icon.png" /></span></div>
			<div><span><img src="applications/document/icon.png" /></span></div>
			<div><span><img src="applications/media/icon.png" /></span></div>
			<div><span><img src="applications/code/icon.png" /></span></div>
		</nav>
		
		<section></section>
	</body>
</html>