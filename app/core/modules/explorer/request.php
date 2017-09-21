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
                $directories = explode($_SESSION['explorer']['directory'], "/");
            }
            
            for($i = 0; $i < count($directories) - 1; $i++)
            {
                if($i == 0)
                {
                    echo "<span class='dir'>Mes fichiers</span>";
                }
                else
                {
                    echo "<span class='dir'>{$directories[$i]}</span>";   
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
                    
                    echo "<p class='element-{$type}' onclick='interact.actionsOnClick.selectElement(this);' ondblclick='interact.actionsOnClick.openElement(this);'><img src='images/types/{$elements[$l][$c]["type"]}.png' /><br />{$elements[$l][$c]["name"]}</p>";
                }
                
                echo "</span>";
            }
        }
        
        public static function add_file($name, $content)
        {
            $return = self::bdd()->_request("SELECT * FROM elements WHERE name = ? AND tree = ? AND owner = ?", array($name, $_SESSION['explorer']['directory'], TOKEN));
            
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
            
            if(count($return) == 0)
            {
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
    }
?>