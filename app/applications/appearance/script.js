var interact =
{
    changeHeaderColor: function(element)
    {
        var color = element.style.backgroundColor;
        
        parent.$("header").style.backgroundColor = color;
        parent.$("nav").style.backgroundColor = color;
        
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: `module=sys&action=changeHeaderColor&params=${color}`,
        });
    },
    
    changeBackground: function(element)
    {
        var bg = element.src;
        
        parent.$("section").style = "background: url('"+bg+"');background-size:cover;";
        
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: `module=sys&action=changeBackground&params=${bg}`,
        });
    },
    
    close: function()
    {
        parent.$("#app_appearance").style.opacity = "0";
        parent.$("#app_appearance").style.transform = "scale(0)";
        
        setTimeout(function(){parent.$("section").removeChild(parent.$("#app_appearance"));}, 400);
    }
};