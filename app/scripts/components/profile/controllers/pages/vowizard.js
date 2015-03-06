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

    angular.module('hexaaApp.components.profile.controllers.pages')
        .controller('ProfileVOWizardCtrl', ['$scope', 'pageTitleService', '$translate', 'dialogService',
            'EntitlementpacksProxy', 'OrganizationsProxy', '$modal', 'InvitationsProxy',
            'RolesProxy', '$q', '$location',
            function ($scope, pageTitleService, $translate, dialogService,
                EntitlementpacksProxy, OrganizationsProxy,
                      $modal, InvitationsProxy, RolesProxy, $q, $location) {

                var namespace = "profile.vowizard.";

                /* ENUM that describes wizards step states */
                var WizardStates = Object.freeze(
                    {
                        createVO: 1,
                        attachService: 2,
                        createRoles: 3,
                        inviteMembers: 4,
                        finish: 5
                    }
                );

                var vm = this;

                vm.currentStep = 1;
                vm.numberOfSteps = 5;
                vm.next = next;
                vm.previous = previous;
                vm.select = select;
                vm.getProgressbarType = getProgressbarType;
                vm.entitlementpacks = [];

                /* STEP1 */
                vm.organizationIsValid = false;

                /*STEP2*/
                vm.addEntitlementpack = addEntitlementpack;
                vm.removeEntitlementpack = removeEntitlementpack;

                /*STEP 3*/
                vm.editRole = editRole;
                vm.deleteRole = deleteRole;
                vm.newRole = newRole;

                /* STEP4 */
                vm.newMember = newMember;
                vm.newManager = newManager;
                vm.editInvitation = editInvitation;
                vm.resendInvitation = resendInvitation;
                vm.deleteInvitation = deleteInvitation;

                /* FINISH */
                vm.finish = finish;


                function activate() {
                    vm.organization = OrganizationsProxy.new();
                    EntitlementpacksProxy.getPublicEntitlementpacks()
                        .then(onGetPublicEntitlementpacksSuccess);
                }

                activate();

                /*STEP1*/


                /*STEP 2*/
                function onGetPublicEntitlementpacksSuccess(data) {
                    vm.entitlementpacks = angular.copy(data.data.items);
                }

                function addEntitlementpack(entitlementpack) {
                    vm.organization.entitlementpacks.push(entitlementpack);
                }

                function removeEntitlementpack(entitlementpack) {
                    var index = $linq(vm.organization.entitlementpacks).indexOf("x => x.id == " + entitlementpack.id);
                    vm.organization.entitlementpacks.removeAt(index);
                }


                /*STEP 3*/
                function createRoleModal(targetRole) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/organizations/modals/newRole.html',
                        controller: 'OrganizationsRolesNewCtrl',
                        resolve: {
                            targetOrganization: function () {
                                return vm.organization;
                            },
                            targetRole: function () {
                                return targetRole;
                            }
                        }
                    });
                    return modalInstance;
                }

                function newRole(targetRole) {

                    createRoleModal().result.then(onNewRoleModalClosed);
                }

                function onNewRoleModalClosed(role) {
                    role.id = Math.floor((Math.random() * 1000) + 1); //assign temporaly id to give the ability to edit and remove it
                    vm.organization.roles.push(role);
                }

                function onEditRoleModalClosed(role) {
                    var index = $linq(vm.organization.roles).indexOf("x => x.id == " + role.id);
                    vm.organization.roles[index] = role;
                }

                function deleteRole(role) {
                    if (role.is_default === true) {
                        dialogService.warning("You can not delete the default role!");
                    }
                    else {
                        var index = $linq(vm.organization.roles).indexOf("x => x.id == " + role.id);
                        vm.organization.roles.removeAt(index);
                    }
                }

                function editRole(role) {
                    createRoleModal(role).result.then(onEditRoleModalClosed);
                }

                /* STEP4 */

                function createInvitationModal(asManager, targetInvitation, targetRole) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/shared/modals/invitation.html',
                        controller: "ModalInstanceCtrl",
                        size: 'lg',
                        resolve: {
                            unitName: function () {
                                return vm.organization.name;
                            },
                            principal: function () {
                                if (asManager) {
                                    return "manager";
                                }
                                else {
                                    return "member";
                                }
                            },
                            roles: function () {
                                return targetRole;
                            },
                            invitation: function () {
                                return targetInvitation || InvitationsProxy.new({
                                        organization: vm.organization.id,
                                        as_manager: asManager
                                    });
                            }
                        }
                    });

                    return modalInstance;
                }

                function deleteInvitation(invitation) {
                    var index = $linq(vm.organization.invitations).indexOf("x => x.id == " + invitation.id);
                    if (index !== -1) {
                        vm.organization.invitations.removeAt(index);
                    }
                }

                function editInvitation(invitation) {
                    createInvitationModal(invitation.as_manager, invitation, vm.organization.roles).result
                        .then(onEditInvitationModalClosed);
                }

                function onEditInvitationModalClosed(invitation) {
                    var index = $linq(vm.organization.invitations).indexOf("x => x.id == " + invitation.id);
                    if (index !== -1) {
                        vm.organization.invitations[index] = invitation;
                    }
                }

                function resendInvitation(invitation) {

                }

                function newMember() {
                    createInvitationModal(false, null, vm.organization.roles).result
                        .then(onNewInvitationModalClosed);
                }

                function newManager() {
                    createInvitationModal(true, null, vm.organization.roles).result
                        .then(onNewInvitationModalClosed);
                }


                function onNewInvitationModalClosed(invitation) {
                    invitation.id = Math.floor((Math.random() * 1000) + 1); //assign temporaly id to give the ability to edit and remove it
                    vm.organization.invitations.push(invitation);
                }

                /**
                 * Returns the type of the progressbar according to the number of the current stage
                 * @param number The number of the step
                 * @returns {string} The type of the progressbar
                 */
                function getProgressbarType(number) {
                    switch (number) {
                        case 1:
                            return "danger";
                            break;
                        case 2:
                        case 3:
                        case 4:
                            return "warning";
                            break;
                        default:
                            return "success";
                    }
                }


                function createDefaultRole() {
                    var index = $linq(vm.organization.roles).indexOf("x => x.is_default === true");
                    if (index === -1) {
                        //create fake default role to the local collection
                        var default_role = RolesProxy.new();
                        default_role.id = Math.floor((Math.random() * 1000) + 1);
                        default_role.name = vm.organization.role.name;
                        default_role.is_default = true;
                        vm.organization.roles.push(default_role);
                    }
                    else {
                        vm.organization.roles[index].name = vm.organization.role.name;
                    }
                }

                /**
                 * Puts the wizard into the next state
                 */
                function next() {
                    if (vm.organization.name !== null &&
                        vm.organization.role.name !== null) {
                        select(++vm.currentStep);
                    }

                }

                /**
                 * Puts wizard into the previous state
                 */
                function previous() {
                    if (vm.currentStep > 1) {
                        select(--vm.currentStep);
                    }
                }

                /**
                 * Selects the number-th state of the wizard
                 * @param number
                 */
                function select(number) {
                    if (!vm.organizationIsValid) {
                        dialogService.warning("First you must create an organization!");
                        vm.currentStep = WizardStates.createVO;
                    }
                    else {
                        vm.currentStep = number;
                    }
                    createDefaultRole();
                }


                function onAddEntitlementpackSuccess(entitlementpack) {
                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.entitlementpackAddSuccess", {entitlementpack: entitlementpack.name}));
                    }
                }

                function onAddEntitlementpackError(entitlementpack) {
                    return function (error) {
                        dialogService.error($translate.instant(namespace + "msg.entitlementpackAddError", {entitlementpack: entitlementpack.name}));
                        vm.currentStep = WizardStates.attachService;
                        return $q.reject(error);
                    }
                }

                function onInvitationSuccess(invitation) {
                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.invitationAddSuccess", {invitation: invitation.message}));
                    }
                }

                function onInvitationError(invitation) {
                    return function (error) {
                        dialogService.error($translate.instant(namespace + "msg.invitationAddError", {invitation: invitation.message}));
                        vm.currentStep = WizardStates.inviteMembers;
                        return $q.reject(error);
                    }
                }

                function onAddRoleSuccess(role, correspondingInvitations) {
                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.roleAddSuccess", {role: role.name}));
                        if (correspondingInvitations !== undefined) {
                            angular.forEach(correspondingInvitations, function (invitation) {
                                var index = $linq(vm.organization.invitations).indexOf("x => x.id == " + invitation.id);
                                if (index !== -1) {
                                    vm.organization.invitations[index].role = parseInt(role.id);
                                }
                            });
                        }
                    }
                }

                function onAddRoleError(role) {
                    return function (error) {
                        dialogService.error($translate.instant(namespace + "msg.roleAddError", {role: role.name}));
                        vm.currentStep = WizardStates.createRoles;
                        return $q.reject(error);
                    }
                }

                function createRoles() {
                    return $q.all(
                        vm.organization.roles.map(function (role) {
                            var invitationlist = $linq(vm.organization.invitations).where("x => x.role == " + role.id).toArray();

                            if (role.is_default === false) {
                                return RolesProxy.createRole(vm.organization.id, role)
                                    .then(onAddRoleSuccess(role, invitationlist), onAddRoleError(role));
                            }
                            else {
                                //update default role
                                role.id = parseInt(vm.organization.default_role);
                                return RolesProxy.updateRole(role)
                                    .then(onAddRoleSuccess(role, invitationlist), onAddRoleError(role));
                            }

                        })
                    );
                }

                function createInvitations() {
                    return $q.all(
                        vm.organization.invitations.map(function (invitation) {
                            invitation.id = undefined;
                            invitation.organization = parseInt(vm.organization.id);
                            return InvitationsProxy.invite(invitation)
                                .then(onInvitationSuccess(invitation), onInvitationError(invitation));
                        })
                    );
                }

                function createEntitlementpacks() {
                    $q.all(vm.organization.entitlements.map(function (entitlementpack) {
                            return OrganizationsProxy.addEntitlementpack(vm.organization, entitlementpack)
                                .then(onAddEntitlementpackSuccess(entitlementpack))
                                .catch(onAddEntitlementpackError(entitlementpack));
                        })
                    );
                }

                function onOrganizationCreateSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.organizationAddSuccess", {organization: vm.organization.name}));

                    createEntitlementpacks();

                    createRoles().then(onRolesCreated);
                }

                function onWizardTaskSuccess() {
                    var path = "/organizations/" + vm.organization.id + "/news";
                    $location.path(path);
                }

                function onRolesCreated() {
                    createInvitations().then(onWizardTaskSuccess);
                }

                function onOrganizationCreateError(error) {
                    vm.currentStep = WizardStates.createVO;
                    dialogService.notifyUIError(error.data.errors);
                }

                function finish() {
                    //Create organization
                    vm.organization.save()
                        .then(onOrganizationCreateSuccess,
                        onOrganizationCreateError);
                }

            }]);

}());
