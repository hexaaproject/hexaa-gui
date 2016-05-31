/*
 Copyright 2014 MTA SZTAKI

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function () {

    'use strict';

    angular.module('hexaaApp.components.organizations.controllers.pages').controller('OrganizationRolesCtrl', ['$scope', '$window', '$timeout', 'dialogService', 'OrganizationsFacade', '$cookies', '$q', '$rootScope', '$translate', 'events', '$modal', 'RolesFacade', 'PrincipalFacade', 'pageTitleService', 'profileService',
        function ($scope, $window, $timeout, dialogService, OrganizationsFacade, $cookies, $q, $rootScope, $translate, events, $modal, RolesFacade, PrincipalFacade, pageTitleService, profileService) {

            var namespace = "organizations.roles.";

            var vm = this;

            /* FIELDS */
            vm.organization = {id: -1};
            vm.roleSources = []; //Source for multiSelect controller that contains Roles
            vm.principals = []; //System principal list

            /* INTERFACE */
            vm.btnNewRole = btnNewRole;
            vm.open = open;
            vm.editRole = editRole;
            vm.deleteRole = deleteRole;
            vm.undoRole = undoRole;
            vm.saveRole = saveRole;
            vm.sendMail = sendMail;
            vm.profile = profileService.getProfile();

            /* Pager settings */
            vm.pager = {
                itemPerPage: 25, //How many items will appear on a single page?
                maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                totalItems: 0, //Num of total items
                currentPage: 1,  //Currently selected page
                numPages: 0
            };

            /* IMPLEMENTATION */

            function activate() {
                $scope.$emit(events.organizationCanBeSaved, false);
                $scope.$watch("vm.roleSources", onRoleSourcesSelectionChanged, true);
                $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            /**
             * Build role box with roles
             * @param roles
             */
            function buildRoleBox(roles) {
                vm.roleSources = [];
                vm.roleSources.push({
                    name: '<strong>Roles</strong>',
                    multiSelectGroup: true
                });

                angular.forEach(roles, function (role) {
                    role.ticked = true;
                    this.push(role);
                }, vm.roleSources);

                vm.roleSources.push({
                    multiSelectGroup: false
                });
            }

            /**
             * Selected roles changed
             */
            function onRoleSourcesSelectionChanged(oldValue, newValue) {
                if (vm.organization.id != -1) {
                    vm.organization.roles = $linq(vm.roleSources).where("x=>x.ticked==true").toArray(); //Query roles
                }
            }

            /**
             * Add new role btn clicked
             */
            function btnNewRole() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/organizations/modals/new-role-dialog.html',
                    controller: 'OrganizationsRolesNewCtrl',
                    resolve: {
                        targetOrganization: function () {
                            return vm.organization;
                        },
                        targetRole: function () {
                            return undefined;
                        }
                    }
                });
                modalInstance.result.then(onNewRoleModalClosed, null);
            }


            /**
             * Open DatePicker and handle selection
             * @param $event
             * @param opened
             */
            function open($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();
                vm[opened] = true;
            }

            /**
             * Opens the role editor
             * @param role
             */
            function editRole(role) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/organizations/modals/new-role-dialog.html',
                    controller: 'OrganizationsRolesNewCtrl',
                    resolve: {
                        targetOrganization: function () {
                            return vm.organization;
                        },
                        targetRole: function () {
                            return role;
                        }
                    }
                });
                modalInstance.result.then(onEditRoleModalClosed, onEditRoleModalDismissed);
            }

            /**
             * Invoked when the role editor closed
             * @param role
             */
            function onEditRoleModalClosed(role) {
                role.save()
                    .then(onRoleUpdateSuccess(role))
                    .catch(onRoleUpdateError);
            }

            /**
             * Invoked when the role editor dismissed (close btn clicked)
             * @param role
             */
            function onEditRoleModalDismissed(role) {
                if (role !== undefined) {
                    if (role.undo !== undefined)
                    {
                        role.undo();
                    }
                }
            }


            /**
             * Remove role
             * @param role role to be removed
             */
            function deleteRole(role) {
                dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                    $translate.instant(namespace + "msg.roleDeleteConfirmation", {name: role.name})).then(function (answer) {
                        if (answer == 'yes') {
                            //Dialog closed with confirmation to delete role
                            role.delete()
                                .success(onRoleDeleteSuccess(role))
                                .error(onRoleDeleteError);
                        }
                    });
            }


            /**
             * Load all roles of the organization
             */
            function loadRoles() {
                OrganizationsFacade.getRoles(vm.organization.id)
                    .then(onOrganizationGetRolesSuccess);
            }


            /**
             * Organization selection changed. refresh data
             * @param selectedOrganization
             */
            function onOrganizationsSelectionChanged(event, selectedOrganization) {
                if (selectedOrganization ) {
                    //create object by id
                    vm.organization = OrganizationsFacade.new({id: selectedOrganization});

                    OrganizationsFacade.getOrganization(selectedOrganization)
                        .then(onGetOrganizationSuccess);


                }
            }

            function onGetOrganizationSuccess(organization) {
                if (organization.data ) {
                    vm.organization = organization.data;

                    //Query Roles for the selected organization
                    loadRoles();
                    //Get the members of It

                    if (!vm.organization.isolate_members || vm.profile.isManagerOfOrganization(vm.organization.id)) {
                        OrganizationsFacade.getMembers(vm.organization.id)
                            .then(onOrganizationGetMembersSuccess);
                    }

                    //Get the entitlements it has
                    OrganizationsFacade.getEntitlements(vm.organization.id)
                        .then(onOrganizationGetEntitlementsSuccess);
                }

            }

            /* Undo Role modifications on role */
            function undoRole(role) {

            }

            /**
             * Save Role data.
             * @param role role to be saved
             */
            function saveRole(role) {
                role.save()
                    .then(onRoleSaveSuccess(role))
                    .catch(onRoleSaveError);
            }


            /*CALLBACKS*/

            /**
             * Invoked when new role modal closed
             * @param newItem the item that was edited
             */
            function onNewRoleModalClosed(newItem) {
                vm.saveRole(newItem);
            }

            /**
             * Invoked when role deleted
             * @param role the role that was deleted
             * @returns {Function}
             */
            function onRoleDeleteSuccess(role) {
                return function (data, status, headers, config) {
                    dialogService.success($translate.instant(namespace + "msg.roleRemoveSuccess"));
                    vm.organization.roles.splice($linq(vm.organization.roles).indexOf("x=>x.id==" + role.id), 1);
                }
            }

            /**
             * Invoked when error occured during deleting a role
             * @param data
             * @param status
             * @param headers
             * @param config
             */
            function onRoleDeleteError(data, status, headers, config) {
                dialogService.error($translate.instant(namespace + "msg.roleRemoveError"));
            }

            /**
             * Invoked when roles are retrieved
             * @param data
             */
            function onOrganizationGetRolesSuccess(data) {
                vm.organization.roles = angular.copy(data.data.items);
                buildRoleBox(data.data.items);
            }

            /**
             * Invoked when members are retrieved
             * @param data members
             */
            function onOrganizationGetMembersSuccess(data) {
                vm.organization.principals = angular.copy(data.data.items);
            }


            /**
             * Invoked when entitlements are retrieved
             * @param data entitlements
             */
            function onOrganizationGetEntitlementsSuccess(data) {
                vm.organization.entitlements = angular.copy(data.data.items);
            }

            /**
             * Invoked when a role has been saved successfully
             * @param role target role
             * @returns {Function}
             */
            function onRoleSaveSuccess(role) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.roleSaveSuccess"));
                    vm.organization.roles.push(RolesFacade.new(role));
                }
            }

            /**
             * Invoked when role was updated
             * @param role
             * @returns {Function}
             */
            function onRoleUpdateSuccess(role) {
                return function (data) {
                    var index = $linq(vm.organization.roles).indexOf("x => x.id == " + role.id);
                    vm.organization.roles[index] = role;
                    dialogService.success($translate.instant(namespace + "msg.roleUpdateSuccess"));
                }
            }

            /**
             * Invoked when failed to update role
             * @param data
             */
            function onRoleUpdateError(data) {
                dialogService.error($translate.instant(namespace + "msg.roleUpdateError"));
            }

            /**
             * Invoked when failed to save role
             * @param data
             */
            function onRoleSaveError(data) {
                dialogService.showMessage($translate.instant(namespace + "msg.roleSaveError"));
            }

            function sendMail(role) {
                dialogService.showMailer(role,MailTargetEnum.User);
            }

        }]);
}());
