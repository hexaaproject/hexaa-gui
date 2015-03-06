<?php

include("config.php");

if (!defined('NO_OUTPUT')){
echo('var baseAddr = "'.$hexaa_base_address.'",');
echo('    hexaaCookieName = "'.$hexaa_cookie_name.'",');
echo('    hexaaUIAddr = "'.$hexaa_ui_address.'",');
echo('    apiAddr = "'.$hexaa_api_address.'";');
}

?>