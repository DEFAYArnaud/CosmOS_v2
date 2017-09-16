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
            $current_size = $quota["document"] + $quota["image"] + $quota["audio"] + $quota["video"] + $quota["other"];
            
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
    }
?>