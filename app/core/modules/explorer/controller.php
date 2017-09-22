<?php
    require_once("request.php");

    if(!isset($_SESSION['explorer']['directory'])) $_SESSION['explorer']['directory'] = "/";

    class explorer
    {
        public static function Sub() { return new request(); }
        
        
        public static function getCurrentDirectory()
        {
            self::Sub()::getCurrentDirectory();
        }
        
        public static function getElements()
        {
            self::Sub()::getElements();
        }
        
        public static function add_file($params)
        {
            $params = base64_decode($params);
            
            $name = explode("//////", $params)[0];
            $content = explode("//////", $params)[1];
            
            self::Sub()::add_file($name, $content);
        }
        
        public static function add_folder($params)
        {
            $name = base64_decode($params);
            
            self::Sub()::add_folder($name);
        }
        
        public static function go_folder($params)
        {
            $token = base64_decode($params);
            
            self::Sub()::go_folder($token);
        }
    }
?>