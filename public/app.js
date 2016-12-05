/*
 *  Starter code for University of Waterloo CS349 Fall 2016.
 *  
 *  bwbecker 20161113
 *  
 *  Some code adapted from https://github.com/possan/playlistcreator-example
 */

"use strict";

// An anonymous function that is executed passing "window" to the
// parameter "exports".  That is, it exports startApp to the window
// environment.
(function(exports) {
	var client_id = '7e7dae9509bc4867888d8dee290c90a2';		// Fill in with your value from Spotify
	var redirect_uri = 'http://localhost:3000/index.html';
	var g_access_token = '';

    var ListModel = function() {
        this._pairs = [];

        // Add a key/value pair or reject and return an error message
        this.addPair = function(key, value) {
            if (typeof key === 'undefined' || typeof value === 'undefined') {
                return "Input is undefined.";
            } else {
                var tagExist = false;
                var trackExist = false;

                if ((value == 1) || (value == 2) || (value == 3) || (value == 4) || (value == 5)) {
                    getData("rate", function (rateData) {

                        if (value == 1) {
                            $("#tracks li:contains('" + key + "') img:eq(0)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(1)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(2)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(3)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(4)").attr("src", "img/star.png");
                        } else if (value == 2) {
                            $("#tracks li:contains('" + key + "') img:eq(0)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(1)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(2)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(3)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(4)").attr("src", "img/star.png");
                        } else if (value == 3) {
                            $("#tracks li:contains('" + key + "') img:eq(0)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(1)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(2)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(3)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(4)").attr("src", "img/star.png");
                        } else if (value == 4) {
                            $("#tracks li:contains('" + key + "') img:eq(0)").attr("src", "img/star2.png");
                            $("#tracks li:contains('" + key + "') img:eq(1)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(2)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(3)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(4)").attr("src", "img/star.png");
                        } else if (value == 5) {
                            $("#tracks li:contains('" + key + "') img:eq(0)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(1)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(2)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(3)").attr("src", "img/star.png");
                            $("#tracks li:contains('" + key + "') img:eq(4)").attr("src", "img/star.png");
                        }

                        // Add track name to db.
                        var origin_tracks;
                        var ID;

                        for (var i = 0; i < rateData.length; i++) {
                            if (rateData[i].level == value) {
                                origin_tracks = rateData[i].tracks;
                                origin_tracks.push(key);

                                ID = rateData[i].id;
                            }
                        }

                        $.ajax("http://localhost:3000/rate/" + ID, {
                            contentType: 'application/json; charset=UTF-8',
                            dataType: 'json',
                            type: "DELETE",
                            success: function (r) {
                                console.log('Delet success.');
                            },
                            error: function (r) {
                                console.log('Delete error.');
                            }
                        });

                        $.ajax("http://localhost:3000/rate", {
                            contentType: 'application/json; charset=UTF-8',
                            dataType: 'json',
                            type: "POST",
                            data: JSON.stringify({"level": value, "tracks": origin_tracks}),
                            success: function (r) {
                                console.log('Add new tag success.');
                            },
                            error: function (r) {
                                console.log('Add new tag error.');
                            }
                        });
                    });
                } else {
                    getData("tag", function (tagData) {

                        getPlaylists(function(playlists) {
                            console.log('playlists = ', playlists);

                            playlists.forEach(function(playlists) {
                                var name = playlists.name;
                                var OwnerID = playlists.owner.id;
                                var playlistID = playlists.id;

                                getTracks(OwnerID, name, playlistID, function (tracks) {
                                    tracks.forEach(function(tracks) {
                                        var trackName = tracks.track.name;

                                        if (trackName == key) {

                                            // Check if the tag already exist.
                                            for (var i = 0; i < tagData.length; i++) {
                                                if ((tagData[i].name == value) && (tagData[i].playlist == name)) {

                                                    // Check if the track name already in tracks.
                                                    for (var j = 0; j < tagData[i].tracks.length; j++) {
                                                        if (tagData[i].tracks[j] == key) {
                                                            // In this case, don't do anything.
                                                            trackExist = true;
                                                            break;
                                                        }
                                                    }

                                                    // Add new track name to tracks.
                                                    if (trackExist == false) {
                                                        console.log('track does not exist.');

                                                        var origin_tracks = tagData[i].tracks;
                                                        origin_tracks.push(key);

                                                        var ID = tagData[i].id;
                                                        $.ajax("http://localhost:3000/tag/" + ID, {
                                                            contentType: 'application/json; charset=UTF-8',
                                                            dataType: 'json',
                                                            type: "DELETE",
                                                            success: function (r) {
                                                                console.log('Delet success.');
                                                            },
                                                            error: function (r) {
                                                                console.log('Delete error.');
                                                            }
                                                        });

                                                        $.ajax("http://localhost:3000/tag", {
                                                            contentType: 'application/json; charset=UTF-8',
                                                            dataType: 'json',
                                                            type: "POST",
                                                            data: JSON.stringify({"name": value, "playlist": name, "tracks": origin_tracks}),
                                                            success: function (r) {
                                                                console.log('Add new tag success.');
                                                            },
                                                            error: function (r) {
                                                                console.log('Add new tag error.');
                                                            }
                                                        });

                                                        // Add new tag to track.
                                                        $("#tracks li:contains('" + key + "')").after('<button class="tag">' + value + '&nbsp&nbsp<span>×</span></button>');
                                                    }

                                                    tagExist = true;
                                                    break;
                                                }
                                            }

                                            // Add new Tag to db.
                                            if (tagExist == false) {
                                                console.log('tag does not exist.');

                                                $.ajax("http://localhost:3000/tag", {
                                                    contentType: 'application/json; charset=UTF-8',
                                                    dataType: 'json',
                                                    type: "POST",
                                                    data: JSON.stringify({"name": value, "playlist": name, "tracks": [key]}),
                                                    success: function (r) {
                                                        console.log('Add new tag success.');
                                                    },
                                                    error: function (r) {
                                                        console.log('Add new tag error.');
                                                    }
                                                });

                                                // Add new tag to track.
                                                $("#tracks li:contains('" + key + "')").after('<button class="tag">' + value + '&nbsp&nbsp<span>×</span></button>');
                                                // Add new tag to tag list.
                                                $(".tagList").append('<button class="searchTag">' + value + '&nbsp&nbsp<span>×</span></button>')
                                            }
                                        }
                                    });
                                });
                            });
                        });

                        getTagedTracks('tag');
                        getTagedTracks('searchTag');

                        deleteTag('tag');
                        deleteTag('searchTag');
                    });
                }

                this._pairs.push([key, value]);
                this.notify([key, value]);
                return null;
            }

        }

        this.getPairs = function() {
            return this._pairs;
        }

        /*
        this.deleteItem = function(idx) {
            this._pairs.splice(idx, 1);
            this.notify();
        }
        */
    }

    // Add observer functionality to ListModel objects
    _.assignIn(ListModel.prototype, {
        // list of observers
        observers: [],

        // Add an observer to the list
        addObserver: function(observer) {
            this.observers.push(observer);
            observer(this, null);
        },

        // Notify all the observers on the list
        notify: function(args) {
            _.forEach(this.observers, function(obs) {
                obs(this, args);
            });
        }
    });

    /*
     * A view of the list of pairs model.
     * model:  the model we're observing
     * div:  the HTML div where the list goes
     */
    var ListView = function(model, div) {
        var that = this;

        this.updateView = function(obs, args) {
            var pairs = model.getPairs();

            // Display each pair
            var myDiv = $(div);
            myDiv.empty();

            that.appendInputRow();
        };

        /*
        this.makeDeleteItemController = function(idx) {
            return function() {
                model.deleteItem(idx);
            }
        };
        */

        // Append a blank input row to the div
        this.appendInputRow = function() {
            var template = $("template#list_input").html();
            $(div).append(template);

            $("#input_row .key").focus();

            // What to do when the add button is clicked.
            // That is, a controller.
            $("#addItemBtn").click(function() {
                var key = $("#input_row .key").val();
                var value = $("#input_row .value").val();

                var err = model.addPair(key, value);

                if (err !== null) {
                    $("#input_row .error").html(err).show();

                } else {
                    $("#input_row .error").hide();
                }

                $("#input_row .key").focus();
            });
        };

        model.addObserver(this.updateView);
    }

    /*
     * Get the Username of the logged-in user.
     */
    function getUsername(callback) {
        console.log('getUsername');

        var url = 'https://api.spotify.com/v1/me';

        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + g_access_token
            },
            success: function(r) {
                console.log('got username response', r);
                callback(r.id);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

	/*
	 * Get the playlists of the logged-in user.
	 */
	function getPlaylists(callback) {
		console.log('getPlaylists');

        var url = 'https://api.spotify.com/v1/me/playlists';
        //var url = 'https://api.spotify.com/v1/users/cs349/playlists';  // Account for testing

		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success: function(r) {
				console.log('got playlist response', r);
				callback(r.items);
			},
			error: function(r) {
				callback(null);
			}
		});
	}

    /*
     * Get the tracks of the user selected playlist.
     */
    function getTracks(username, playlistName, playlistID, callback) {
        console.log('getTracks');

        // Get Username and Playlist ID by parameter.
        var url = 'https://api.spotify.com/v1/users/' + username + '/playlists/' + playlistID + '/tracks';

        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + g_access_token
            },
            success: function(r) {
                console.log('got tracks response', r);
                callback(r.items);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

    /*
     * Get dat from db.json. (saved tags or rates)
     */
    function getData(type, callback) {
        console.log('getData');

        var url = 'http://localhost:3000/' + type;

        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + g_access_token
            },
            success: function(r) {
                console.log('got tagData response', r);
                callback(r);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

    /*
     * Get correspond cover picture of the playlist.
     */
    function getCoverPic(img_url) {
        $('#coverpage img').remove();
        $("#coverpage").append('<img src="' + img_url + '">')
    }

    /*
     * Get name of the playlist.
     */
    function getPlaylistName(playlists_name) {
        $("#playlists_name").text(playlists_name);
    }

    /*
     * Generate a tag list.
     */
    function getTagList(username, playlistID, playlist_name) {
        $('.searchTag').remove();

        $(".alltracks").unbind();

        // If clicked on "All" button -> show all the tracks.
        $(".alltracks").bind("click" ,function () {
            clearTracklist();

            $('.searchTag').remove();

            $(".level1").attr("src", "img/star2.png");
            $(".level2").attr("src", "img/star2.png");
            $(".level3").attr("src", "img/star2.png");
            $(".level4").attr("src", "img/star2.png");
            $(".level5").attr("src", "img/star2.png");


            getallTracks(username, playlistID, playlist_name);

            getData("tag", function (tagData) {
                // Add saved tags to tag list. (for search)
                for (var i = 0; i < tagData.length; i++) {
                    if (tagData[i].playlist == playlist_name) {
                        //&nbsp<span>×</span>
                        $(".tagList").append('<button class="searchTag">' + tagData[i].name + '&nbsp&nbsp<span>×</span></button>')
                    }
                }
            });
        });

        getData("tag", function (tagData) {
            $('.searchTag').remove();

            // Add saved tags to tag list. (for search)
            for (var i = 0; i < tagData.length; i++) {
                if (tagData[i].playlist == playlist_name) {
                    $(".tagList").append('<button class="searchTag">' + tagData[i].name + '&nbsp&nbsp<span>×</span></button>')
                }
            }
        });
    }

    /*
     * Show all tracks of the playlist.
     */
    function getallTracks(username, playlistID, playlist_name) {
        getTracks(username, "Don't Care", playlistID, function (tracks) {
            console.log('tracks = ', tracks);

            getData("tag", function (tagData) {
                console.log('# of tags =', tagData.length);

                getData("rate", function (rateData) {
                    console.log('# of rates =', rateData.length);

                    tracks.forEach(function(tracks) {
                        var trackName = tracks.track.name;

                        var rateExist = false;

                        // Check if there's any saved rate for this track
                        for (var i = 0; i < rateData.length; i++) {
                            for (var j = 0; j < rateData[i].tracks.length; j++) {
                                if (rateData[i].tracks[j] == trackName) {
                                    rateExist = true;

                                    if (rateData[i].level == 1) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star.png"></li>');
                                    } else if (rateData[i].level == 2) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png"></li>');
                                    } else if (rateData[i].level == 3) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png"></li>');
                                    } else if (rateData[i].level == 4) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png"></li>');
                                    } else if (rateData[i].level == 5) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png">' +
                                            '<img src="img/star.png"></li>');
                                    }
                                }
                            }
                        }

                        if (rateExist == false) {
                            $('#tracks').append('<li>' + trackName + '' +
                                '<img src="img/star2.png">' +
                                '<img src="img/star2.png">' +
                                '<img src="img/star2.png">' +
                                '<img src="img/star2.png">' +
                                '<img src="img/star2.png"></li>');
                        }

                        // Add saved tags to tracks.
                        for (var i = 0; i < tagData.length; i++) {
                            var tagName = tagData[i].name;
                            var tracklist = tagData[i].tracks;

                            for (var j = 0; j < tracklist.length; j++) {
                                if (tracklist[j] == trackName) {
                                    $('#tracks').append('<button class="tag">' + tagName + '&nbsp&nbsp<span>×</span></button>');
                                }
                            }
                        }

                        //$('#tracks').append('<button class="addTag">' + '+' + '</button>');
                    });

                    getTagedTracks('alltags');
                    getTagedTracks('tag');
                    getTagedTracks('searchTag');

                    deleteTag('tag', username, playlistID, playlist_name);
                    deleteTag('searchTag', username, playlistID, playlist_name);
                });
            });
        });
    }

    /*
     * Clear the track list.
     */
    function clearTracklist() {
        $('#tracks li').remove();
        $('#tracks .tag').remove();
    }

    function deleteTag(className, username, playlistID, playlist_name) {
        $('.' + className + ' span').click(function () {

            var buttonName = $(this).parent().text();
            buttonName = buttonName.substring(0,buttonName.length - 3);


            getData("tag", function (tagData) {
               for (var i = 0; i < tagData.length; i++) {
                   if (tagData[i].name == buttonName) {
                       var ID = tagData[i].id;

                       $.ajax("http://localhost:3000/tag/" + ID, {
                           contentType: 'application/json; charset=UTF-8',
                           dataType: 'json',
                           type: "DELETE",
                           success: function (r) {
                               console.log('Delete success.');
                           },
                           error: function (r) {
                               console.log('Delete error.');
                           }
                       });

                       getTagList(username, playlistID, playlist_name);

                       getallTracks(username, playlistID, playlist_name);
                   }
               }
            });

        });
    }

    /*
     * Generate a new track list by tag name.
     */
    function getTagedTracks(className) {
        $('.' + className).unbind();

        $('.' + className).click(function () {

            // Clear the previous track list.
            clearTracklist();

            var buttonName = $(this).text();

            if (buttonName != "All") {
                buttonName = buttonName.substring(0,buttonName.length - 3);
            }

            var de_weight = new Array();

            // Get new track list from db.json
            getData("tag", function (tagData) {

                getData("rate", function (rateData) {
                    if (buttonName == "All") {

                        for (var i = 0; i < tagData.length; i++) {
                            var t = tagData[i].tracks;


                            for (var j = 0; j < t.length; j++) {
                                var trackName = t[j];

                                // De-weight
                                var already_exist = false;
                                for (var z = 0; z < de_weight.length; z++) {
                                    if (de_weight[z] == trackName) {
                                        already_exist = true;
                                        break;
                                    }
                                }

                                if (already_exist == true) {
                                    continue;
                                } else {
                                    de_weight.push(trackName);
                                }

                                var rateExist = false;

                                // Check if there's any saved rate for this track
                                for (var m = 0; m < rateData.length; m++) {
                                    for (var n = 0; n < rateData[m].tracks.length; n++) {
                                        if (rateData[m].tracks[n] == trackName) {
                                            rateExist = true;

                                            if (rateData[m].level == 1) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 2) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 3) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 4) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 5) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            }
                                        }
                                    }
                                }

                                if (rateExist == false) {
                                    $('#tracks').append('<li>' + trackName + '' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png"></li>');
                                }

                                for (var k = 0; k < tagData.length; k++) {
                                    var tagName = tagData[k].name;
                                    var tracklist = tagData[k].tracks;

                                    for (var l = 0; l < tracklist.length; l++) {
                                        if (tracklist[l] == trackName) {
                                            $('#tracks').append('<button class="tag">' + tagName + '&nbsp&nbsp<span>×</span></button>');
                                        }
                                    }
                                }
                            }
                        }
                    } else {

                        for (var i = 0; i < tagData.length; i++) {
                            if (tagData[i].name == buttonName) {
                                // Add tracks to new track list.
                                var t = tagData[i].tracks;


                                for (var j = 0; j < t.length; j++) {
                                    var trackName = t[j];

                                    var rateExist = false;

                                    // Check if there's any saved rate for this track
                                    for (var m = 0; m < rateData.length; m++) {
                                        for (var n = 0; n < rateData[m].tracks.length; n++) {
                                            if (rateData[m].tracks[n] == trackName) {
                                                rateExist = true;

                                                if (rateData[m].level == 1) {
                                                    $('#tracks').append('<li>' + trackName + '' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star.png"></li>');
                                                } else if (rateData[m].level == 2) {
                                                    $('#tracks').append('<li>' + trackName + '' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png"></li>');
                                                } else if (rateData[m].level == 3) {
                                                    $('#tracks').append('<li>' + trackName + '' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png"></li>');
                                                } else if (rateData[m].level == 4) {
                                                    $('#tracks').append('<li>' + trackName + '' +
                                                        '<img src="img/star2.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png"></li>');
                                                } else if (rateData[m].level == 5) {
                                                    $('#tracks').append('<li>' + trackName + '' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png">' +
                                                        '<img src="img/star.png"></li>');
                                                }
                                            }
                                        }
                                    }

                                    if (rateExist == false) {
                                        $('#tracks').append('<li>' + trackName + '' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png">' +
                                            '<img src="img/star2.png"></li>');
                                    }

                                    for (var k = 0; k < tagData.length; k++) {
                                        var tagName = tagData[k].name;
                                        var tracklist = tagData[k].tracks;

                                        for (var l = 0; l < tracklist.length; l++) {
                                            if (tracklist[l] == trackName) {
                                                $('#tracks').append('<button class="tag">' + tagName + '&nbsp&nbsp<span>×</span></button>');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
        });
    }

    function determineLevel() {
        var clicked = false;

        $(".level1").click(function () {
            console.log('search level1');

            clicked = true;

            $(this).attr("src", "img/star.png");
            $(".level2").attr("src", "img/star2.png");
            $(".level3").attr("src", "img/star2.png");
            $(".level4").attr("src", "img/star2.png");
            $(".level5").attr("src", "img/star2.png");

            getRatedTracks(1)
        });

        $(".level2").click(function () {
            console.log('search level2');

            clicked = true;

            $(".level1").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
            $(".level3").attr("src", "img/star2.png");
            $(".level4").attr("src", "img/star2.png");
            $(".level5").attr("src", "img/star2.png");

            getRatedTracks(2)
        });

        $(".level3").click(function () {
            console.log('search level3');

            clicked = true;

            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
            $(".level4").attr("src", "img/star2.png");
            $(".level5").attr("src", "img/star2.png");

            getRatedTracks(3)
        });

        $(".level4").click(function () {
            console.log('search level4');

            clicked = true;

            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(".level3").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
            $(".level5").attr("src", "img/star2.png");

            getRatedTracks(4)
        });

        $(".level5").click(function () {
            console.log('search level5');

            clicked = true;

            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(".level3").attr("src", "img/star.png");
            $(".level4").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");

            getRatedTracks(5)
        });

        $(".level1").mouseover(function () {
            $(this).attr("src", "img/star.png");
        });

        $(".level1").mouseout(function () {
            if (clicked == false){
                $(this).attr("src", "img/star2.png");
            }
        });

        $(".level2").mouseover(function () {
            $(".level1").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
        });

        $(".level2").mouseout(function () {
            if (clicked == false){
                $(".level1").attr("src", "img/star2.png");
                $(this).attr("src", "img/star2.png");
            }
        });

        $(".level3").mouseover(function () {
            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
        });

        $(".level3").mouseout(function () {
            if (clicked == false){
                $(".level1").attr("src", "img/star2.png");
                $(".level2").attr("src", "img/star2.png");
                $(this).attr("src", "img/star2.png");
            }
        });

        $(".level4").mouseover(function () {
            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(".level3").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
        });

        $(".level4").mouseout(function () {
            if (clicked == false){
                $(".level1").attr("src", "img/star2.png");
                $(".level2").attr("src", "img/star2.png");
                $(".level3").attr("src", "img/star2.png");
                $(this).attr("src", "img/star2.png");
            }
        });

        $(".level5").mouseover(function () {
            $(".level1").attr("src", "img/star.png");
            $(".level2").attr("src", "img/star.png");
            $(".level3").attr("src", "img/star.png");
            $(".level4").attr("src", "img/star.png");
            $(this).attr("src", "img/star.png");
        });

        $(".level5").mouseout(function () {
            if (clicked == false){
                $(".level1").attr("src", "img/star2.png");
                $(".level2").attr("src", "img/star2.png");
                $(".level3").attr("src", "img/star2.png");
                $(".level4").attr("src", "img/star2.png");
                $(this).attr("src", "img/star2.png");
            }
        });

    }

    function getRatedTracks(level) {
        clearTracklist();

        getData("tag", function (tagData) {
            getData("rate", function (rateData) {
                for (level; level < 6; level++) {
                    for (var i = 0; i < rateData.length; i++) {
                        if (rateData[i].level == level) {
                            var t = rateData[i].tracks;

                            for (var j = 0; j < t.length; j++) {
                                var trackName = t[j];

                                var rateExist = false;

                                // Check if there's any saved rate for this track
                                for (var m = 0; m < rateData.length; m++) {
                                    for (var n = 0; n < rateData[m].tracks.length; n++) {
                                        if (rateData[m].tracks[n] == trackName) {
                                            rateExist = true;

                                            if (rateData[m].level == 1) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 2) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 3) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 4) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star2.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            } else if (rateData[m].level == 5) {
                                                $('#tracks').append('<li>' + trackName + '' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png">' +
                                                    '<img src="img/star.png"></li>');
                                            }
                                        }
                                    }
                                }

                                if (rateExist == false) {
                                    $('#tracks').append('<li>' + trackName + '' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png">' +
                                        '<img src="img/star2.png"></li>');
                                }

                                for (var k = 0; k < tagData.length; k++) {
                                    var tagName = tagData[k].name;
                                    var tracklist = tagData[k].tracks;

                                    for (var l = 0; l < tracklist.length; l++) {
                                        if (tracklist[l] == trackName) {
                                            $('#tracks').append('<button class="tag">' + tagName + '&nbsp&nbsp<span>×</span></button>');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });


    }

    function changePlaylist() {
        $('#playlists li').click(function () {
            var screen_width = $(window).width();
            var screen_height  = $(window).height();

            if ((screen_width < 685) && (screen_width > 360)) {
                $("#playlists").hide();
                $("#tracks").show();
            }

            if (! (screen_width < 685) && (screen_width > 360)){
                var that = this;

                getData("scheme", function (schemeData) {
                    console.log('------------------------------------------->YES');


                    var background;
                    var hover_background;
                    var border;
                    var current_scheme = schemeData[0].current_scheme;

                    if (current_scheme == "dark") {
                        background = "#1c1c1f";
                        hover_background = "#222326";
                        border = "solid 2px #84bd00";
                    } else if (current_scheme == "light") {
                        background = "#f2f3f7";
                        hover_background = "#e5e9ec";
                        border = "solid 2px #018ada";
                    }

                    $('#playlists li').css("background", background);
                    $('#playlists li').css("border-right", "none");

                    $(that).css("background", hover_background);
                    $(that).css("border-right", border);
                });
            }

            var index = $(this).index() - 1;

            clearTracklist();

            getPlaylists(function(playlists) {
                var img_url = playlists[index].images[0].url;
                getCoverPic(img_url);

                var playlists_name = playlists[index].name;
                getPlaylistName(playlists_name);

                getTagList(playlists[index].owner.id, playlists[index].id, playlists[index].name);

                getallTracks(playlists[index].owner.id, playlists[index].id, playlists[index].name);
            });

        });
    }

    function changeScheme(current_scheme) {
        var scheme_indicator = current_scheme;

        $("#change_scheme img").click(function () {
            if (scheme_indicator == "light") {
                $('link[href="light-style.css"]').attr('href','dark-style.css');
                $('body').css("background", "#0e0f10");

                $('#playlists li').css("background", "#1c1c1f");
                $('#playlists li').css("border-right", "none");
                $('#playlists li:eq(1)').css("background", "#222326");  // dark
                $('#playlists li:eq(1)').css("border-right", "solid 2px #84bd00");  // dark

                scheme_indicator = "dark";

                getData("scheme", function (schemeData) {
                    var ID = schemeData[0].id;
                    $.ajax("http://localhost:3000/scheme/" + ID, {
                        contentType: 'application/json; charset=UTF-8',
                        dataType: 'json',
                        type: "DELETE",
                        success: function (r) {
                            console.log('Delet success.');
                        },
                        error: function (r) {
                            console.log('Delete error.');
                        }
                    });

                    $.ajax("http://localhost:3000/scheme", {
                        contentType: 'application/json; charset=UTF-8',
                        dataType: 'json',
                        type: "POST",
                        data: JSON.stringify({"current_scheme": "dark"}),
                        success: function (r) {
                            console.log('Change Scheme Success.');
                        },
                        error: function (r) {
                            console.log('Change Scheme Fail.');
                        }
                    });
                });
            } else if (scheme_indicator == "dark") {
                $('link[href="dark-style.css"]').attr('href','light-style.css');
                $('body').css("background", "#FFFFFF");

                $('#playlists li').css("background", "#f2f3f7");
                $('#playlists li').css("border-right", "none");
                $('#playlists li:eq(1)').css("background", "#e5e9ec");  // light
                $('#playlists li:eq(1)').css("border-right", "solid 2px #018ada");  // light

                scheme_indicator = "light";

                getData("scheme", function (schemeData) {
                    var ID = schemeData[0].id;
                    $.ajax("http://localhost:3000/scheme/" + ID, {
                        contentType: 'application/json; charset=UTF-8',
                        dataType: 'json',
                        type: "DELETE",
                        success: function (r) {
                            console.log('Delet success.');
                        },
                        error: function (r) {
                            console.log('Delete error.');
                        }
                    });

                    $.ajax("http://localhost:3000/scheme", {
                        contentType: 'application/json; charset=UTF-8',
                        dataType: 'json',
                        type: "POST",
                        data: JSON.stringify({"current_scheme": "light"}),
                        success: function (r) {
                            console.log('Change Scheme Success.');
                        },
                        error: function (r) {
                            console.log('Change Scheme Fail.');
                        }
                    });
                });
            }
        });
    }

	/*
	 * Redirect to Spotify to login.  Spotify will show a login page, if
	 * the user hasn't already authorized this app (identified by client_id).
	 */
	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);

		console.log("doLogin url = " + url);
		window.location = url;
	}

	/*
	 * What to do once the user is logged in.
	 */
	function loggedIn() {
		$('#login').hide();
		$('#loggedin').show();

        getData("scheme", function (schemeData) {
            var current_scheme = schemeData[0].current_scheme;
            
            if (current_scheme == "light") {
                $('link[href="dark-style.css"]').attr('href','light-style.css');
                $('body').css("background", "#FFFFFF");
            } else if (current_scheme == "dark") {
                $('link[href="light-style.css"]').attr('href','dark-style.css');
                $('body').css("background", "#0e0f10");
            }

            getUsername(function (username) {
                console.log('username', username);

                getPlaylists(function(playlists) {
                    console.log('playlists = ', playlists);

                    playlists.forEach(function(playlists) {
                        var img_source = playlists.images[0].url;

                        // Show playlists.
                        $('#playlists').append('<li>' +
                            '<div class="playlist_cover">' +
                            '<img src="' + img_source + '">' +
                            '</div>' +
                            '<div class="playlistName">' +
                            '<span>' + playlists.name + '</span>' +
                            '</div>' +
                            '</li>');
                    });

                    var screen_width = $(window).width();
                    var screen_height  = $(window).height();

                    if (! (screen_width < 685) && (screen_width > 360)){
                        if (current_scheme == "light") {
                            $('#playlists li:eq(1)').css("background", "#e5e9ec");  // light
                            $('#playlists li:eq(1)').css("border-right", "solid 2px #018ada");  // light
                        } else if (current_scheme == "dark") {
                            $('#playlists li:eq(1)').css("background", "#222326");  // dark
                            $('#playlists li:eq(1)').css("border-right", "solid 2px #84bd00");  // dark
                        }
                    }

                    var img_url = playlists[0].images[0].url;
                    getCoverPic(img_url);

                    var playlists_name = playlists[0].name;
                    getPlaylistName(playlists_name);

                    getTagList(playlists[0].owner.id, playlists[0].id, playlists[0].name);

                    getallTracks(playlists[0].owner.id, playlists[0].id, playlists[0].name);

                    changePlaylist();

                    changeScheme(current_scheme);
                });
            });
        });

		// If user want to search by rate, determine which level user want to search and do search.
		determineLevel();

		// Post tagData to a server-side database.  See 
		// https://github.com/typicode/json-server
		//$.post("http://localhost:3000/demo", {"msg": "accessed at " + now.toISOString()}, null, "json");
	}

	/*
	 * Export startApp to the window so it can be called from the HTML's
	 * onLoad event.
	 */
	exports.startApp = function() {
		console.log('start app.');

		console.log('location = ' + location);

		// Parse the URL to get access token, if there is one.
		var hash = location.hash.replace(/#/g, '');
		var all = hash.split('&');
		var args = {};
		all.forEach(function(keyvalue) {
			var idx = keyvalue.indexOf('=');
			var key = keyvalue.substring(0, idx);
			var val = keyvalue.substring(idx + 1);
			args[key] = val;
		});
		console.log('args', args);

		if (typeof(args['access_token']) == 'undefined') {
			$('#start').click(function() {
				doLogin(function() {});
			});

			$('#login').show();
			$('#loggedin').hide();
		} else {
			g_access_token = args['access_token'];
			loggedIn();
		}
	}

    exports.doit = function() {
        var model = new ListModel();

        var inputView = new ListView(model, "#inputDiv");
    }
    
    exports.iphone = function () {
        var screen_width = $(window).width();
        var screen_height  = $(window).height();

        if ((screen_width < 685) && (screen_width > 360)) {
            $("#tracks").hide();

            $("#playlists_info .rateList").hide();
            $("#playlists_info .tagList").hide();
        } else {
            $(".rateList").hide();
            $(".tagList").hide();

            $("#playlists_info .rateList").show();
            $("#playlists_info .tagList").show();
        }

        $("#menubar #showplaylist").click(function () {
            $("#playlists").show();
            $("#tracks").hide();
        });
    }
})(window);
