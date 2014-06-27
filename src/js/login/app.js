angular.module('virtuosumLogin', ['ui.bootstrap', 'virtuosumLoginControllers', 'virtuosumLoginServices']);

var virtuosumLoginControllers = angular.module('virtuosumLoginControllers', []);
var virtuosumLoginServices = angular.module('virtuosumLoginServices', []);
var virtuosumLoginEndpoints = {
    // login: 'http:/www.welldonegood.com/wp-login.php?loggedout=true',
    login: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/wp-login.php?loggedout=true',
    mainAppLocation: 'welldonegood.html'
}
