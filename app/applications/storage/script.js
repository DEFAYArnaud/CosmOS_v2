var interact =
{
    _init: function()
    {
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: `module=sys&action=initStorage`,
            complete: function(xhr)
            {
                var content = JSON.parse(xhr.responseText);
                
                $("#current_storage span").innerHTML = interact.compute_size(content["current_storage"]);
                $("#max_storage span").innerHTML = "sur " + content["storage_size"] + " Go";
                $("#current_bar").style.width = content["percent_storage"] + "%";
                
                for(var i = 0; i < 5; i++) $("#legend i")[i].innerHTML = content["percents"][i] + "%";
                for(var i = 0; i < 5; i++) $("#current_bar span")[i].style.width = content["percents"][i] + "%";
                
                $("#plan b").innerHTML = content["plan"];
            }
        });
    },
    
    compute_size: function(size)
    {
        if(size / Math.pow(2, 10) < 1) return size + " octet(s) utilisé(s)";
        if(size / Math.pow(2, 20) < 1) return Math.round(size / Math.pow(2, 10)) + " Ko utilisé(s)";
        if(size / Math.pow(2, 30) < 1) return Math.round(size / Math.pow(2, 20)) + " Mo utilisé(s)";
        if(size / Math.pow(2, 40) < 1) return Math.round(size / Math.pow(2, 30)) + " Go utilisé(s)";
        if(size / Math.pow(2, 50) < 1) return Math.round(size / Math.pow(2, 40)) + " To utilisé(s)";
    },
    
    view_plans: function()
    {
        API.applications.trigger("shop");
    },
    
    close: function()
    {
        parent.$("#app_storage").style.opacity = "0";
        parent.$("#app_storage").style.transform = "scale(0)";
        
        setTimeout(function(){parent.$("section").removeChild(parent.$("#app_storage"));}, 400);
    }
};