
<!doctype html >
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" ng-app="hexaaApp" > <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" ng-app="hexaaApp" > <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" ng-app="hexaaApp" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" > <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <title>HEXAA</title>
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
        <?php 
            if (isSet($redirectUrl)) {
                echo "<meta http-equiv='refresh' content='3;url=".$redirectUrl."'>";
            }
        ?>
    </head>
    <body>
        <div class="container">
            <nav id="nav" class="navbar navbar-default" role="navigation">
                <div id="navContainer" class="container">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <a class="navbar-brand navbar-left"><img src="images/hexaa.png"></a>
                    </div>
                </div><!-- /.container-fluid -->
            </nav>        

            <div>
                <?php
                if (isSet($error_message)) {
                    echo "<pre> The following issue has been detected: " . $error_message . "</pre>";
                }

                if (isSet($message)) {
                    echo '<p class="lead text-center">' . $message . '</p>';
                }
                ?>

            </div>
            <div class="footer">
                <div class="row">
                    <div  class="col-md-4">
                        <img src="images/sztaki.png" height="80em" />
                    </div>
                    <div class="col-md-4" style="text-align: center; vertical-align: center">
                        <h4>Copyright 2013-2015</h4>
                    </div>               
                    <div class="col-md-4">
                        <img src="images/niifi.png" height="80em" class="pull-right"/>
                    </div>
                </div>                
             </div>
        </div>        
    </body>
</html>