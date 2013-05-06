// load the mindmap
$(document).ready(function() {
  
  // launch the mindmap
  $('#bubbleView').mindmap({
    damping: 0.5,
    wallrepulse: 1,
    container: 'bubbleView',
    lineColor: "#ccc",
    repulse: 8
  });


  keywords = $('.hiddentags').val();
  var searchKeywords = [];
  searchKeywords = keywords.split(' ');

  //create array to hold the results when searching for each keyword
  var wordsresults = [];


  var root = $('#bubbleView').get(0).mynode = $('#bubbleView').addRootNode($('.inv_idea_title').text(),{});

  if ( typeof(parentnode) === 'undefined') {
    var parentnode = root; 
  } else {
    var parentnode = parentnode.mynode;
  }


  //search each keyword for related words.
  $.each(searchKeywords, function(index, value) {
    wordtolookup = value;
    
    $.ajax({
      url: 'http://api.wordnik.com/v4/word.json/' + wordtolookup + '/relatedWords?api_key=e22c18406c64c389fe4000964950f380a3474965ab180be08&useCanonical=true&relationshipTypes=same-context&limitPerRelationshipType=3',
      dataType : 'json',
      success: function(data) {
        //called when successful
        //console.log(data);
        wordsresults = data[0].words;
        //console.log(wordsresults);

        //check if wordtolookup exist in array if so remove it.
       //console.log( wordsresults);
       //console.log( wordsresults.splice($.inArray(wordtolookup, wordsresults),1) );
        addNodeWordnik(wordsresults, wordtolookup);
      },
      error: function(e) {
        //called when there is an error
        //console.log(e.message);
      }
    });

  });
                

  function addNodeWordnik(wordsresults, wordtolookup) {
      
    //populate second level sub-childs
    $.each(wordsresults, function(index, value) {
      this.mynode = $('#bubbleView').addNode(parentnode, value, {});

    });
  };

            //console.log(searchKeywords);


});   