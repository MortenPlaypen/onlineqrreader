if (Meteor.isClient) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Template.upload.greeting = function () {
    return "Welcome to onlineqrreader.";
  };

  Template.upload.events({
    'click input' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the upload button");
        var key = "AVBBdW4z9R3ybh8LG1XPcz";
        console.log(key);
        filepicker.setKey("key");
        filepicker.pick(function(InkBlob){
          console.log(InkBlob.url);
          Meteor.call('sendEmail', 'lundsby@gmail.com','lundsby@gmail.com','QR Code Uploaded',InkBlob.url);
        });
    }
  });

  Template.take_picture.greeting = function () {
  return "Welcome to onlineqrreader.";
  };

  Template.take_picture.events({
    'click input' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the take picture button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });

  Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
    console.log("Email sent to " + to);
  }
});
}

