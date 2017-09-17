<?php
	session_start();
	
	if(isset($_POST['paymentID']))
	{
		// Récupération de l'access-token permettant de vérifier ensuite la validité du paiement sur Paypal
		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => "https://api.sandbox.paypal.com/v1/oauth2/token",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => "grant_type=client_credentials",
			CURLOPT_HTTPHEADER => array(
				"authorization: Basic %identifiants%",
				"cache-control: no-cache",
				"content-type: application/x-www-form-urlencoded"
			),
		));

		$response = json_decode(curl_exec($curl), true);

		// L'access-token a été correctement récupéré, nous pouvons maintenant vérifier le paiement
		$access_token = $response["access_token"];

		$curl_2 = curl_init();

		curl_setopt_array($curl_2, array(
			CURLOPT_URL => "https://api.sandbox.paypal.com/v1/payments/payment/{$_POST['paymentID']}",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"authorization: Bearer $access_token",
				"cache-control: no-cache",
				"content-type: application/json"
			),
		));

		$response_2 = json_decode(curl_exec($curl_2), true);
		$err_2 = curl_error($curl_2);

		if($err_2 == "") 
		{
			$status = $response_2["payer"]["status"];

			if($status == "VERIFIED")
			{
				$_SESSION['temp_session']['paymentID'] = $_POST['paymentID'];
				
				exit("@ok");
			}
			else
			{
				exit("@error");
			}
		}

		curl_close($curl_2);		
		curl_close($curl);
	}
?>