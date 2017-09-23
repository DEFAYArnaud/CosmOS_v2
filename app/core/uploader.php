<?php
    session_start();

    if(isset($_SESSION['session']) && isset($_POST['tree']) && isset($_FILES))
    {
        require_once("bdd.php");
        require_once("constantes.php");
        
        if($_FILES["file"]["error"] != 0)
        {
            exit("error_unexcepted");
        }
        
        if($_FILES["file"]["size"] > 150 * pow(2, 20))
        {
            exit("error_size");
        }
        
        $tree = "/".substr($_POST["tree"], 0, strlen($_POST['tree']) - strlen($_FILES["file"]["name"]));
        
        if(count((new BDD())->_request("SELECT * FROM elements WHERE name = ? AND tree = ? AND NOT type = ? AND owner = ?", array($_FILES["file"]["name"], substr($_SESSION['explorer']['directory'], 0, -1).$tree, "folder", $_SESSION['session']['token']))) == 0)
        {
            $token = sha1(microtime());
            $extension = str_replace(".", "", substr($_FILES["file"]["name"], strrpos($_FILES["file"]["name"], "."), strlen($_FILES["file"]["name"])));
            $type = "other";
            
            foreach($_SESSION['extensions'] as $k => $ext)
            {
                if(in_array($extension, $ext))
                {
                    $type = $k;
                    break;
                }
            }
            
            move_uploaded_file($_FILES["file"]["tmp_name"], "../storage/{$_SESSION['session']['token']}/files/{$token}.data");
            
            (new BDD())->_request("INSERT INTO elements (id, token, name, type, owner, tree, is_public, checksum, is_fav) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", array(
                null, $token, $_FILES["file"]["name"], $type, $_SESSION['session']['token'], substr($_SESSION['explorer']['directory'], 0, -1).$tree, 0, 0, 0
            ));
            
            // Création des dossiers
            $dirs = explode("/", $tree);
            
            $all_folders = (new BDD())->_request("SELECT * FROM elements WHERE owner = ? AND type = ? AND tree LIKE ?", array($_SESSION['session']['token'], "folder", "%{$_SESSION['explorer']['directory']}%"));
            
            var_dump($all_folders);
            
            $tree = "";
            
            for($i = 0; $i < count($dirs)-2; $i++)
            {
                $tree .= $dirs[$i] . "/";
                
                $current_tree = $tree;
                $current_dir = $dirs[$i+1];
                
                $token = sha1(microtime());
                
                $exists = 0;
                
                for($a = 0; $a < count($all_folders); $a++)
                {
                    if($all_folders[$a]["name"] == $current_dir && $all_folders[$a]["tree"] == substr($_SESSION['explorer']['directory'], 0, -1).$current_tree)
                    {
                        $exists = 1;
                        break;
                    }
                }
                
                if($exists == 0)
                {
                    (new BDD())->_request("INSERT INTO elements (id, token, name, type, owner, tree, is_public, checksum, is_fav) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", array(
                        null, $token, $current_dir, "folder", $_SESSION['session']['token'], substr($_SESSION['explorer']['directory'], 0, -1).$current_tree, 0, 0, 0
                    ));
                }
            }
            
            exit("ok");
        }
        else
        {
            exit("error_exists");
        }
    }
    else
    {
        exit("error_access");
    }
?>