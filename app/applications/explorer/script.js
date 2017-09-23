var interact =
{
    _init: function()
    {
        interact.refresh();
    },
    
    showLoader: function()
    {
        var loader = $("#loader");
        
        loader.style.opacity = 1;
        loader.style.transform = "scale(1)";
    },
    
    hideLoader: function()
    {
        var loader = $("#loader");
        
        loader.style.opacity = 0;
        loader.style.transform = "scale(0)";
    },
    
    refresh: function()
    {
        interact.showLoader();
        
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
                
                interact.hideLoader();
            }
        });
    },
    
    popup:
    {
        triggerTransfertsPopup: function()
        {
            $("#popup_transferts").style.opacity = 1;
            $("#popup_transferts").style.transform = "scale(1)";
        },
        
        closePopupTransferts: function()
        {
            $("#popup_transferts").style.opacity = 0;
            $("#popup_transferts").style.transform = "scale(0)";
        }
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
        
        add_folder: function()
        {
            interact.openPopup();
            
            $("#popup span").innerHTML = `
                <h1>Créer un nouveau dossier</h1>
                <input type='text' placeholder='Nom de votre dossier...' />
                <input type='button' value='Créer' onclick='interact.actionsAfterClick.add_folder();' /><br />
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
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
            }
            
            if(nb_files_selected == 1 && nb_folders_selected == 0)
            {
                toolbar.innerHTML = `
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsAfterClick.open();'><img src='images/actions/open.png' /></span>
                    <span onclick='interact.actionsOnClick.rename();'><img src='images/actions/rename.png' /></span>
                    <span onclick='interact.actionsOnClick.delete();'><img src='images/actions/delete.png' /></span>
                    <span onclick='interact.actionsAfterClick.copy();'><img src='images/actions/copy.png' /></span>
                    <span onclick='interact.actionsAfterClick.cut();'><img src='images/actions/cut.png' /></span>
                    <span onclick='interact.actionsAfterClick.download();'><img src='images/actions/download.png' /></span>
                    <span onclick='interact.actionsAfterClick.pin();'><img src='images/actions/pin.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
            }
            
            if(nb_files_selected > 1 && nb_folders_selected == 0)
            {
                toolbar.innerHTML = `
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsOnClick.delete();'><img src='images/actions/delete.png' /></span>
                    <span onclick='interact.actionsAfterClick.copy();'><img src='images/actions/copy.png' /></span>
                    <span onclick='interact.actionsAfterClick.cut();'><img src='images/actions/cut.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
            }
            
            if(nb_files_selected == 0 && nb_folders_selected == 1)
            {
                toolbar.innerHTML = `
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsAfterClick.open();'><img src='images/actions/open.png' /></span>
                    <span onclick='interact.actionsOnClick.rename();'><img src='images/actions/rename.png' /></span>
                    <span onclick='interact.actionsOnClick.delete();'><img src='images/actions/delete.png' /></span>
                    <span onclick='interact.actionsAfterClick.copy();'><img src='images/actions/copy.png' /></span>
                    <span onclick='interact.actionsAfterClick.cut();'><img src='images/actions/cut.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
            }
            
            if(nb_files_selected == 0 && nb_folders_selected > 1)
            {
                toolbar.innerHTML = `
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsOnClick.delete();'><img src='images/actions/delete.png' /></span>
                    <span onclick='interact.actionsAfterClick.copy();'><img src='images/actions/copy.png' /></span>
                    <span onclick='interact.actionsAfterClick.cut();'><img src='images/actions/cut.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
            }
            
            if(nb_files_selected + nb_folders_selected >= 2)
            {
                toolbar.innerHTML = `
                    <span onclick='interact.actionsOnClick.add_file();'><img src='images/actions/add_file.png' /></span>
                    <span onclick='interact.actionsOnClick.add_folder();'><img src='images/actions/add_folder.png' /></span>
                    <span onclick='interact.actionsOnClick.delete();'><img src='images/actions/delete.png' /></span>
                    <span onclick='interact.actionsAfterClick.copy();'><img src='images/actions/copy.png' /></span>
                    <span onclick='interact.actionsAfterClick.cut();'><img src='images/actions/cut.png' /></span>
                    <span onclick='interact.actionsAfterClick.paste();'><img src='images/actions/paste.png' /></span>
                `;
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
        },
        
        add_folder: function()
        {
            var name = $("#popup input")[0].value;
            
            ajax({
                type: "POST",
                url: "../../core/router.php",
                async: true,
                params: "module=explorer&action=add_folder&params=" + name,
                complete: function(xhr)
                {
                    $("#popup .return").innerHTML = xhr.responseText;

                    interact.refresh();
                }
            });
        },
        
        openElement: function(element)
        {
            var nb_folders_selected = ($(".element-folder.selected") == null) ? 0 : document.querySelectorAll(".element-folder.selected").length;
            var nb_files_selected = ($(".element-file.selected") == null) ? 0 : document.querySelectorAll(".element-file.selected").length;

            if(element.classList.contains("element-folder"))
            {
                var token_folder = element.getAttribute("data-token");
                
                interact.actionsAfterClick.goFolder(token_folder);
            }
        
            if(element.classList.contains("element-file"))
            {
                
            }
        },
        
        goFolder: function(token_folder)
        {
            ajax({
                type: "POST",
                url: "../../core/router.php",
                async: true,
                params: "module=explorer&action=go_folder&params=" + token_folder,
                complete: function(xhr)
                {
                    interact.refresh();
                }
            });
        }
    },
    
    upload:
    {
        files: [],
        formData: [],
        nb_files: 0,
        completed_files: 0,
        
        get_formData: function()
        {
            return interact.upload.formData;
        },
        
        appendFilesBeforeUpload: function()
        {
            var files = $("#popup_transferts #upload_files").files;
            var list = $("#popup_transferts table");
            
            interact.upload.files = files;
            
            list.innerHTML = "";
            
            for(var i = 0; i < files.length; i++)
            {
                cmd(files[i].webkitRelativePath);
                var tr = document.createElement("tr");
                tr.id = btoa(unescape(encodeURIComponent(files[i].webkitRelativePath))).replace(/=/g, '');
                tr.innerHTML = `
                    <td>${files[i].webkitRelativePath}</td>
                    <td>En attente...</td>
                    <td style='cursor: pointer;' onclick='interact.upload.deleteFile("${btoa(unescape(encodeURIComponent(files[i].webkitRelativePath).replace(/=/g, '')))}");'>Supprimer</td>
                `;
                
                list.appendChild(tr);
            }
        },
        
        deleteFile: function(b_name)
        {
            var list = $("#popup_transferts table");
            
            var files = interact.upload.files;
            
            for(let value of files)
            {
                if(b_name == btoa(unescape(encodeURIComponent(value["webkitRelativePath"]))).replace(/=/g, ''))
                {
                    list.removeChild($("#" + b_name));
                }
            }
        },
        
        uploadFiles: function()
        {
            interact.upload.formData = new FormData();
            
            interact.upload.nb_files = interact.upload.files.length;
            
            for(let value of interact.upload.files)
            {
                if($("#"+btoa(unescape(encodeURIComponent(value["webkitRelativePath"]))).replace(/=/g, '')) != undefined)
                {
                    interact.upload.readFile(value);
                }
            }
        },
        
        readFile: function(file)
        {
            $("#"+btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '') + " td")[1].innerHTML = "Lecture du fichier...";
            
            var reader = new FileReader();
                    
            var content_file = reader.readAsText(file);

            reader.onloadend = function(e)
            {
                if(reader.readyState == 2)
                {
                    interact.upload.encryptFile(file, reader.result);
                }
            }
        },
        
        encryptFile: function(file, content)
        {
            $("#"+btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '') + " td")[1].innerHTML = "Chiffrement du fichier...";
            
            openpgp.initWorker({ path:'../../public/js/openpgp.worker.js' });
            openpgp.config.aead_protect = true;
            
            var pubKey = atob(localStorage.getItem("pbk"));
            
            var options = {
                data: content,
                publicKeys: openpgp.key.readArmored(pubKey).keys,
            };

            openpgp.encrypt(options).then(function(ciphertext) 
            {
                $("#"+btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '') + " td")[1].innerHTML = "Chiffrement terminé...";
                
                var encrypted = btoa(ciphertext.data);
                
                interact.upload.uploadIt(file, encrypted);
            });
        },
        
        uploadIt: function(file, encrypted_content)
        {
            $("#" + btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '') + " td")[1].innerHTML = "Début de l'upload...";
            
            var formData = new FormData();
            
            var blob = new Blob([encrypted_content], { type: "text/plain"});
            
            formData.append("file", blob, file["webkitRelativePath"]);
            formData.append("tree", file["webkitRelativePath"]);
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "../../core/uploader.php", true);
            xhr.send(formData);
            
            xhr.onprogress = function(e)
            {
                var progress = Math.round(e.loaded * 100 / e.total);
                
                $("#" + btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '') + " td")[1].innerHTML = "En cours d'upload...";
                
                if(progress == 100)
                {
                    $("#popup_transferts table").removeChild($("#" + btoa(unescape(encodeURIComponent(file["webkitRelativePath"]))).replace(/=/g, '')));   
                }
            }
        }
    }
};