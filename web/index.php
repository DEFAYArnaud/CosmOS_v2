<?php
	// Avancement des milestones
	$roadmap_1 = 5;
	$roadmap_2 = 0;
	$roadmap_3 = 0;
	$roadmap_4 = 0;

	// Prix
	$free = 0;
	$premium = 2;
	$premium_plus = 5;
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" lang="fr/FR" />
		<title>CosmOS</title>
		
		<link rel="stylesheet" type="text/css" href="public/css/index.css" />
		<link rel="stylesheet" type="text/css" href="public/css/about.css" />
		<link rel="stylesheet" type="text/css" href="public/css/features.css" />
		<link rel="stylesheet" type="text/css" href="public/css/roadmap.css" />
		<link rel="stylesheet" type="text/css" href="public/css/prices.css" />
		<link rel="stylesheet" type="text/css" href="public/css/popup.css" />
		
		<link rel="icon" href="public/images/icon.png" />
		
		<script type="text/javascript" src="public/js/web.js"></script>
		<script type="text/javascript" src="public/js/min.js"></script>
		
		<!-- OpenPGP.js -->
		<script type="text/javascript" src="public/js/openpgp.min.js"></script>
		
		<!-- Paypal -->
		<script type="text/javascript" src="https://www.paypalobjects.com/api/checkout.js"></script>
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
		
			// Popups
			require_once("static/popup.html");
		?>
	</body>
</html>