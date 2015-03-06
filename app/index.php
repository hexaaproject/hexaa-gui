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
            $hexaaData = json_decode($_COOKIE[$hexaa_cookie_name], true);
            $apiToken = $hexaaData["token"];

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
            $hexaaData = json_decode($_COOKIE[$hexaa_cookie_name], true);
            $apiToken = $hexaaData["token"];
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


                if (strpos($hexaa_ui_address, "https://") !== FALSE) {
                    $secure = TRUE;
                } else if (strpos($hexaa_ui_address, "http://") !== FALSE) {
                    $secure = FALSE;
                } else {
                    $secure = FALSE;
                }

                $domain = parse_url($hexaa_ui_address, PHP_URL_HOST);
                $path = parse_url($hexaa_ui_address, PHP_URL_PATH);

                setCookie($hexaa_cookie_name, json_encode($toCookie), 0, $path, $domain, $secure, FALSE);

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

<!--[if lt IE 9]>
<script src="../bower_components//es5-shim/es5-shim.js"></script>
<script src="../bower_components//json3/lib/json3.min.js"></script>
<![endif]-->

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
<script src="../bower_components/es5-shim/es5-shim.js"></script>
<script src="../bower_components/jquery/jquery.js"></script>
<script src="../bower_components/jquery-ui/jquery-ui.js"></script>
<script src="../bower_components/angular/angular.js"></script>
<script src="../bower_components/json3/lib/json3.min.js"></script>
<script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script src="../bower_components/angular-resource/angular-resource.js"></script>
<script src="../bower_components/angular-cookies/angular-cookies.js"></script>
<script src="../bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="../bower_components/angular-route/angular-route.js"></script>
<script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script src="../bower_components/angular-css-injector/angular-css-injector.js"></script>
<script src="../bower_components/angular-translate/angular-translate.js"></script>
<script src="../bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js"></script>
<script src="../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js"></script>
<script src="../bower_components/angular-animate/angular-animate.js"></script>
<script src="../bower_components/ng-file-upload/angular-file-upload.js"></script>
<script src="../bower_components/angular-toastr/dist/angular-toastr.js"></script>
<script src="../bower_components/bootstrap-duallistbox/src/jquery.bootstrap-duallistbox.js"></script>
<script src="../bower_components/bootstrap-switch/dist/js/bootstrap-switch.js"></script>
<!-- endbower -->
<!-- endbuild -->

<!-- build:js({.tmp,app}) scripts/scripts.js -->
<script src="scripts/utils/angular-multi-select.js"></script> <!-- Modded vendor script -->
<script src="scripts/config/app.js"></script>
<script src="scripts/config/module.js"></script>
<script src="scripts/shared/module.js"></script>
<script src="scripts/shared/controllers/module.js"></script>
<script src="scripts/shared/controllers/pages/module.js"></script>
<script src="scripts/shared/controllers/modals/module.js"></script>
<script src="scripts/shared/directives/module.js"></script>
<script src="scripts/components/module.js"></script>
<script src="scripts/components/admin/module.js"></script>
<script src="scripts/components/admin/controllers/module.js"></script>
<script src="scripts/components/admin/controllers/modals/module.js"></script>
<script src="scripts/components/admin/controllers/pages/module.js"></script>
<script src="scripts/components/admin/directives/module.js"></script>
<script src="scripts/components/organizations/module.js"></script>
<script src="scripts/components/organizations/controllers/module.js"></script>
<script src="scripts/components/organizations/controllers/pages/module.js"></script>
<script src="scripts/components/organizations/controllers/modals/module.js"></script>
<script src="scripts/components/organizations/directives/module.js"></script>
<script src="scripts/components/profile/module.js"></script>
<script src="scripts/components/profile/controllers/module.js"></script>
<script src="scripts/components/profile/controllers/pages/module.js"></script>
<script src="scripts/components/profile/controllers/modals/module.js"></script>
<script src="scripts/components/profile/directives/module.js"></script>
<script src="scripts/components/services/module.js"></script>
<script src="scripts/components/services/controllers/module.js"></script>
<script src="scripts/components/services/controllers/pages/module.js"></script>
<script src="scripts/components/services/controllers/modals/module.js"></script>
<script src="scripts/components/services/controllers/modals/entityIdContactDialog.js"></script>
<script src="scripts/components/services/directives/module.js"></script>
<script src="scripts/services/module.js"></script>
<script src="scripts/services/facades/module.js"></script>
<script src="scripts/models/module.js"></script>
<script src="scripts/filters/module.js"></script>


<script src="scripts/config/http.js"></script>
<script src="scripts/config/routing.js"></script>
<script src="scripts/config/translate.js"></script>
<script src="scripts/config/exceptionConfig.js"></script>
<script src="scripts/config/toastrConfig.js"></script>
<script src="scripts/components/services/directives/hexaa-services-entitlementpack-editor-widget.js"></script>
<script src="scripts/shared/controllers/pages/IndexCtrl.js"></script>
<script src="scripts/components/organizations/controllers/pages/index.js"></script>
<script src="scripts/components/organizations/controllers/modals/organizationNewDialog.js"></script>
<script src="scripts/components/organizations/controllers/pages/principalmanagement.js"></script>
<script src="scripts/components/organizations/controllers/pages/properties.js"></script>
<script src="scripts/components/organizations/controllers/pages/managers.js"></script>
<script src="scripts/components/organizations/controllers/pages/members.js"></script>
<script src="scripts/components/organizations/controllers/pages/news.js"></script>
<script src="scripts/components/organizations/controllers/pages/roles.js"></script>
<script src="scripts/components/organizations/controllers/pages/roles_new.js"></script>
<script src="scripts/components/organizations/controllers/pages/inviteorgmanagers.js"></script>
<script src="scripts/components/organizations/controllers/pages/inviteorgmembers.js"></script>
<script src="scripts/components/organizations/controllers/pages/entitlementpacks.js"></script>
<script src="scripts/components/organizations/controllers/pages/attributes.js"></script>
<script src="scripts/components/organizations/controllers/pages/invitations.js"></script>
<script src="scripts/components/organizations/controllers/pages/public_catalog.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-properties-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-role-editor-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-role-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-roles-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-users-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-invitations-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-invitationbar-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-entitlementcatalog-widget.js"></script>
<script src="scripts/components/organizations/directives/hexaa-organizations-attribute-editor-widget.js"></script>
<script src="scripts/components/profile/controllers/pages/myorganizations.js"></script>
<script src="scripts/components/profile/controllers/pages/myservices.js"></script>
<script src="scripts/shared/controllers/modals/invitation.js"></script>
<script src="scripts/shared/controllers/modals/message.js"></script>
<script src="scripts/shared/controllers/modals/confirmationDialog.js"></script>
<script src="scripts/components/organizations/controllers/modals/organizationDetails.js"></script>
<script src="scripts/components/services/controllers/modals/serviceDetails.js"></script>
<script src="scripts/components/organizations/controllers/modals/organizationChangerDialog.js"></script>
<script src="scripts/components/organizations/controllers/modals/attributeEditorDialog.js"></script>
<script src="scripts/components/services/controllers/modals/serviceChangerDialog.js"></script>
<script src="scripts/components/services/controllers/modals/newEntitlementDialog.js"></script>
<script src="scripts/components/services/controllers/pages/index.js"></script>
<script src="scripts/components/services/controllers/pages/news.js"></script>
<script src="scripts/components/services/controllers/pages/properties.js"></script>
<script src="scripts/components/services/controllers/pages/managers.js"></script>
<script src="scripts/components/services/controllers/pages/attributespecifications.js"></script>
<script src="scripts/components/services/controllers/pages/new.js"></script>
<script src="scripts/components/services/controllers/pages/owner.js"></script>
<script src="scripts/components/services/controllers/pages/entitlements.js"></script>
<script src="scripts/components/services/controllers/pages/entitlementpacks.js"></script>
<script src="scripts/components/services/controllers/pages/inviteservicemanagers.js"></script>
<script src="scripts/components/services/controllers/pages/connectedpacks.js"></script>
<script src="scripts/components/services/controllers/pages/invitations.js"></script>
<script src="scripts/components/services/controllers/modals/newEntitlementpackDialog.js"></script>
<script src="scripts/components/profile/controllers/pages/index.js"></script>
<script src="scripts/components/profile/controllers/pages/attributes.js"></script>
<script src="scripts/components/profile/controllers/pages/consents.js"></script>
<script src="scripts/components/profile/controllers/pages/me.js"></script>
<script src="scripts/components/profile/controllers/pages/logout.js"></script>
<script src="scripts/components/profile/controllers/pages/news.js"></script>
<script src="scripts/components/profile/controllers/pages/dashboard.js"></script>
<script src="scripts/components/profile/controllers/pages/vowizard.js"></script>
<script src="scripts/components/profile/controllers/modals/module.js"></script>
<script src="scripts/components/profile/controllers/modals/attributeEditorDialog.js"></script>
<script src="scripts/components/profile/directives/hexaa-profile-attribute-editor-widget.js"></script>
<script src="scripts/components/admin/directives/hexaa-admin-attributespecification-editor-widget.js"></script>
<script src="scripts/components/admin/directives/hexaa-admin-principal-editor-widget.js"></script>
<script src="scripts/components/admin/controllers/pages/index.js"></script>
<script src="scripts/components/admin/controllers/pages/attributespecifications.js"></script>
<script src="scripts/components/admin/controllers/modals/newAttrspecDialog.js"></script>
<script src="scripts/components/admin/controllers/modals/newPrincipalDialog.js"></script>
<script src="scripts/components/admin/controllers/pages/principals.js"></script>
<script src="scripts/components/admin/controllers/pages/entityids.js"></script>
<script src="scripts/services/hexaaService.js"></script>
<script src="scripts/services/facades/Roles.js"></script>
<script src="scripts/services/facades/Consents.js"></script>
<script src="scripts/services/facades/Invitations.js"></script>
<script src="scripts/services/facades/AttributeSpecifications.js"></script>
<script src="scripts/services/facades/Principal.js"></script>
<script src="scripts/services/facades/Services.js"></script>
<script src="scripts/services/facades/Organizations.js"></script>
<script src="scripts/services/facades/Entitlementpacks.js"></script>
<script src="scripts/models/Resource.js"></script>
<script src="scripts/models/Organization.js"></script>
<script src="scripts/models/Service.js"></script>
<script src="scripts/models/Role.js"></script>
<script src="scripts/models/Principal.js"></script>
<script src="scripts/models/Invitation.js"></script>
<script src="scripts/models/Entitlementpack.js"></script>
<script src="scripts/models/AttributeSpecification.js"></script>
<script src="scripts/services/requestNotificationChannel.js"></script>
<script src="scripts/services/dialogService.js"></script>
<script src="scripts/services/themeService.js"></script>
<script src="scripts/services/securityService.js"></script>
<script src="scripts/services/profileService.js"></script>
<script src="scripts/services/settingsService.js"></script>
<script src="scripts/services/startupService.js"></script>
<script src="scripts/services/pageTitleService.js"></script>
<script src="scripts/shared/directives/ngmodelonblur.js"></script>
<script src="scripts/shared/directives/validate.js"></script>
<script src="scripts/shared/directives/draggable.js"></script>
<script src="scripts/shared/directives/resizable.js"></script>
<script src="scripts/shared/directives/loadingWidget.js"></script>
<script src="scripts/shared/directives/notifyuierror.js"></script>
<script src="scripts/shared/directives/angular-duallistbox.js"></script>
<script src="scripts/shared/directives/hexaa-shared-news-widget.js"></script>
<script src="scripts/shared/directives/bootstrap-switch.js"></script>
<script src="scripts/filters/pager.js"></script>
<script src="scripts/filters/imageFormatter.js"></script>
<script src="scripts/filters/placeholder.js"></script>
<script src="scripts/utils/extensions.js"></script>
<script src="scripts/utils/jslinq.js"></script>
<script src="scripts/utils/wrappers.js"></script>
<!-- endbuild -->
    </body>
</html>