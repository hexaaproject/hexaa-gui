(function () {
    angular.module('hexaaApp.components.services.controllers.pages')
        .controller('InviteServiceManagersCtrl',
        ['$scope', '$modal', 'dialogService', 'ServicesProxy', '$translate', 'InvitationsProxy', 'baseUIAddr', 'events',
            function ($scope, $modal, dialogService, ServicesProxy, $translate, InvitationsProxy, baseUIAddr, events) {


        var namespace = "services.inviteservicemanagers.";

        /* FIELDS */

        /* INTERFACE  */
        $scope.inviteManagers = inviteManagers;

        /* IMPLEMENTATION */

        function activate() {
            $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
        }

        activate();

        function onGetServiceSuccess(data) {
            $scope.service = data.data;
        }

        function onServicesSelectionChanged(event, selectedService) {
            if (selectedService != undefined) {
                ServicesProxy.getService(selectedService)
                    .then(onGetServiceSuccess);
            }
        }

        function onInvitationSaveSuccess(data) {
            dialogService.success($translate.instant(namespace + "msg.invitationSendSuccess"));
            $scope.$emit(events.refreshServiceInvitations);
        }

        function onInvitationSaveError(error) {
            dialogService.error($translate.instant(namespace + "msg.invitationSendError"));
        }

        function onInvitationModalClosed(invitation) {
            invitation.save()
                .then(onInvitationSaveSuccess)
                .catch(onInvitationSaveError);
        }

        function inviteManagers(service) {

            var modalInstance = $modal.open({
                templateUrl: 'views/shared/modals/invitation.html',
                controller: "ModalInstanceCtrl",
                size: 'lg',
                resolve: {
                    unitName: function () {
                        return service.name;
                    },
                    principal: function () {
                        return "manager";
                    },
                    roles: function () {
                        return service.roles;
                    },
                    invitation: function () {
                        return InvitationsProxy.new({
                            service: service.id,
                            as_manager: true
                        });
                    }
                }
            });
            modalInstance.result.then(onInvitationModalClosed);
        }
    }]);
}());