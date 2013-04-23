// load the mindmap
$(document).ready(function() {
  
  // launch the mindmap
  $('#bubbleView').mindmap({
    damping: 0.5,
    wallrepulse: 1,
    container: 'bubbleView',
    lineColor: "#ccc",
    showProgressive: false,
    repulse: 8
  });


            keywords = $('.hiddentags').val();
            var searchKeywords = [];
            searchKeywords = keywords.split(' ');

            var wordsresults = [];

            var newdata = {};
            
            var ran = false;

            $.each(searchKeywords, function(index, value) {
              wordtolookup = value;
              
              var root = $('section h2').get(0).mynode = $('#bubbleView').addRootNode($('.inv_idea_title').text(),{});
              
              if ( typeof(parentnode) === 'undefined') {
                parentnode = root; 
              } else {
                parentnode = parentnode.mynode;
              }
              this.mynode = $('#bubbleView').addNode(parentnode, wordtolookup, {});

              $.ajax({
                url: 'http://api.wordnik.com/v4/word.json/' + wordtolookup + '/relatedWords?api_key=e22c18406c64c389fe4000964950f380a3474965ab180be08&useCanonical=true&relationshipTypes=same-context&limitPerRelationshipType=10',
                dataType : 'json',
                success: function(data) {
                  //called when successful
                  //console.log(data);
                  wordsresults = data[0].words;
                  console.log(wordsresults);
                  //makenodes(wordsresults, wordtolookup);
                  addNodeWordnik(wordsresults, wordtolookup);
                },
                error: function(e) {
                  //called when there is an error
                  console.log(e.message);
                }
              });

            });
                

  function addNodeWordnik(wordsresults, wordtolookup) {
      
      //populate second level sub-childs
      $.each(wordsresults, function(index, value) {
        this.mynode = $('#bubbleView').addNode(parentnode, value, {});

      });
  };

            console.log(searchKeywords);


});   