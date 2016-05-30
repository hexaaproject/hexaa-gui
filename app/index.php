<?php

//define('NO_OUTPUT', true);
include("config.php");
include("php/includes/auth.inc.php");

/**
* Execute a PHP template file and return the result as a string.
* Taken from: http://www.bigsmoke.us/php-templates/functions
*/
function apply_template($tpl_file, $vars = array(), $include_globals = true)
{
    extract($vars);
    
    if ($include_globals) extract($GLOBALS, EXTR_SKIP);
    
    ob_start();
    
    require($tpl_file);
    
    $applied_template = ob_get_contents();
    ob_end_clean();
    
    return $applied_template;
}

/*Redirect user to a specific url */
function redirectTo($url) {
    header("Location: ".$url);
}

function renderPage($vars) {    
    echo apply_template("php/templates/index.tpl.php", $vars, false);
}

$auth = new AuthorizationClass(
        $hexaa_master_secret, 
        $hexaa_base_address, 
        $hexaa_cookie_name,
        $hexaa_api_address, 
        $hexaa_env_eppn, 
        $hexaa_env_mail, 
        $hexaa_env_display_name,
        $hexaa_dont_check_ssl_certificate);

   

    try {
            //So the auth cookie is already present, not empty, action and we want to take an action with an invitation token 
            if (isSet($_COOKIE[$hexaa_cookie_name]) && 
                !empty($_COOKIE[$hexaa_cookie_name]) && 
                isSet($_GET['action']) && isSet($_GET['token'])) {

                if (isSet($_GET['action']) && isSet($_GET['token'])) {
                    //Invitation
                    $token = preg_replace("/[^a-zA-Z0-9-]/", "", $_GET['token']);
                    $action = preg_replace("/[^a-zA-Z]/", "", $_GET['action']);
                    try {
                        $redirectUrl = $auth->invite($token, $action, $_GET['mail']);                        
                        if (isSet($redirectUrl) || !empty($redirectUrl))
                        {
                            $var_array = array("redirectUrl" => $redirectUrl,
                                "message" => "Invitation ".$_GET["action"]."ed. Redirecting to HEXAA dashboard.");
                        }                        
                    } catch (Exception $e) {
                        $var_array = array("error_message" => $e->getMessage());                                
                    }

                    renderPage($var_array);
                }
            }  else if (isSet($_COOKIE[$hexaa_cookie_name]) && isSet($_GET['token'])) {
                //User is already authenticated and we want to enable a service
                $auth->enableService($_GET['token']);
                //Service activated!                
                $var_array = array("redirectUrl" => $hexaa_ui_address . '/index.html',
                                "message" => "Service activated. Redirecting to HEXAA dashboard.");
                renderPage($var_array);
            } else {
                //No cookie present, lets authenticate the user                
                $response = $auth->authenticate($_POST["email"]);                
                $responseData = json_decode($response, true);
                $toCookie = array(
                    "token" => $responseData['token']
                );


                $domain = parse_url($hexaa_ui_address, PHP_URL_HOST);
                $path = parse_url($hexaa_ui_address, PHP_URL_PATH);

                setCookie($hexaa_cookie_name, $responseData['token'], 0, "/", $domain, $hexaa_force_https, true); //to be fixed: restrict to path

                if (isset($_GET["action"]) && isset($_GET["token"])) {
                    //Authentication done. Opening invitation...
                    $redir = $hexaa_ui_address . '/index.php?action=' . $_GET['action'] . '&token=' . $_GET['token'];
                    if (isSet($_GET["mail"])) {
                        $redir .= '&mail=' . $_GET['mail'];
                    }
                    redirectTo($redir);
                } else if (isset($_GET["token"])) {
                    //Authentication done. Now we are going to enable your service.
                    redirectTo($hexaa_ui_address . '/index.php?token=' . $_GET['token']);
                } else if (isset($_GET["redirect"])) {
                    //Authentication done.                    
                    redirectTo($_GET["redirect"]);
                } else {
                    //Authentication done
                    redirectTo($hexaa_ui_address . '/index.html');
                }
            } 
        } catch (Exception $e) {            
            $var_array = array("error_message" => $e->getMessage());        
            renderPage($var_array);
        }
 

?>