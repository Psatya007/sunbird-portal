'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:collectionEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('CollectionEditorController', function(config, $stateParams, $location, $sce, $state, $timeout, $rootScope, contentService) {

        var collectionEditor = this;
        collectionEditor.contentId = $stateParams.contentId;


        collectionEditor.openCollectionEditor = function(data) {

            $("#collectionEditor").iziModal({
                title: '',
                iframe: true,
                iframeURL: "/thirdparty/bower_components/collection-editor-iframe/index.html",
                navigateArrows: false,
                fullscreen: false,
                openFullscreen: true,
                closeOnEscape: false,
                overlayClose: false,
                onClosed: function() {
                    if ($stateParams.state) {
                        $state.go($stateParams.state);
                    } else {
                        $state.go("WorkSpace.DraftContent");
                    }
                }
            });

            window.context = {
                user: {
                    id: $rootScope.userId,
                    name: ""
                },
                sid: "rctrs9r0748iidtuhh79ust993",
                contentId: collectionEditor.contentId,
                channel: "ntp.sunbird"
            };

            window.config = {
                corePluginsPackaged: false,
                modalId: 'collectionEditor',
                dispatcher: 'local',
                apislug: 'api',
                alertOnUnload: true,
                headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
                loadingImage: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
                plugins: [
                    { "id": "org.ekstep.preview", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.lessonbrowser", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.textbookmeta", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.unitmeta", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.contentmeta", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.coursemeta", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.courseunitmeta", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.telemetry", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.sunbirdcollectionheader", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.toaster", "ver": "1.0", "type": "plugin" },
                    { "id": "org.ekstep.collectioneditorfunctions", "ver": "1.0", "type": "plugin" } 
                ],
                localDispatcherEndpoint: '/telemetry',
                editorConfig: {
                    "mode": "Edit",
                    "contentStatus": "draft",
                    "rules": {
                        "levels": 3,
                        "objectTypes": collectionEditor.getTreeNodes(data.type)
                    },
                    "defaultTemplate": {}
                }
            }

            var req = { contentId: collectionEditor.contentId };
            var qs = { fields: 'createdBy,status' }

            contentService.getById(req, qs).then(function(response) {
                if (response && response.responseCode === 'OK') {
                    if (response.result.content.createdBy !== $rootScope.userId) {
                        $state.go('Home');
                    } else {
                        collectionEditor.updateModeAndStatus(response.result.content.status);
                        $timeout(function() {
                            $('#collectionEditor').iziModal('open');
                        }, 100);
                    }
                }
            });
        };

        collectionEditor.getTreeNodes = function(type) {
            var editorConfig = [];
            switch (type) {
                case 'Course':
                    editorConfig.push({ "type": "Course", "label": "Course", "isRoot": true, "editable": true, "childrenTypes": ["CourseUnit", "Collection", "Story", "Game", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-book" }, { "type": "CourseUnit", "label": "Course Unit", "isRoot": false, "editable": true, "childrenTypes": ["CourseUnit", "Collection", "Story", "Game", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Game", "label": "Game", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
                    return editorConfig;
                case 'Collection':
                    editorConfig.push({ "type": "Collection", "label": "Collection", "isRoot": true, "editable": true, "childrenTypes": ["Collection", "Story", "Game", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Game", "label": "Game", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
                    return editorConfig;
                default:
                    editorConfig.push({ "type": "TextBook", "label": "Textbook", "isRoot": true, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Story", "Game", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-book" }, { "type": "TextBookUnit", "label": "Textbook Unit", "isRoot": false, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Story", "Game", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Game", "label": "Game", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
                    return editorConfig;
            }
        };

        collectionEditor.updateModeAndStatus = function(status) {
            if (status.toLowerCase() === "draft") {
                window.config.editorConfig.mode = "Edit";
                window.config.editorConfig.contentStatus = "draft";
            }
            if (status.toLowerCase() === "review") {
                window.config.editorConfig.mode = "Read";
                window.config.editorConfig.contentStatus = "draft";
            }
            if (status.toLowerCase() === "live") {
                window.config.editorConfig.mode = "Edit";
                window.config.editorConfig.contentStatus = "live";
            }
        }
        collectionEditor.openCollectionEditor($stateParams);
    });