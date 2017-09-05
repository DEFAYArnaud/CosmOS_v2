<?php
	session_start();

	require_once("bdd.php");

	if(isset($_POST['id']) && isset($_POST['mail']) && isset($_POST['password']) && isset($_POST['plan']) && $_POST['step'] == 1)
	{
		$req = $bdd->prepare("SELECT * FROM users WHERE mail = ? AND name = ?");
		$req->execute(array(
			$_POST['mail'],
			$_POST['id']
		));
		
		if(count($req->fetchAll()) == 0)
		{
			$_SESSION['temp_session'] = array(
				"name" => $_POST['id'],
				"mail" => $_POST['mail'],
				"password" => hash("sha512", $_POST['password']),
				"plan" => $_POST['plan'],
				"paymentID" => "noPayment"
			);
			
			exit("@ok");
		}
		
		exit("@error");
	}
?>