<?php
    // Get config
    define('NO_OUTPUT', true);
    include("config.php");


    if (strpos($hexaa_base_address, "https://") !== FALSE) {
           $secure = TRUE;
       } else if (strpos($hexaa_base_address, "http://") !== FALSE) {
           $secure = FALSE;
       } else {
       $secure = FALSE;
    }

    setCookie($hexaa_cookie_name, "", time() - 60 * 60, "/", $hexaa_domain_address, $secure, FALSE);

    header("Location: ".$hexaa_logout_url);
?>
