<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" lang="fr/FR" />
		<title>CosmOS</title>
		
		<link rel="stylesheet" type="text/css" href="public/css/index.css" />
		<link rel="stylesheet" type="text/css" href="public/css/about.css" />
	</head>
	
	<body>
		<?php
			// Page "Index"
			require_once("static/index.html");
		
			// Page "A propos"
			require_once("static/about.html");
		
			// Page "Fonctionnalités"
			require_once("static/features.html");
		
			// Page "Avancement"
			require_once("static/roadmap.html");
		
			// Page "Prix"
			require_once("static/prices.html");
		
			// Page "Faire un don"
			require_once("static/donate.html");
		?>
	</body>
</html>