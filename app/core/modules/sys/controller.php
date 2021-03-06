<?php
    require_once("request.php");

    class sys
    {
        public static function Sub() { return new request(); }
        
        
        public static function logout()
        {
            self::Sub()::logout();
        }
        
        public static function changeHeaderColor($params)
        {
            $color = base64_decode($params);
            
            self::Sub()::changeHeaderColor($color);
        }
        
        public static function changeBackground($params)
        {
            $bg = base64_decode($params);
            
            self::Sub()::changeBackground($bg);
        }
        
        public static function initDesign()
        {
            self::Sub()::getContentDesign();
        }
        
        public static function initStorage()
        {
            $informations = self::Sub()::getStorageInformations();
            
            $quota = self::Sub()::getFilesInformations();
            
            exit(json_encode(self::Sub()::computePercents($informations, $quota)));
        }
        
        public static function initAccount()
        {
            exit(self::Sub()::initAccount());
        }
        
        public static function saveInformations($params)
        {
            $params = base64_decode($params);
            
            $nb = explode(",", $params)[0];
            $value = explode(",", $params)[1];
            
            self::Sub()::saveInformations($nb, $value);
        }
        
        public static function savePrivateKey($params)
        {
            $privKey = base64_decode($params);
            
            self::Sub()::savePrivateKey($privKey);
        }
        
        public static function deleteAccount()
        {
            self::Sub()::deleteAccount();
        }
    }
?>