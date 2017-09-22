<?php
    define("TOKEN", $_SESSION['session']['token']);

    class request
    {        
        public static function bdd() { return new BDD(); }
        
        public static function getCurrentDirectory()
        {
            if(!isset($_SESSION['explorer']['directory']))
            {
                $_SESSION['explorer']['directory'] = "/";
                
                $directories = explode("/", "/");
            }
            else
            {
                $directories = explode("/", $_SESSION['explorer']['directory']);
            }
            
            $link = "";
            
            for($i = 0; $i < count($directories)-1; $i++)
            {
                if($i == 0)
                {
                    $link .= "/";
                    
                    echo "<span class='dir' onclick='interact.actionsAfterClick.goFolder(\"{$link}\");'>Mes fichiers</span>";
                }
                else
                {
                    $link .= "{$directories[$i]}/";
                    
                    echo "<span class='dir' onclick='interact.actionsAfterClick.goFolder(\"{$link}\");'>{$directories[$i]}</span>";   
                }

                if($i != count($directories)-2) echo "<span class='sep'>&gt;</span>";
            }
        }
        
        public static function getElements()
        {
            $folders = self::bdd()->_request("SELECT * FROM elements WHERE owner = ? AND type = ? AND tree = ? ORDER BY name ASC", array(TOKEN, "folder", $_SESSION['explorer']['directory']));
            $files = self::bdd()->_request("SELECT * FROM elements WHERE owner = ? AND type NOT IN (?) AND tree = ? ORDER BY name ASC", array(TOKEN, "folder", $_SESSION['explorer']['directory']));
        
            $elements = array();
            
            for($i = 0; $i < count($folders); $i++)
            {
                $elements[] = $folders[$i];
            }
            
            for($i = 0; $i < count($files); $i++)
            {
                $elements[] = $files[$i];
            }
            
            $elements = array_chunk($elements, 6);
            
            for($l = 0; $l < count($elements); $l++)
            {
                echo "<span>";
                
                for($c = 0; $c < count($elements[$l]); $c++)
                {
                    $type = ($elements[$l][$c]["type"] == "folder") ? "folder" : "file";
                    
                    echo "<p data-token='{$elements[$l][$c]["token"]}' class='element-{$type}' onclick='interact.actionsOnClick.selectElement(this);' ondblclick='interact.actionsAfterClick.openElement(this);'><img src='images/types/{$elements[$l][$c]["type"]}.png' /><br />{$elements[$l][$c]["name"]}</p>";
                }
                
                echo "</span>";
            }
        }
        
        public static function add_file($name, $content)
        {
            $return = self::bdd()->_request("SELECT * FROM elements WHERE name = ? AND tree = ? AND owner = ? AND type NOT IN ?", array($name, $_SESSION['explorer']['directory'], TOKEN, "folder"));
                        
            if(count($return) == 0)
            {
                $extension = str_replace(".", "", substr($name, strrpos($name, "."), strlen($name)));
            
                $type = "other";

                foreach($_SESSION['extensions'] as $k => $ext)
                {
                    if(in_array($extension, $ext))
                    {
                        $type = $k;
                        break;
                    }
                }
                
                $token = sha1(microtime());
                
                self::bdd()->_request("INSERT INTO elements (id, token, name, type, owner, tree, is_public, checksum, is_fav) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", array(null, $token, $name, $type, TOKEN, $_SESSION['explorer']['directory'], 0, sha1($content), 0));
                
                file_put_contents("../storage/".TOKEN."/files/{$token}.data", $content);
                
                exit("Le fichier <b>$name</b> a été créé avec succès.");
            }
            else
            {
                exit("Impossible de créer le fichier <b>$name</b>, ce dernier existe déjà.");
            }
        }
        
        public static function add_folder($name)
        {
            $return = self::bdd()->_request("SELECT * FROM elements WHERE name = ? AND tree = ? AND owner = ? AND type = ?", array($name, $_SESSION['explorer']['directory'], TOKEN, "folder"));
        
            if(count($return) == 0)
            {
                $token = sha1(microtime());
                
                self::bdd()->_request("INSERT INTO elements (id, token, name, type, owner, tree, is_public, checksum, is_fav) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", array(null, $token, $name, "folder", TOKEN, $_SESSION['explorer']['directory'], 0, "", 0));
            
                exit("Le dossier <b>$name</b> a été créé avec succès.");
            }
            else
            {
                exit("Impossible de créer le dossier <b>$name</b>, ce dernier existe déjà.");
            }
        }
        
        public static function go_folder($token)
        {
            if(strpos($token, "/") >= 0 && strpos($token, "/") !== false)
            {                
                if($token != "/")
                {
                    $dirs = explode("/", $token);
                    
                    var_dump($dirs);
                
                    $name = $dirs[count($dirs)-2];
                    
                    var_dump($name);
                    
                    $tree = "";

                    for($i = 0; $i < count($dirs) - 2; $i++)
                    {
                        $tree .= $dirs[$i] . "/";
                    }
                    
                    var_dump($tree);
                    
                    $return = self::bdd()->_request("SELECT * FROM elements WHERE tree = ? AND name = ? AND type = ? AND owner = ?", array($tree, $name, "folder", TOKEN));
                
                    if(count($return) == 1)
                    {
                        $_SESSION['explorer']['directory'] = $token;
                    }
                }
                else
                {
                    $_SESSION['explorer']['directory'] = "/";
                }
            }
            else
            {
                $return = self::bdd()->_request("SELECT * FROM elements WHERE owner = ? AND token = ? AND type = ?", array(TOKEN, $token, "folder"));
                
                if(count($return) == 1)
                {
                    $_SESSION['explorer']['directory'] = $return[0]["tree"] . $return[0]["name"] . "/";
                }
            }
        }
    }
?>