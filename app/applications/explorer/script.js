var interact =
{
    _init: function()
    {
        interact.refresh();
    },
    
    refresh: function()
    {
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: "module=explorer&action=getCurrentDirectory",
            complete: function(xhr)
            {
                $("#nav_area").innerHTML = xhr.responseText;
            }
        });
        
        ajax({
            type: "POST",
            url: "../../core/router.php",
            async: true,
            params: "module=explorer&action=getElements",
            complete: function(xhr)
            {
                $("#elements").innerHTML = xhr.responseText;
            }
        });
    },
    
    openPopup: function()
    {
        var popup = $("#popup");
        
        if(popup.style.opacity == 0)
        {
            popup.style.opacity = 1;
            popup.style.transform = "scale(1)";
        }
        else
        {
            popup.style.opacity = 0;
            popup.style.transform = "scale(0)";
        }
    },
    
    closePopup: function()
    {
        var popup = $("#popup");
        
        if(popup.style.opacity == 1)
        {
            popup.style.opacity = 0;
            popup.style.transform = "scale(0)";
        }
    },
    
    close: function()
    {
        parent.$("#app_explorer").style.opacity = "0";
        parent.$("#app_explorer").style.transform = "scale(0)";
        
        setTimeout(function(){parent.$("section").removeChild(parent.$("#app_explorer"));}, 400);
    },
    
    actionsOnClick:
    {
        add_file: function()
        {
            interact.openPopup();
            
            $("#popup span").innerHTML = `
                <h1>Créer un nouveau fichier</h1>
                <input type='text' placeholder='Nom de votre fichier...' />
                <input type='button' value='Créer' onclick='interact.actionsAfterClick.add_file();' /><br />
                <p class='return'></p>
            `;
        },
        
        selectElement: function(element)
        {
            if(element.classList.contains("selected"))
            {
                element.classList.remove("selected");
            }
            else
            {
                element.classList.add("selected");                
            }
            
            interact.actionsAfterClick.refreshToolbar();
        }
    },
    
    actionsAfterClick:
    {
        refreshToolbar: function()
        {            
            var nb_folders_selected = ($(".element-folder.selected") == null) ? 0 : document.querySelectorAll(".element-folder.selected").length;
            var nb_files_selected = ($(".element-file.selected") == null) ? 0 : document.querySelectorAll(".element-file.selected").length;
            
            var toolbar = $("#actions_area");
            
            if(nb_files_selected + nb_folders_selected == 0)
            {
                toolbar.innerHTML = `
                    <span><img src='images/actions/add_file.png' onclick='interact.actionsOnClick.add_file();' /></span>
                    <span><img src='images/actions/add_folder.png' onclick='interact.actionsOnClick.add_folder();' /></span>
                    <span><img src='images/actions/paste.png' onclick='interact.actionsOnClick.paste();' /></span>
                `;
            }
            
            if(nb_files_selected == 1 && nb_folders_selected == 0)
            {
                
            }
            
            if(nb_files_selected > 1 && nb_folders_selected == 0)
            {
                
            }
            
            if(nb_files_selected == 0 && nb_folders_selected == 1)
            {
                toolbar.innerHTML = `
                    <span><img src='images/actions/add_file.png' onclick='interact.actionsOnClick.add_file();' /></span>
                    <span><img src='images/actions/add_folder.png' onclick='interact.actionsOnClick.add_folder();' /></span>
                    <span><img src='images/actions/open.png' onclick='interact.actionsAfterClick.open();' /></span>
                    <span><img src='images/actions/rename.png' onclick='interact.actionsOnClick.rename();' /></span>
                    <span><img src='images/actions/delete.png' onclick='interact.actionsOnClick.delete();' /></span>
                    <span><img src='images/actions/copy.png' onclick='interact.actionsAfterClick.copy();' /></span>
                    <span><img src='images/actions/cut.png' onclick='interact.actionsAfterClick.cut();' /></span>
                    <span><img src='images/actions/paste.png' onclick='interact.actionsAfterClick.paste();' /></span>
                `;
            }
            
            if(nb_files_selected == 0 && nb_folders_selected > 1)
            {
                
            }
        },
        
        add_file: function()
        {
            var name = $("#popup input")[0].value;
            
            openpgp.initWorker({ path:'../../public/js/openpgp.worker.js' });
            openpgp.config.aead_protect = true;
            
            var pubKey = atob(localStorage.getItem("ppk"));
            
            options = 
            {
                data: "",
                publicKeys: openpgp.key.readArmored(pubKey).keys,
            };

            openpgp.encrypt(options).then(function(ciphertext)
            {
                var encrypted = ciphertext.data;
                
                var args = [name, btoa(encrypted)].join("//////");
                
                ajax({
                    type: "POST",
                    url: "../../core/router.php",
                    async: true,
                    params: "module=explorer&action=add_file&params=" + args,
                    complete: function(xhr)
                    {
                        $("#popup .return").innerHTML = xhr.responseText;
                        
                        interact.refresh();
                    }
                });
            });
        }
    }
};