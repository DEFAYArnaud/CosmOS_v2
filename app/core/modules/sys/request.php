<?php
    define("TOKEN", $_SESSION['session']['token']);

    class request
    {        
        public static function bdd() { return new BDD(); }
        
        
        public static function logout()
        {
            $_SESSION['session'] = null;
            
            session_destroy();
            
            exit("@ok");
        }
        
        public static function changeHeaderColor($color)
        {
            $design_json = json_decode(file_get_contents("../storage/".TOKEN."/workspace/design.json"), true);
            
            $design_json["header"] = $color;
            
            file_put_contents("../storage/".TOKEN."/workspace/design.json", json_encode($design_json));
        }
        
        public static function changeBackground($bg)
        {
            $bg = str_replace("/", "", substr($bg, strrpos($bg, "/"), strlen($bg)));
            
            $design_json = json_decode(file_get_contents("../storage/".TOKEN."/workspace/design.json"), true);
            
            $design_json["background"] = $bg;
            
            file_put_contents("../storage/".TOKEN."/workspace/design.json", json_encode($design_json));
        }
        
        public static function getContentDesign()
        {
            $content = json_decode(file_get_contents("../storage/".TOKEN."/workspace/design.json"), true);
            
            exit("@ok".$content["background"]."//////".$content["header"]);
        }
        
        public static function getStorageInformations()
        {
            return self::bdd()->_request("SELECT plan,storage_size FROM users WHERE token = ?", array(TOKEN))[0];
        }
        
        public static function getFilesInformations()
        {
            $files = self::bdd()->_request("SELECT token,type FROM elements WHERE owner = ?", array(TOKEN));
            
            $informations = array(
                "document" => 0,
                "image" => 0,
                "video" => 0,
                "audio" => 0,
                "other" => 0
            );
            
            foreach($files as $k => $file)
            {
                $size = filesize("../storage/".TOKEN."/files/".$file["token"].".data");
                
                switch($file["type"])
                {
                    case "document":
                    case "pdf":
                        $informations["document"] += $size;
                        break;
                        
                    case "image":
                        $informations["image"] += $size;
                        break;
                        
                    case "audio":
                        $informations["audio"] += $size;
                        break;
                        
                    case "video":
                        $informations["video"] += $size;
                        break;
                        
                    default:
                        $informations["other"] += $size;
                        break;
                }
            }
            
            return $informations;
        }
        
        public static function computePercents($informations, $quota)
        {
            $max_storage = $informations["storage_size"] * pow(2, 30); // ... Gio
            $current_size = ($quota["document"] + $quota["image"] + $quota["audio"] + $quota["video"] + $quota["other"]);
            
            if($current_size == 0) $current_size = 1;
            
            $current_percent = floor($current_size * 100 / $max_storage);
            
            $percents = array();
            
            foreach($quota as $k => $type)
            {
                $percents[] = floor($type * 100 / $current_size);
            }
            
            return array(
                "plan" => $informations["plan"],
                "storage_size" => $informations["storage_size"],
                "percent_storage" => $current_percent,
                "percents" => $percents,
                "current_storage" => $current_size
            );
        }
        
        public static function initAccount()
        {
            return json_encode(self::bdd()->_request("SELECT name,mail FROM users WHERE token = ?", array(TOKEN)));
        }
        
        public static function saveInformations($nb, $value)
        {
            switch($nb)
            {
                case 0:
                    self::bdd()->_request("UPDATE users SET name = ? WHERE token = ?", array($value, TOKEN));
                    $_SESSION['session']['name'] = $value;
                    break;
                    
                case 1:
                    self::bdd()->_request("UPDATE users SET mail = ? WHERE token = ?", array($value, TOKEN));
                    $_SESSION['session']['mail'] = $value;
                    break;
                    
                case 2:
                    self::bdd()->_request("UPDATE users SET password = ? WHERE token = ?", array(hash("sha512", $value), TOKEN));
                    break;
                    
                default:
                    exit();
                    break;
            }
            
            exit("@ok");
        }
        
        public static function savePrivateKey($privKey)
        {
            self::bdd()->_request("UPDATE rsa_keys SET privKey = ? WHERE user_id = ?", array($privKey, TOKEN));
            
            exit("@ok");
        }
        
        public static function deleteAccount()
        {
            // Suppression du compte
            self::bdd()->_request("DELETE FROM users WHERE token = ?", array(TOKEN));
            
            // Suppression des clés
            self::bdd()->_request("DELETE FROM rsa_keys WHERE user_id = ?", array(TOKEN));
            
            // Suppression du fichier utilisateur
            unlink("../storage/".TOKEN."/workspace/design.json");
            
            // Suppression des fichiers de l'utilisateur
            $directory = '../storage/'.TOKEN.'/files/';

            $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

            while($it->valid())
            {
                if(!$it->isDot()) 
                {
                    unlink('../storage/'.TOKEN.'/files/' . $it->getSubPathName());
                }

                $it->next();
            }
            
            // Suppression de la session
            self::logout();
        }
    }
?>