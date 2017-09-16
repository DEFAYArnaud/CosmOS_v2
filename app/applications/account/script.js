var interact =
{    
    close: function()
    {
        parent.$("#app_account").style.opacity = "0";
        parent.$("#app_account").style.transform = "scale(0)";
        
        setTimeout(function(){parent.$("section").removeChild(parent.$("#app_account"));}, 400);
    }
};