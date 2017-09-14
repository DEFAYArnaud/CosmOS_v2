// Permet de simplifier l'écriture des document.querySelector() et document.querySelectorAll() (inspiré de JQuery)
var $ = function(str)
{
	if(document.querySelectorAll(str).length == 1 || document.querySelectorAll(str).length == 0)
	{
		return document.querySelector(str);
	}
	else
	{
		return document.querySelectorAll(str);
	}
}

// Permet de simplifier l'écriture des console.log()
var cmd = function(content)
{
	console.log(content);
}

// Permet de simplifier les requêtes AJAX
var ajax = function(params)
{
	var xhr = new XMLHttpRequest();
	xhr.open(params.type, params.url, params.async);
	
	if(params.type == "POST") xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhr.send(params.params);
	
	xhr.onreadystatechange = function(event)
	{
		if(xhr.status == 200 && xhr.readyState == 4)
		{
			params.complete(xhr, event);
		}
	}
	
	if(typeof params.progress == "function")
	{
		xhr.onprogress = function(event)
		{
			params.progress(event);
		}	
	}
}