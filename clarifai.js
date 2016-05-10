//sample urls
var urls = ["http://sodiegotours.com/new/wp-content/uploads/2014/03/bigstock-Young-people-eating-in-a-Thai-36375130.jpg", 
"http://previews.123rf.com/images/gstockstudio/gstockstudio1505/gstockstudio150500036/39501428-Time-for-pizza-Four-young-cheerful-people-eating-pizza-and-drinking-beer-while-sitting-at-the-bean-b-Stock-Photo.jpg",
"http://bequjuice.com/blog/wp-content/uploads/2012/07/Girl-Eating-Chocolate.jpg",
"http://www.vitatious.com/endorse/wp-content/uploads/2016/05/Reduce-childhood-obesity-by-replacing-junk-food-with-organic-alternatives1.jpg",
"http://topnews.ae/images/Fast-Food-Elderly-People.jpg"];

//var urls = ["http://sodiegotours.com/new/wp-content/uploads/2014/03/bigstock-Young-people-eating-in-a-Thai-36375130.jpg"]; 
var mood = "enjoyment";
var tagstring = [urls.length];
//var counter = 0;

//credentials for accessing Clarifai server
function getCredentials(cb) {
  console.log("inside getCredentials");
  var data = {
    'grant_type': 'client_credentials',
    'client_id': 'YOUR_ID',
    'client_secret': 'YOUR_SECRET'
  };

  return $.ajax({
    'url': 'https://api.clarifai.com/v1/token',
    'data': data,
    'type': 'POST'
  })
  .then(function(r) {
    console.log('setting token time');
    console.log(Math.floor(Date.now() / 1000));
    localStorage.setItem('accessToken', r.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    console.log("set credentials locally");
    cb();

  });
}
//takes the data returned from the url and calls parseResponse to get the tags from the data
function postImage(imgurl) {
  var data = {
    'url': imgurl
  };
  var accessToken = localStorage.getItem('accessToken');

  console.log(data);
  console.log(accessToken);
  return $.ajax({
    'url': 'https://api.clarifai.com/v1/tag',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'data': data,
    'type': 'POST'
  }).then(function(r){
    console.log(r);
    parseResponse(r);
  });
}
//retrieves the tags of the images and if they have tags corresponding to the emotions then they post the image and their respective tags to the web page
function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
    var image = results[0].url;
  } else {
    console.log('Sorry, something is wrong.');
  }

//var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
//img.attr('src', image);
//img.appendTo('#tags');
  if (tags.indexOf(mood)!=-1){
    console.log(image);
    $('#tags').append('<div><img style="width:200px" src="' + image + '"/><div>' + tags.toString().replace(/,/g, ', ') + '</div></div>')
  }
//$('#tags').prepend('<img src="' + image + '"/>')
//$('#tags').text($('#tags').text() + $('#tags').append("<br >") + tags.toString().replace(/,/g, ', ') + $('#tags').append("<img src="+image+" />"));

//counter +=1;
  return tags;
}
//takes in an emotion and then calls postImage to get the tags of the images from the sample urls
function run(emotion) {
  console.log(emotion);
  mood = emotion;
  for( i = 0; i < urls.length; i++ ) {
    var imgurl = urls[i];
    console.log('got time');
    console.log(localStorage.getItem('tokenTimeStamp'));

  //  || localStorage.getItem('accessToken') === 'your_token'
  //if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400) {
  //  getCredentials(function() {
  //    console.log(urls[i]);
  //    postImage(imgurl);
  //  });
  //} else {
    postImage(imgurl);
  //}
  }
}
//not used
// function finalstr(tagstring){
//   var all="";
//   for( i = 0; i < urls.length; i++ ) {
//     all.concat[tagstring[i]];
//   }
//   return all;
// }



