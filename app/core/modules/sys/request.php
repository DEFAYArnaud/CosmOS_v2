<?php
    class request
    {
        public static function logout()
        {
            $_SESSION['session'] = null;
            
            session_destroy();
        }
        
        public static function changeHeaderColor($color)
        {
            $design_json = json_decode(file_get_contents("../storage/{$_SESSION['session']['token']}/workspace/design.json"), true);
            
            $design_json["header"] = $color;
            
            file_put_contents("../storage/{$_SESSION['session']['token']}/workspace/design.json", json_encode($design_json));
        }
        
        public static function changeBackground($bg)
        {
            $bg = str_replace("/", "", substr($bg, strrpos($bg, "/"), strlen($bg)));
            
            $design_json = json_decode(file_get_contents("../storage/{$_SESSION['session']['token']}/workspace/design.json"), true);
            
            $design_json["background"] = $bg;
            
            file_put_contents("../storage/{$_SESSION['session']['token']}/workspace/design.json", json_encode($design_json));
        }
        
        public static function getContentDesign()
        {
            $content = json_decode(file_get_contents("../storage/{$_SESSION['session']['token']}/workspace/design.json"), true);
            
            exit("@ok".$content["background"]."//////".$content["header"]);
        }
    }
?>