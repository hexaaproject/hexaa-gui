<?php

$log_dir = "health_report/";

if ( isSet($_POST["errorData"])  )
{    
    
    $errorData = json_decode($_POST["errorData"]);        
    $fedid = $errorData -> fedid;
    

    if (!file_exists($log_dir))
        mkdir($log_dir);

    $log_fn = str_replace("@","AT",$fedid.".log")."_".date("Ymd");    


    $output = array("date" => date("YmdHis"), "data" => $errorData);    

    file_put_contents($log_dir.$log_fn, json_encode($output)."\n \n",  FILE_APPEND );
}

?>