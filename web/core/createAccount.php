<?php
	session_start();

	require_once("bdd.php");

	if(isset($_POST['privKey']) && isset($_POST['pubKey']) && isset($_POST['check_passphrase']))
	{
		if(isset($_SESSION['temp_session']))
		{
			$storages = array(
				"free" => 5,
				"premium" => 15,
				"premium_plus" => 50
			);
			
			$token = hash("sha512", microtime(true));
			
			// On insère le compte dans la base de données
			$req = $bdd->prepare("INSERT INTO users (id, token, name, mail, password, check_passphrase, plan, storage_size, paymentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
			$req->execute(array(
				null,
				$token,
				$_SESSION['temp_session']['name'],
				$_SESSION['temp_session']['mail'],
				$_SESSION['temp_session']['password'],
				$_POST['check_passphrase'],
				$_SESSION['temp_session']['plan'],
				$storages[$_SESSION['temp_session']['plan']],
				$_SESSION['temp_session']['paymentID']
			));
			
			// On insère les clés dans la base de données
			$req = $bdd->prepare("INSERT INTO rsa_keys (id, user_id, pubKey, privKey) VALUES (?, ?, ?, ?)");
			$req->execute(array(
				null,
				$token,
				$_POST['pubKey'],
				$_POST['privKey']
			));
			
			// On créé la session et on supprime la session temporaire
			$_SESSION['session'] = array(
				"name" => $_SESSION['temp_session']['name'],
				"token" => $token,
				"mail" => $_SESSION['temp_session']['mail'],
				"plan" => $_SESSION['temp_session']['plan'],
				"storage" => $storages[$_SESSION['temp_session']['plan']]
			);
			
			// On créé les dossiers utilisateur
			mkdir("../../app/storage/{$token}/");
			mkdir("../../app/storage/{$token}/files/");
			mkdir("../../app/storage/{$token}/workspace/");
			
			// On créé les fichiers utilisateur
			file_put_contents("../../app/storage/{$token}/workspace/design.json", json_encode(array(
				"background" => "bg5.jpg",
				"header" => "#3f51b5",
				"window_size" => "big"
			)));
			
			unset($_SESSION['temp_session']);
			
			exit("@ok");
		}
	}
?>