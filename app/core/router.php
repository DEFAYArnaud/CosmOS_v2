<?php
	session_start();

	header('Content-Type: text/html; charset=utf-8');

	if(isset($_GET['module'])) $_POST['module'] = $_GET['module'];
	if(isset($_GET['action'])) $_POST['action'] = $_GET['action'];
	if(isset($_GET['params'])) $_POST['params'] = $_GET['params'];

	if(isset($_POST['module']))
	{
		$_routes = array(
			// Système
			"sys/logout",
			"sys/changeHeaderColor",
			"sys/changeBackground",
			"sys/initDesign",
		);
		
		$module = $_POST['module'];
		$action = (isset($_POST['action'])) ? $_POST['action'] : "default";
		$params = (isset($_POST['params'])) ? base64_encode($_POST['params']) : "";
		
		if(in_array("{$module}/{$action}", $_routes))
		{
			require_once("bdd.php");
			require_once("modules/{$module}/controller.php");
			
			eval("{$module}::{$action}(\"{$params}\");");
		}
	}
?>