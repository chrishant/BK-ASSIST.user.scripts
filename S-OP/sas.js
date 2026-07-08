angular.element(document.body)
  .injector()
  .get('$rootScope')
  .UserDetails.isSuperUser = true;
