<?php
	require_once("bdd.php");

	if(isset($_POST['mail']))
	{
		$req = $bdd->prepare("SELECT * FROM users WHERE mail = ?");
		$req->execute(array(
			$_POST['mail']
		));
		
		$result = $req->fetchAll();
		
		if(count($result) == 1)
		{			
			$password = random_int(0, 9) . random_int(0, 9). random_int(0, 9). random_int(0, 9). random_int(0, 9). random_int(0, 9). random_int(0, 9). random_int(0, 9). random_int(0, 9);
			
			// Multiple recipients
			$to = $_POST['mail'];

			// Subject
			$subject = 'Votre nouveau mot de passe pour CosmOS';

			// Message
			$message = "
				<html>
					<head>
				  		<title>Votre nouveau mot de passe pour CosmOS</title>
					</head>
					<body>
					 	<p>Vous avez récemment oublié votre mot de passe sur CosmOS. Ne vous inquiétez pas, nous en avons générer un nouveau pour vous : <b>{$password}</b></p>
						<p>Pensez à le changer lors de votre prochaine connexion.</p>
						<p><br /><br /></p>
						<p>Toute l'équipe de CosmOS vous souhaite une agréable journée</p>
						<p><br /><br /><br /></p>
						<p>Cordialement,<br />Romain Claveau<br /><i>Créateur du projet CosmOS</i><br />Me contacter : romain.claveau@protonmail.com ou cosmos_project@protonmail.com
					</body>
				</html>
			";

			$headers[] = 'MIME-Version: 1.0';
			$headers[] = 'Content-type: text/html; charset=utf-8';
			$headers[] = 'From: CosmOS <cosmos_project@protonmail.com>';
			
			@mail($to, $subject, $message, implode("\r\n", $headers));
			
			// Changement du mot de passe dans la base de données
			$req_update = $bdd->prepare("UPDATE users SET password = ? WHERE mail = ?");
			$req_update->execute(array(
				hash("sha512", $password),
				$_POST['mail']
			));
			
			exit("@ok");
		}
	}

	exit("@error");
?>