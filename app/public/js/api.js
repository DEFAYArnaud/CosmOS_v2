var API =
{
	_init: function()
	{
		ajax({
            type: "POST",
            url: "core/router.php",
            async: true,
            params: `module=sys&action=initDesign`,
            complete: function(xhr, event)
            {
                if(xhr.responseText.indexOf("@ok") != -1)
                {
                    var content = xhr.responseText.replace("@ok", "");
                    
                    cmd(content);
                    
                    var bg = content.split("//////")[0];
                    var color = content.split("//////")[1];
                    
                    $("section").style = "background: url('public/backgrounds/"+bg+"');background-size: cover;";
                    $("header").style.backgroundColor = color;
                    $("nav").style.backgroundColor = color;
                }
            }
        });
	},
	
	system:
	{
		states:
		{
			logout: function()
			{
				ajax({
					type: "POST",
					url: "core/router.php",
					async: true,
					params: `module=sys&action=logout`,
					complete: function(xhr, event)
					{
						if(xhr.responseText.indexOf("@ok") != -1)
						{
                            localStorage.clear();
                         
							document.location.href = "../web/index.php";
						}
					}
				});
			}
		}
	},
	
	applications:
	{
		trigger: function(id)
        {
            if($("#app_" + id) == undefined)
            {
                var window = document.createElement("div");
                window.id = "app_" + id;   
                window.classList.add("window");
                window.innerHTML = `<iframe src='applications/${id}/app.html'></iframe>`;
                
                $("section").appendChild(window);
                
                setTimeout(function(){
                    window.style.opacity = 1;
                    window.style.transform = "scale(1)";
                }, 100);
            }
        }
	}
};