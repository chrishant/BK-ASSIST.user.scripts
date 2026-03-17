(function(){

    const injector = angular.element(document.body).injector();
    const $compile = injector.get('$compile');
    const $rootScope = injector.get('$rootScope');

    const btn = document.querySelector("#Save");

    if(!btn){
        console.log("❌ Button not found");
        return;
    }

    console.log("✅ Recompiling button");

    btn.setAttribute("ng-click","saveOrder_Item_MT()");

    const scope = angular.element(btn).scope();

    $compile(btn)(scope);

    scope.$apply();

})();
