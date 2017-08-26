var queue = [];

$(document).on('swipeleft', '.ui-page', function(event){
    if(event.handled !== true) // This will prevent event triggering more then once
    {
        var nextpage = $.mobile.activePage.next('[data-role="page"]');
        // swipe using id of next page if exists
        if (nextpage.length > 0) {
            $.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
        }
        event.handled = true;
    }
    return false;
});
$(document).on('swiperight', '.ui-page', function(event){
    if(event.handled !== true) // This will prevent event triggering more then once
    {
        var prevpage = $(this).prev('[data-role="page"]');
        if (prevpage.length > 0) {
            $.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
        }
        event.handled = true;
    }
    return false;
});

function search(){
  //Get Form input
  $("#homepage-content").html("");
  var q = $(".search-bar").val();
  if(q === null || q === undefined || q=== ""){
    return;
  }else{
    $.get(
      "https://www.googleapis.com/youtube/v3/search",{
          part : 'snippet , id',
          q : q,
          type : 'video',
          key : "AIzaSyCwA8LI3Ps7y76_LWgy7zDUKUwIbKKnpT0",
          maxResults : "10"
        },
          function(data){
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            $.each(data.items,function(i,item){
              var output = getOutput(item);
              $(output).appendTo("#homepage-content").listview();
            });
            if(prevPageToken){
              $("#prev-btn").show();
              $("#prev-btn").attr("prev",prevPageToken);
              $("#prev-btn").attr("q",q);
            }
            if(nextPageToken){
              $("#next-btn").show();
              $("#next-btn").attr("next",nextPageToken);
              $("#next-btn").attr("q",q);
            }
          }
    )
    }
}

function getOutput(item){
  var id = item.id.videoId;
  var title = item.snippet.title;
  var description = item.snippet.description;
  var thumb = item.snippet.thumbnails.high.url;
  var channelTitle = item.snippet.channelTitle;
  var videoDate = item.snippet.publishedAt;

  //Build our output:
  var output =
  '<ul data-role="listview" data-inset="true" id="myList">' +
      '<li data-icon="plus"><a onclick="addSong(this)" class="list" vid="'+id+'"><img src="'+thumb+'" alt="">'+title+'</a></li>' +
  '</ul>';

  return output;
}

function addSong(song){
  var id = $(song).attr("vid");
  //queue.push(id);
  initAudio(id);
}

function initAudio(id){
  try{
        var data = JSON.parse(getSongJson(id));
    }catch(err){
      alert("this song cannot be played");
      window.history.back();
    }
    if(typeof audio !== 'undefined'){
      audio.setAttribute('src',data.link);
      audio.load();
      audio.play();
      $("#play").children("span").attr("class","glyphicon glyphicon-pause");
    } else{
      audio = new Audio(data.link);
      audio.play();
        $("#play").children("span").attr("class","glyphicon glyphicon-pause");
    }

    //$(".total-duration").text(totalDuration(data.length));
    //$("#download").attr("href",data.link);
    //$(".album-title").text(data.title);
    // $( "#slider" ).slider({
    //   range: "min",
    // });
    // $( "#slider" ).slider({
    //   max: data.length
    // });
}
function getSongJson(id){
   return $.ajax({
    url: "https://www.youtubeinmp3.com/fetch/?format=JSON&video=https://www.youtube.com/watch?v=" + id +"",
    dataType: 'json',
    async: false,
    }).responseText;
}

$("#play").click(function(){
  var playStatus =  $("#play").children("span").attr("class");
  if(playStatus === "glyphicon glyphicon-pause"){
    audio.pause();
    $("#play").children("span").attr("class","glyphicon glyphicon-play");
  }else{
    audio.play();
    $("#play").children("span").attr("class","glyphicon glyphicon-pause");
  }
});
