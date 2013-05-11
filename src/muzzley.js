var myAppToken = 'c1134251b4a9681a';

muzzley.on('error', function(err) {
console.log("Error: " + err);
});

last_key = {};

muzzley.connectApp(myAppToken, function(err, activity) {
    if (err) return console.log("Connect error: " + err);

    // Usually you'll want to show this Activity's QR code image
    // or its id so that muzzley users can join.
    // They are in the `activity.qrCodeUrl` and `activity.activityId`
    // properties respectively.
    console.log(activity);

    activity.on('participantQuit', function(participant) {
      // A participant quit
    });

    activity.on('participantJoin', function(participant) {

      // A participant joined. Tell him to transform into a gamepad.
      participant.changeWidget('gamepad', function (err) {
        if (err) return console.log('changeWidget error: ' + err );
      });
        var elements = [
            "src/entities/ufo.js",
        ];

        //when everything is loaded, run the main scene
        require(elements, function() {
            new Ufo({id: participant.id});
        });

      participant.on('action', function (action) {
        // The action object represents the participant's interaction.
        // In this case it might be "button 'a' was pressed".
        switch (action.e) {
            case "press":
                Crafty.trigger("JostickPress"+this.id, {key: action.v});
                last_key[participant.id] = action.v;
                break;
            case "release":
                Crafty.trigger("JostickRelease"+this.id, {key: last_key[participant.id]});
                break;
        }
      });

      participant.on('quit', function (action) {
        // You can also check for participant quit events
        // directly in each participant object.
      });

    });
});
