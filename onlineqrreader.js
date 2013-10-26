// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
//if(typeof(console) === 'undefined') {
//    var console = {}
//    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
//};

var picURL;
var emailAddress;

if (Meteor.isClient) {

  Meteor.startup(function () {
    var analytics=analytics||[];(function(){var e=["identify","track","trackLink","trackForm","trackClick","trackSubmit","page","pageview","ab","alias","ready","group"],t=function(e){return function(){analytics.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var n=0;n<e.length;n++)analytics[e[n]]=t(e[n])})(),analytics.load=function(e){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=("https:"===document.location.protocol?"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)};
    analytics.load("xdhpak9s5e");
    key = "AVBBdW4z9R3ybh8LG1XPcz"; // Filepicker token
    Session.set("currentPage", "no_file");
    Session.set("happy", "notset");
  });

  Template.upload.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the upload button"); //TEST
        filepicker.setKey("key");
        filepicker.pick({services: ['COMPUTER','DROPBOX','GMAIL']},function(Pic){
          picURL = Pic.url;
          //picURL = "https://www.filepicker.io/api/file/LxqFMcvTSCanIn1gIZZx"; //TEST - force file
          console.log("picURL from upload is: " + picURL); //TEST
          analytics.track('Upload pic');
          Session.set("currentPage", "a_file");
        });
    }
  });

  Template.take_picture.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the take picture button"); //TEST
        filepicker.setKey("key");
        filepicker.pick({services: ['WEBCAM']},function(Pic){
          picURL = Pic.url;
          //picURL = "https://www.filepicker.io/api/file/LxqFMcvTSCanIn1gIZZx"; //TEST - force file
          console.log("picURL from take pic is: " + picURL); //TEST
          analytics.track('Take pic');
          Session.set("currentPage", "a_file");
        });
      }
  });

  Template.show_image.getImage = function(){
    return picURL;
  };

  Template.submit_qr.events({
    'click #btnsendcode' : function () {
      if (typeof console !== 'undefined')
        emailAddress = $("input[type=text]").val();
        Meteor.call('translateQR', picURL, emailAddress); //calls translate function
        console.log("You pressed the submit button"); //TEST
        console.log("Submit: " + picURL); //TEST
        console.log("Email: " + emailAddress); //TEST
        analytics.track('Submitted QR');
        Session.set("currentPage", "sent_file");
    }
  });

  Template.content_result.events({
    'click #btnhappy' : function () {
      if (typeof console !== 'undefined')
        Session.set("happy", "yes");
        console.log("Happy!");
    },
    'click #btnnothappy' : function () {
      if (typeof console !== 'undefined')
        Session.set("happy", "no");
        console.log("Not happy!");
    }
  });

  Template.content_result.events({
    'click #btnfeedback' : function () {
      if (typeof console !== 'undefined')
        feedback = $("input[type=field]").val();
        Meteor.call('sendFeedback', feedback);
        console.log("Feedback!");
        console.log(feedback);
        Session.set("happy", "sent");
    }
  });

  Template.content_upload.helpers({
  currentPage: function (type) {
    var thePage = Session.get("currentPage");
    return thePage === type;
  }
  });

  Template.content_result.helpers({
  currentPage: function (type) {
    var thePage = Session.get("currentPage");
    return thePage === type;
  }
  });

  Template.content_result.helpers({
  happy: function (type) {
    var theState = Session.get("happy");
    return theState === type;
  }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });

  Meteor.methods({
    translateQR: function (picURL, emailAddress) {
      check([picURL, emailAddress], [String]);
      this.unblock();

      Email.send({
        to: 'lundsby@gmail.com',
        from: 'lundsby@gmail.com',
        subject: 'QR code to translate - auto',
        text: picURL + "\n" + emailAddress,
      });
      console.log("Email sent");
    },

    sendFeedback: function (feedback) {
      check([feedback], [String]);
      this.unblock();

      Email.send({
        to: 'lundsby@gmail.com',
        from: 'lundsby@gmail.com',
        subject: 'QR Reader Feedback',
        text: feedback,
      })
      console.log("Feedback sent");
    }
  });
}

