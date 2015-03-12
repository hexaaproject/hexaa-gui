HEXAA GUI
===================
----------

Hexaa-gui is an AngularJS based frontend for the Hexaa-backend. 

----------


Installation
-------------

 1. Clone this repository
 2. Copy all the content from the dist directory to your web folder
 3. Copy config.php.dist to config.php
 4. Edit config.php as appropriate.

> **Note:**
* **$hexaa_base_address** is the root URL of the HEXAA installation
* **$hexaa_api_address** is the URL of HEXAA installation's API
* **$hexaa_cookie_name** is the name of the cookie where the token is stored. This should be unique.
* **$hexaa_master_secret** The master secret of HEXAA. You can find it under * *your_hexaa_install_dir/app/config/parameters.yaml*
* **$hexaa_logout_url** HEXAA UI will redirect you to this page on logout. It Should be the Shibboleth SingleLogout Endpoint.
* **$hexaa_env_eppn** Server attribute name of the federal unique Id. Compare it with your Shibboleth Installation.
* **$hexaa_env_mail** Server attribute name of the federal unique mail. Compare it with your Shibboleth Installation.
* **$hexaa_dont_check_ssl_certificate**: Set it to true if your installation does not use HTTPS protocol.


----------


Expected new features in the future
-------------

There are a few features from the latest backend (0.27.6) that the current frontend (version 0.27)  does not support yet. This are:

 1. Mass e-mail sending
 2. Security Context
 3. VO Isolation

----

Development
-------------------

This software is open-source. You can grab the source code by cleaning this repository.

Before you start, make sure you have the following tools installed:

> **Prerequisites:**

> - Installed [NPM](https://github.com/npm/npm).
> - Installed [Bower](https://github.com/bower/bower).

If you have these tools, clone the repository, and execute the following commands from the project's root directory:

    npm install
    bower install

The first command will install all the tools that you need for development, especially Grunt and It's plugins. Grunt is a powerful task-runner system, which we used mainly to create minified, compressed build package from our JavaScript,  HTML sources, and to support live code editing.  If you have not met [Grunt](http://gruntjs.com/) yet, I highly recommend for you to get familiar with it. 

***If npm install throws you a couple of error messages, try to run it with administrator privileges.***

#### <i class="icon-refresh"></i> Development decisions

When this project started, hexaa-gui was a pilot project. As the time went by, It has grown up, and became a very huge and complex front end. Due to this fact, It had a few refactor cycles. Even now we are in the middle of one smaller AngularJS dependent pattern refactor, in which we refactor our controllers to use controllerAs syntax instead of $scope. That's why the current stable version (0.26) has mixed controller syntaxes. (A few of them uses the older style, but the majority uses the controllerAs syntax.)
This is necessary to ensure that the controllers are technology independent, and to reduce the effort of porting the whole project into Angular 2.0 (once if it will be necessary).

