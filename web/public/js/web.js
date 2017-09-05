var web =
{
	popup:
	{
		open: function()
		{
			var popup = $("#popup");
			
			popup.style = "transform:scale(1);opacity:1;";
		},
		
		close: function()
		{
			var popup = $("#popup");
			
			popup.style = "transform:scale(0);opacity:0;";
		}
	},
	
	showLoginPopup: function()
	{
		document.location.href = "#index";
		
		web.popup.open();
		
		$("#popup .content span").style.textAlign = "center";
		
		$("#popup .title span").innerHTML = "Se connecter";
		
		$("#popup .content span").innerHTML = `
			<input type="text" placeholder="Adresse mail..." />
			<input type="password" placeholder="Mot de passe..." />
			<input type="password" placeholder="Phrase secrète..." /><br />
			<a href="#" style="color:#2196f3;" onclick="web.showRegisterPopup();">Pas encore inscrit ?</a> - <a href="#" style="color:#2196f3;" onclick="web.showForgotPopup();">Mot de passe oublié ?</a>
			<p></p>
			`;
		
		$("#popup .buttons span").innerHTML = `
			<input type="button" value="Se connecter" onclick="web.actions.login();" />
			<input type="button" value="Fermer" onclick="web.popup.close();" />
		`;
	},
	
	showRegisterPopup: function()
	{
		document.location.href = "#index";
		
		web.popup.open();
		
		$("#popup .content span").style.textAlign = "center";
		
		$("#popup .title span").innerHTML = "S'inscrire";
		
		$("#popup .content span").innerHTML = `
			<input type="text" placeholder="Nom de compte..." value="Romain" />
			<input type="text" placeholder="Adresse mail..." value="romain.claveau@protonmail.ch" />
			<input type="password" placeholder="Mot de passe..." value="coucou" />
			<input type="password" placeholder="Phrase secrète..." value="coucou" />
			<select>
				<option value='free' name='Moonwalker' selected>Moonwalker (0€ / mois)</option>
				<option value='premium' name='Planetwalker'>Planetwalker (2€ / mois)</option>
				<option value='premium_plus' name='Spacewalker'>Spacewalker (5€ / mois)</option>
			</select><br />
			<a href="#" style="color:#2196f3;" onclick="web.showLoginPopup();">Déjà inscrit ?</a>
			<p></p>
		`;
		
		$("#popup .buttons span").innerHTML = `
			<input type="button" value="S'inscrire" onclick="web.actions.register();" />
			<input type="button" value="Fermer" onclick="web.popup.close();" />
		`;
	},
	
	showForgotPopup: function()
	{
		document.location.href = "#index";
	},
	
	actions:
	{
		login: function()
		{
			var mail = $("#popup input")[0].value;
			var password = $("#popup input")[1].value;
			var passphrase = $("#popup input")[2].value;
			
			ajax({
				type: "POST",
				url: "core/login.php",
				async: true,
				params: `mail=${mail}&password=${password}`,
				complete: function(xhr, event)
				{
					if(xhr.responseText.indexOf("@ok") != -1)
					{
						$("#popup p").innerHTML = "Authentification effectuée avec succès ! Nous allons maintenant vérifier votre phrase secrète...";
						
						var privKey = xhr.responseText.replace("@ok", "").split("//////")[0];
						var check_passphrase = xhr.responseText.replace("@ok", "").split("//////")[1];
						var pubKey = xhr.responseText.replace("@ok", "").split("//////")[2];
						
						web.crypto.tryPassphrase(passphrase, privKey, check_passphrase, pubKey);
					}
					else
					{
						$("#popup p").innerHTML = "Une erreur s'est produite lors de l'authentification.";
					}
				}
			});
		},
		
		register: function()
		{
			var id = $("#popup input")[0].value;
			var mail = $("#popup input")[1].value;
			var password = $("#popup input")[2].value;
			var passphrase = $("#popup input")[3].value;
			var plan = $("#popup select").options[$("#popup select").selectedIndex].value;
			var plan_name = $("#popup select").options[$("#popup select").selectedIndex].getAttribute("name");
			var prices = 
			{
				"premium": 2,
				"premium_plus": 5
			};
			
			ajax({
				type: "POST",
				url: "core/register.php",
				async: true,
				params: `id=${id}&mail=${mail}&password=${password}&plan=${plan}&step=1`,
				complete: function(xhr, event)
				{
					if(xhr.responseText == "@ok")
					{
						if(plan == "free")
						{
							$("#popup p").innerHTML = "Votre compte a été créé avec succès ! La génération des clés RSA commencera dans quelques instants...";
							
							web.crypto.generateKeys(id, mail, passphrase);
						}
						else
						{								
							$("#popup .title span").innerHTML = "Paiement";
							
							$("#popup .content span").style.textAlign = "justify";
							$("#popup .content span").innerHTML = `
								Vous avez choisi d'acheter un plan <b>${plan_name}</b> pour une valeur de <o>${prices[plan]}€ par mois</o>, c'est-à-dire <o>${prices[plan]*12}€ par an</o>.<br /><br />
								<i>En achetant ce plan, vous disposez de 7 jours (168 heures à partir du paiement) pour faire valoir votre droit de rétractation. Passé ce délai, vous ne pourrez plus exiger le remboursement du plan.</i><br /><br />
								L'achat du plan s'effectue uniquement sur Paypal. Le montant débité sera égal au prix du plan sur l'année (c'est-à-dire <o>${prices[plan]*12}€</o> dans votre cas, le prix par mois n'étant donné qu'à titre d'information).<br /><br />
								<p style="text-align: center;" id="button_paypal"></p>
							`;
							$("#popup .buttons span").innerHTML = `<input type="button" value="Fermer" onclick="web.popup.close()" />`;
							
							paypal.Button.render(
							{
								env: 'sandbox',

								style: 
								{
									label: 'buynow',
									fundingicons: true, // optional
									branding: true, // optional
									size:  'responsive', // small | medium | large | responsive
									shape: 'pill',   // pill | rect
									color: 'gold'   // gold | blue | silve | black
								},

								client: 
								{
									sandbox:    'AeGfnyRHGdnfQsZurJx3rJRkerTCPabYY1IFkfvdJyYPCVFbjEYhs4RFLb3WMjuE4l_2NOmQYS56Fi97',
									production: 'AaqZZtuvOJhjsbmBduqFHZP_mMGEVTDlr_XfwGXsYglSdfu3vkIVkL6FeCzlNlRpEzf3F0jeSWbAvT07'
								},

								payment: function(data, actions) 
								{
									return actions.payment.create(
									{
										transactions: [
											{
												amount: 
												{ 
													total: (prices[plan]*12), 
													currency: 'EUR' 
												}
											}
										]
									});
								},

								onAuthorize: function(data, actions) 
								{
									return actions.payment.execute().then(function() 
									{
										var paymentID = data.paymentID;
										
										// On vérifie le paiement
										ajax({
											type: "POST",
											url: "core/payment_check.php",
											async: true,
											params: `paymentID=${paymentID}`,
											complete: function(xhr, event)
											{
												if(xhr.responseText == "@ok")
												{
													$("#popup .content span").style.textAlign = "center";
													$("#popup .content span").innerHTML = `
														Le paiement a été effectué avec succès ! La génération des clés RSA commencera dans quelques instants...
													`;
													
													web.crypto.generateKeys(id, mail, passphrase);
												}
											}
										});
									});
								}

							}, "#button_paypal");	
						}
					}
					else
					{
						$("#popup p").innerHTML = "Une erreur est survenue lors de la création du compte.";
					}
				}
			});
		},
		
		createAccount(privKey, pubKey)
		{
			cmd("test");
			$("#popup .title span").innerHTML = "Finalisation de votre inscription";
							
			$("#popup .content span").style.textAlign = "center";
			$("#popup .content span").innerHTML = `
				Vos clés ont été générées avec succès ! Nous finalisons votre inscription. Ceci ne devrait prendre que quelques instants...
			`;
			
			$("#popup .buttons span").innerHTML = `<input type="button" value="Fermer" onclick="web.popup.close()" />`;
			
			var options = 
			{
				data: 'abcdefghijklmnopqrstuvwxyz0123456789',
				publicKeys: openpgp.key.readArmored(atob(pubKey)).keys,
			};

			openpgp.encrypt(options).then(function(ciphertext) 
			{
				var check_passphrase = btoa(ciphertext.data);
				
				ajax({
					type: "POST",
					url: "core/createAccount.php",
					async: true,
					params: `privKey=${privKey}&pubKey=${pubKey}&check_passphrase=${check_passphrase}`,
					complete: function(xhr, event)
					{
						if(xhr.responseText == "@ok")
						{
							$("#popup .content span").innerHTML = "Création terminée ! Vous allez être redirigé(e) dans quelques instants...";

							setTimeout(function()
							{
								document.location.href = "../app/index.php";
							}, 1500);
						}
						else
						{
							$("#popup .content span").innerHTML = "Une erreur s'est produite lors de la création de votre compte.";
						}
					}
				});
			});
		}
	},
	
	crypto:
	{
		generateKeys: function(id, mail, passphrase)
		{
			// Taille de la clé (en bits)
			const keylength = 4096;
			
			// Initialisation du webworker
			openpgp.initWorker({ path:'public/js/openpgp.worker.min.js' });
			openpgp.config.aead_protect = true;
			
			// Génération de la nouvelle paire de clés
			var options =
			{
				userIds: [{
					name: id,
					email: mail
				}],
				numbits: keylength,
				passphrase: passphrase
			};
			
			openpgp.generateKey(options).then(function(key) 
			{
				var privKey = btoa(key.privateKeyArmored);
				var pubKey = btoa(key.publicKeyArmored);
				
				localStorage.setItem("pp", btoa(passphrase));
				localStorage.setItem("pbk", pubKey);
				localStorage.setItem("pvk", privKey);
				
				web.actions.createAccount(privKey, pubKey);
			});
		},
		
		tryPassphrase(passphrase, privKey, check_passphrase, pubKey)
		{			
			var privKeyObj = openpgp.key.readArmored(atob(privKey)).keys[0];
			privKeyObj.decrypt(passphrase);
			
			options = 
			{
				message: openpgp.message.readArmored(atob(check_passphrase)),
				privateKey: privKeyObj
			};
			
			openpgp.decrypt(options).then(function(plaintext) 
			{
				if(plaintext.data == "abcdefghijklmnopqrstuvwxyz0123456789")
				{
					$("#popup p").innerHTML = "Vérification terminée ! Vous allez être redirigé(e) dans quelques instants...";
					
					// On enregistre en local les clés et la phrase secrète
					localStorage.setItem("pp", btoa(passphrase));
					localStorage.setItem("pbk", pubKey);
					localStorage.setItem("pvk", privKey);
					
					setTimeout(function(){
						document.location.href = "../app/index.php";
					}, 1500);
				}
				else
				{
					$("#popup p").innerHTML = "Phrase secrète incorrecte";
				}
			});
		}
	}
};