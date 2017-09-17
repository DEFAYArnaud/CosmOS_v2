var interact =
{
    _init: function()
    {
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: "module=sys&action=initAccount",
            complete: function(xhr)
            {
                var content = JSON.parse(xhr.responseText);
                
                $("#informations input")[0].value = content[0]["name"];
                $("#informations input")[1].value = content[0]["mail"];
            }
        });
    },
    
    save: function(i)
    {
        var value = $("#informations input")[i].value;
        
        var args = [i, value].join(",");
        
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: `module=sys&action=saveInformations&params=${args}`,
            complete: function(xhr)
            {
                if(xhr.responseText == "@ok")
                {
                    $("#informations .fa")[i].classList.remove("fa-save");
                    $("#informations .fa")[i].classList.add("fa-check");
                }
                else
                {
                    $("#informations .fa")[i].classList.remove("fa-save");
                    $("#informations .fa")[i].classList.add("fa-times");
                }
                
                setTimeout(function(){
                    $("#informations .fa")[i].classList.remove("fa-check");
                    $("#informations .fa")[i].classList.remove("fa-times");
                    $("#informations .fa")[i].classList.add("fa-save");
                }, 1500);
            }
        });
    },
    
    savePassphrase: function()
    {
        var privKey = localStorage.getItem("pvk");
        var current_passphrase = atob(localStorage.getItem("pp"));
        var passphrase = $("#informations input")[3].value;
        
        var privKeyObj = openpgp.key.readArmored(atob(privKey)).keys[0];
        
        privKeyObj.decrypt(current_passphrase);
        privKeyObj.encrypt(passphrase);
        
        var new_key = btoa(privKeyObj.armor());
        
        localStorage.setItem("pvk", new_key);
        localStorage.setItem("pp", btoa(passphrase));
        
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: `module=sys&action=savePrivateKey&params=${new_key}`,
            complete: function(xhr)
            {
                if(xhr.responseText == "@ok")
                {
                    $("#informations .fa")[3].classList.remove("fa-save");
                    $("#informations .fa")[3].classList.add("fa-check");
                }
                else
                {
                    $("#informations .fa")[3].classList.remove("fa-save");
                    $("#informations .fa")[3].classList.add("fa-times");
                }
                
                setTimeout(function(){
                    $("#informations .fa")[3].classList.remove("fa-check");
                    $("#informations .fa")[3].classList.remove("fa-times");
                    $("#informations .fa")[3].classList.add("fa-save");
                }, 1500);
            }
        });
    },
    
    download: function(i)
    {
        if(i == 0)
        {
            var file = new File([atob(localStorage.getItem("pbk"))], "public_key.pgp", {type: "text/plain;charset=utf-8"});
        }
        else
        {
            var file = new File([atob(localStorage.getItem("pvk"))], "private_key.pgp", {type: "text/plain;charset=utf-8"});
        }
        
        saveAs(file);
    },
    
    deleteAccount: function()
    {
        var a = confirm("Êtes-vous sûr(e) de vouloir supprimer votre compte ? Tous vos fichiers seront supprimés.");
        
        if(a)
        {
            ajax({
                type: "POST",
                url: "../../core/router.php",
                async: true,
                params: `module=sys&action=deleteAccount`,
                complete: function(xhr)
                {
                    if(xhr.responseText == "@ok")
                    {
                        localStorage.clear();
                        
                        parent.document.location.href = "../web/index.php";
                    }
                }
            });
        }
    },
    
    close: function()
    {
        parent.$("#app_account").style.opacity = "0";
        parent.$("#app_account").style.transform = "scale(0)";
        
        setTimeout(function(){parent.$("section").removeChild(parent.$("#app_account"));}, 400);
    }
};