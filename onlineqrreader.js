var picURL;
var qrResult;
var emailAddress;
var img;

//START CORS CODE

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
    xhr.responseType = "blob";
    xhr.send(null);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
    xhr.responseType = "blob";
    xhr.send(null);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
//function getTitle(text) {
//  return text.match('<title>(.*)?</title>')[1];
//}


// Make the actual CORS request.
function makeCorsRequest(urlPassed) {
  // All HTML5 Rocks properties support CORS.
  var url = urlPassed;
  console.log("1" + url);
  var xhr = createCORSRequest('GET', url);
  console.log("2" + xhr);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    //var text = xhr.responseText;
    //var title = getTitle(text);

    img = new Image();
    responseURL = URL.createObjectURL(xhr.response);
    console.log(responseURL);
    img.src = responseURL;
    img.onload = function() {
            qrcode.decode(picURL);
            //ctx.drawImage(img, 0, 0);
        }
    console.log("Img: " + img); // + text);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

//END CORS CODE

// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
//if(typeof(console) === 'undefined') {
//    var console = {}
//    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
//};


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

        filepicker.setKey("key");
        filepicker.pick({services: ['COMPUTER','DROPBOX','GMAIL']},function(Pic){
          picURL = Pic.url;
          console.log(picURL);
          analytics.track('Upload pic');
          picURL = makeCorsRequest(picURL); // Attempt at CORS'ing image
          console.log("Post CORS: " + picURL);
          qrcode.decode(picURL); //moved here for test purposes
        });
        qrcode.callback = function(data) {
          qrResult = data;
          Session.set("currentPage", "a_file");
          
        };
        //picURL = makeCorsRequest("https://www.filepicker.io/api/file/iLboRtlJQpafbxpKjTT1");
        //picURL="/qr_code_file.jpg";
        //qrcode.decode(picURL);
      }
    });

  Template.take_picture.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the take picture button"); //TEST
        //filepicker.setKey("key");
        //filepicker.pick({services: ['WEBCAM']},function(Pic){
          //picURL = Pic.url;
          //analytics.track('Take pic');
        //});
        qrcode.callback = function(data) {
          qrResult = data;
          Session.set("currentPage", "a_file");
        };
        picURL="/qr_code_file.jpg";
        qrcode.decode(picURL);
      }
    });

  Template.content_result.getResult = function(){
    return qrResult;
  };

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
    },

    'click #btnfeedback' : function () {
      if (typeof console !== 'undefined')
        feedback = $("input[type=field]").val();
        Meteor.call('sendFeedback', feedback);
        console.log("Feedback!");
        console.log(feedback);
        Session.set("happy", "sent");
    },

    'click #btntestQRURL' : function () {
      if (typeof console !== 'undefined')
        console.log("QR test!");
        qrcode.callback = function(data) {
          console.log(data);
          qrResult = data;
          console.log(qrResult);
        };
        //qrcode.decode("/qr_code_file.jpg");
        qrcode.decode("http://www.sparkplugdigital.com/wp-content/uploads/2011/04/qr_code.jpg");
    },

    'click #btntestQRpicURL' : function () {
      if (typeof console !== 'undefined')
        console.log("QR test!");
        qrcode.callback = function(data) { alert(data); };
        qrcode.decode(picURL);
    },

    'click #btnrestart' : function () {
      if (typeof console !== 'undefined')
        Session.set("happy", "notset");
        Session.set("currentPage", "no_file");
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
    },

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

