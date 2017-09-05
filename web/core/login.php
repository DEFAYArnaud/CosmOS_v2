<?php
	session_start();

	require_once("bdd.php");

	if(isset($_POST['mail']) && isset($_POST['password']))
	{
		$req = $bdd->prepare("SELECT * FROM users WHERE mail = ? AND password = ?");
		$req->execute(array(
			$_POST['mail'],
			hash("sha512", $_POST['password'])
		));
		
		$result = $req->fetchAll();
		
		if(count($result) == 1)
		{
			$req2 = $bdd->prepare("SELECT * FROM rsa_keys WHERE user_id = ?");
			$req2->execute(array(
				$result[0]["token"]
			));
			
			$result2 = $req2->fetchAll();
			
			if(count($result2) == 1)
			{
				$_SESSION['session'] = array(
					"name" => $result[0]["name"],
					"token" => $result[0]["token"],
					"mail" => $result[0]['mail'],
					"plan" => $result[0]['plan'],
					"storage" => $result[0]['storage_size']
				);
				
				exit("@ok".$result2[0]["privKey"]."//////".$result[0]["check_passphrase"]."//////".$result2[0]["pubKey"]);
			}
		}
		
		exit("@error");
	}
?>