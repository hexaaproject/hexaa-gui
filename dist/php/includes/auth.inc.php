<?php
    /**
    *  class to handle authentication, invitation, service enable
    */
    class AuthorizationClass
    {    
        /* private members */
        private $hexaa_master_secret; 
        private $hexaa_base_address;
        private $hexaa_cookie_name;
        private $hexaa_api_address;
        private $hexaa_env_eppn;
        private $hexaa_env_mail;
        private $hexaa_env_display_name;
        private $hexaa_dont_check_ssl_certificate;

        function __construct($hexaa_master_secret, 
            $hexaa_base_address, 
            $hexaa_cookie_name,
            $hexaa_api_address, 
            $hexaa_env_eppn, 
            $hexaa_env_mail, 
            $hexaa_env_display_name,
            $hexaa_dont_check_ssl_certificate)
        {            
            $this->hexaa_master_secret = $hexaa_master_secret;
            $this->hexaa_base_address = $hexaa_base_address; 
            $this->hexaa_cookie_name = $hexaa_cookie_name;
            $this->hexaa_api_address = $hexaa_api_address;
            $this->hexaa_env_eppn = $hexaa_env_eppn;
            $this->hexaa_env_mail = $hexaa_env_mail;
            $this->hexaa_env_display_name = $hexaa_env_display_name;
            $this->hexaa_dont_check_ssl_certificate = $hexaa_dont_check_ssl_certificate;                        
        }

        /* Authenticates a user with a given email. Sets up  an authentication cookie */
        public function authenticate($email) {                        
            if (!isSet($this->hexaa_master_secret) || !isSet($this->hexaa_base_address) || !isSet($this->hexaa_cookie_name)) {
                throw new Exception("Missing config data!");
            }

            if ($eppn = getenv($this->hexaa_env_eppn)) {
                if (($mail = getenv($this->hexaa_env_mail)) || isSet($email)) {

                    if (isSet($email))
                        $mail = $email;

                    // Create api key
                    $time = new \DateTime();
                    date_timezone_set($time, new \DateTimeZone('UTC'));
                    $stamp = $time->format('Y-m-d H:i');
                    $apiKey = hash('sha256', $this->hexaa_master_secret . $stamp);

                    // Make the call
                    // The data to send to the API
                    $postData = array(
                        "apikey" => $apiKey,
                        "fedid" => $eppn
                    );

                    if ($display_name = getenv($this->hexaa_env_display_name)) {
                        $postData["display_name"] = $display_name;
                    }
                    if ($mail !== false) {
                        $postData['email'] = $mail;
                    }

                    // Setup cURL
                    $ch = curl_init($this->hexaa_api_address . '/tokens.json');
                    curl_setopt_array($ch, array(
                        CURLOPT_POST => TRUE,
                        CURLOPT_RETURNTRANSFER => TRUE,
                        CURLOPT_HTTPHEADER => array(
                            'Content-Type: application/json'
                        ),
                        CURLOPT_POSTFIELDS => json_encode($postData),
                        //CURLOPT_CAPATH => "/etc/ssl/certs"
                    ));

                    if ($this->hexaa_dont_check_ssl_certificate)
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
                    } else {
                        throw new Exception('Curl Error, status: '.$status);
                    }
                }
                else {
                    throw new Exception("Your IdP did not provide us Your e-mail address. Please contact the IdP administrator.");
                }
            } else {
                throw new Exception("No eppn environment variable found! Contact the IdP administrator!");
            }

            if ($status == "400")
                throw new Exception("Invalid e-mail");
        }

        /* accepts or declines an invitation token */
        public function invite($token, $action, $mail) {
            $apiToken = $_COOKIE[$this->hexaa_cookie_name];

            // Setup cURL
            if (!$mail) {
                $ch = curl_init($this->hexaa_api_address . '/invitations/' . $token . '/' . $action . '/token.json');
            } else {
                $ch = curl_init($this->hexaa_api_address . '/invitations/' . $token . '/' . $action . 's/' . $mail . '/email.json');
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

            if ($this->hexaa_dont_check_ssl_certificate)
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
            } elseif ($status == "403") {
                throw new Exception("Server returned 403 Forbidden.");
            }
            elseif ($status != "200") {
                throw new Exception($response);
            }
        }


        /* enables a service */
        public function enableService($token) {
            $apiToken = $_COOKIE[$this->hexaa_cookie_name];
            $ch = curl_init($this->hexaa_api_address . '/services/' . $token . '/enable.json');

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

            if ($this->hexaa_dont_check_ssl_certificate)
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
            return $this->hexaa_ui_address . '/index.html';
        }


    }
?>