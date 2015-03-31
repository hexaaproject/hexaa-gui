<!doctype html >
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" ng-app="hexaaApp" > <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" ng-app="hexaaApp" > <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" ng-app="hexaaApp" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" > <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <title>HEXAA </title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" />
        <!--
        <script src="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js" ></script>
        -->
        <!-- build:css styles/vendor.css -->
        <!-- bower:css -->
        <!-- endbower -->
        <link rel="stylesheet" href="../bower_components/jquery-ui/themes/black-tie/jquery-ui.css">
        <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.css">
        <link rel="stylesheet" href="styles/angular-multi-select.css">
        <link rel="stylesheet" href="../bower_components/angular-toastr/dist/angular-toastr.css">
        <!-- endbuild -->
        <!-- build:css({.tmp,app}) styles/main.css -->
        <!--<link rel="stylesheet" href="styles/main.css"> -->
        <link rel="stylesheet" href="styles/animations.css">
        <!-- endbuild -->
    </head>
    <body>
        <nav id="nav" class="navbar navbar-default" role="navigation">
            <div id="navContainer" class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <a class="navbar-brand navbar-left"><img src="images/hexaa.png"></a>
                </div>
            </div><!-- /.container-fluid -->
        </nav>
        <?php
        define('NO_OUTPUT', true);
        include("config.php");

        function authenticate($email, $hexaa_master_secret, $hexaa_base_address, $hexaa_cookie_name,$hexaa_api_address, $hexaa_env_eppn, $hexaa_env_mail, $hexaa_dont_check_ssl_certificate) {
            if (!isSet($hexaa_master_secret) || !isSet($hexaa_base_address) || !isSet($hexaa_cookie_name)) {
                throw new Exception("Missing config data!");
            }

            if ($eppn = getenv('eppn')) {
                if (($mail = getenv('mail')) || isSet($email)) {

                    if (isSet($email))
                        $mail = $email;

                    // Create api key
                    $time = new \DateTime();
                    date_timezone_set($time, new \DateTimeZone('UTC'));
                    $stamp = $time->format('Y-m-d H:i');
                    $apiKey = hash('sha256', $hexaa_master_secret . $stamp);

                    // Make the call
                    // The data to send to the API
                    $postData = array(
                        "apikey" => $apiKey,
                        "fedid" => $eppn
                    );
                    if ($mail !== false) {
                        $postData['email'] = $mail;
                    }

                    // Setup cURL
                    $ch = curl_init($hexaa_api_address . '/tokens.json');
                    curl_setopt_array($ch, array(
                        CURLOPT_POST => TRUE,
                        CURLOPT_RETURNTRANSFER => TRUE,
                        CURLOPT_HTTPHEADER => array(
                            'Content-Type: application/json'
                        ),
                        CURLOPT_POSTFIELDS => json_encode($postData),
                            //CURLOPT_CAPATH => "/etc/ssl/certs"
                    ));

                    if ($hexaa_dont_check_ssl_certificate)
                    {
                        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                    }            

                    // Send the request
                    $response = curl_exec($ch);

                    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                    // Check for error & use the data
                    if ($response === FALSE && $status != 400) {
                        throw new Exception('Failed to get response from the api.' . curl_error($ch));
                    } else if ($status == 200) {
                        return $response;
                    }
                    else {
                        throw new Exception('Curl Error, status: '.$status);
                    }
                }
            } else {
                throw new Exception("No eppn environment variable found!");
            }

            if ($status == "400")
                throw new Exception("Invalid e-mail");
        }

        function provideEmail() {
            return '<pre>Please provide us your e-mail address.</pre>
                    <form name="emailForm" method="post" action="<?php echo $_SERVER[\'PHP_SELF\'] ?>">
                        <div class="form-control">
                            <label for="email">E-mail</label>
                            <input type="email" name="email"/>
                            <p><button name="submit" type="submit">OK</button></p>
                        </div>
                    </form>';
        }

        function redirectTo($destination) {
            echo '<p class="lead text-center">Redirection in progress. If you see this window for more than a few seconds, click <a href="' . $destination . '">here</a>.</p> <meta http-equiv="refresh" content="3;URL=' . $destination . '" />';
        }

        function invite($token, $action, $mail, $hexaa_cookie_name, $hexaa_base_address,$hexaa_api_address, $hexaa_dont_check_ssl_certificate) {            
            $apiToken = $_COOKIE[$hexaa_cookie_name];

            // Setup cURL
            if (!$mail) {
                $ch = curl_init($hexaa_api_address . '/invitations/' . $token . '/' . $action . '/token.json');
            } else {
                $ch = curl_init($hexaa_api_address . '/invitations/' . $token . '/' . $action . 's/' . $mail . '/email.json');
            }

            curl_setopt_array($ch, array(
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_HEADER => true, //include headers in http data
                CURLOPT_FOLLOWLOCATION => false, //don't follow redirects
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    'X-HEXAA-AUTH: ' . $apiToken
                ),
            ));

            if ($hexaa_dont_check_ssl_certificate)
            {
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            }

            // Send the request
            $response = curl_exec($ch);

            // Check for error & use the data
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($response === FALSE && $status != "400" && $status != "302") {
                throw new Exception('Failed to get response from the api. ' . curl_error($ch));
            } else if ($status == "302") {
                //check response status.
                $curl_info = curl_getinfo($ch);
                $headers = substr($response, 0, $curl_info["header_size"]);

                preg_match("!\r\n(?:Location|URI): *(.*?) *\r\n!", $headers, $matches);
                //var_dump($matches);

                $url = $matches[1];
                return $url;
            }

            if ($status == "400") {
                throw new Exception("Server returned 400 Bad request. Please check if your invitation is still vaild.");
            } elseif ($status == "409") {
                throw new Exception("Server returned 409 Conflict. This invitation seems to be already accepted.");
            } elseif ($status != "200") {
                throw new Exception($response);
            }
        }

        function enableService($token, $hexaa_cookie_name, $hexaa_base_address, $hexaa_api_address, $hexaa_dont_check_ssl_certificate) {
            $apiToken = $_COOKIE[$hexaa_cookie_name];            
            $ch = curl_init($hexaa_api_address . '/services/' . $token . '/enable.json');

            curl_setopt_array($ch, array(
                CURLOPT_PUT => TRUE,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_HEADER => true, //include headers in http data
                CURLOPT_FOLLOWLOCATION => false, //don't follow redirects
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    'X-HEXAA-AUTH: ' . $apiToken
                ),
            ));

            if ($hexaa_dont_check_ssl_certificate)
            {
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            }            

            // Send the request
            $response = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($status === 403) {
                throw new Exception('Invalid credentials!');
            } elseif ($status === 401) {
                throw new Exception('Token expired.');
            } elseif ($status === 404) {
                throw new Exception('Service not found with token: ' . $token);
            } elseif ($status == "409") {
                throw new Exception("Server returned 409 Conflict. This service seems to be already enabled.");
            }
            return $hexaa_ui_address . '/index.html';
        }

        try {
            if (isSet($_COOKIE[$hexaa_cookie_name]) && !empty($_COOKIE[$hexaa_cookie_name]) && isSet($_GET['action']) && isSet($_GET['token'])) {
                if (isSet($_GET['action']) && isSet($_GET['token'])) {
                    //Invitation
                    $token = preg_replace("/[^a-zA-Z0-9-]/", "", $_GET['token']);
                    $action = preg_replace("/[^a-zA-Z]/", "", $_GET['action']);
                    try {
                        $a = invite($token, $action, $_GET['mail'], $hexaa_cookie_name, $hexaa_base_address,$hexaa_api_address, $hexaa_dont_check_ssl_certificate);
                        $message = "Invitation accepted!";
                        if (isSet($a) || !empty($a))
                            redirectTo($a);
                    } catch (Exception $e) {
                        $error_message = $e -> getMessage();
                    }
                }
            }  else if (isSet($_COOKIE[$hexaa_cookie_name]) && isSet($_GET['token'])) {
                enableService($_GET['token'], $hexaa_cookie_name, $hexaa_base_address, $hexaa_api_address, $hexaa_dont_check_ssl_certificate);
                $message = "Service activated!";
                redirectTo($hexaa_ui_address . '/index.html');
            } else  {
                $response = authenticate($_POST["email"], $hexaa_master_secret, $hexaa_base_address, $hexaa_cookie_name,$hexaa_api_address,$hexaa_env_eppn, $hexaa_env_mail, $hexaa_dont_check_ssl_certificate);
                $responseData = json_decode($response, true);
                $toCookie = array(
                    "token" => $responseData['token']
                );
            

                $domain = parse_url($hexaa_ui_address, PHP_URL_HOST);
                $path = parse_url($hexaa_ui_address, PHP_URL_PATH);

                setCookie($hexaa_cookie_name, $responseData['token'], 0, "/", $domain, $hexaa_force_https, TRUE); //to be fixed: restrict to path

                if (isset($_GET["action"]) && isset($_GET["token"])) {
                    $message = "Authentication done. Opening invitation...";
                    $redir = $hexaa_ui_address . '/index.php?action=' . $_GET['action'] . '&token='. $_GET['token'];
                    if (isSet($_GET["mail"]))
                    {
                        $redir .= '&mail=' . $_GET['mail'];
                    }                    
                    redirectTo($redir);                    
                } else if (isset($_GET["token"])) {
                    $message = "Authentication done. Now we are going to enable your service.";
                    redirectTo($hexaa_ui_address . '/index.php?token=' . $_GET['token']);
                } else {
                    $message = "Authentication done.";
                    redirectTo($hexaa_ui_address . '/index.html');
                }
            } 
        } catch (Exception $e) {
            $error_message = $e->getMessage();
        }
        ?>

        <div>
            <?php
            if (isSet($error_message)) {
                echo "<pre> The following issue has been detected: " . $error_message . "</pre>";
            }
            if (isSet($_GET["provideEmail"])) {
                echo provideEmail();
            }


            if (!isSet($redirect_url) && !isSet($error_message) && isSet($_GET['action']) && ($_GET['action'] == 'reject')) {
                echo '<p class="lead text-center">Invitation rejected!</p>';
            } else if (isSet($message)) {
                echo '<p class="lead text-center">' . $message . '</p>';
            } elseif (isset($_GET['token']) && !isSet($_GET['action'])){
                echo '<p class="lead text-center">This service is already enabled.</p>';
            } elseif (isset($_GET['token']) && isSet($_GET['action']) && $_GET['action'] == 'accept'){
                echo '<p class="lead text-center">This invitation is already accepted<br> or you are already a member/manager of the target organization/service.</p>';
            } else {
                echo 'Unkonwn error.';
            }
            ?>

        </div>
        <div class="footer row">

        </div>
    </body>
</html>