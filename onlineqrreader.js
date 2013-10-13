if (Meteor.isClient) {
  Meteor.startup(function () {
    var analytics=analytics||[];(function(){var e=["identify","track","trackLink","trackForm","trackClick","trackSubmit","page","pageview","ab","alias","ready","group"],t=function(e){return function(){analytics.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var n=0;n<e.length;n++)analytics[e[n]]=t(e[n])})(),analytics.load=function(e){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=("https:"===document.location.protocol?"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)};
    analytics.load("xdhpak9s5e");
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
          analytics.track('Upload and send');
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
        analytics.track('Take pic and send');
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

