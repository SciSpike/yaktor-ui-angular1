angular.module('views')
  .config(function ($translateProvider) {
    $translateProvider.translations('en_US', {
        "_WARNING.EXPIRED":"Your session has expired. Please log in again",
        "_WARNING.IDLE": "System has been idle over it's time limit and will be disconnected in {{value}} second(s)",
        "_WARNING.TITLE":"You will be logged out for inactivity.",
        "_OK":"OK",
        "_CANCEL":"Cancel",
        "_CLOSE":"Close",
        "_UPDATE": "Update",
        "_CONTINUE": "Continue Session"
    })
  });


