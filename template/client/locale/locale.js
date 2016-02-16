angular.module("views")
  .config(function ($translateProvider) {
    $translateProvider.translations("en_US", {
      "SUBMIT" : "Submit",
      "EDIT" : "Edit",
      "DELETE" : "Delete",
      "CANCEL.DELETE" : "Cancel",
      "CONFIRM.DELETE" : "Confirm",
      "LOGIN" : "Login",
      "LOGOUT" : "Logout",
      "ACCOUNT" : "Account",
      "TRUE" : "True",
      "FALSE" : "False",
      "MAKE.SELECTION": "Make Selection",
      "CREATE.NEW": "Create New",
      "SHOW.FILTER.OPTIONS": "Show Filter Options",
      "HIDE.FILTER.OPTIONS": "Hide Filter Options",
      "FILTER.GRID": "Filter Grid",
      "NO.FILTER.RESULTS": "There are no results based on your filters",
      "NO.RESULTS": "There are no results to display",
      "FIRST.PAGE": "First Page",
      "LAST.PAGE": "Last Page",
      "FILTERS": "Filters",
      "INVALID.NUMBER": "Please check your number input fields for incorrect values",
      "GEOLOCATION": "Geolocation",
      "LATITUDE": "Latitude",
      "LONGITUDE": "Longitude",
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


