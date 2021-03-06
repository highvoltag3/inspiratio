/*
 js-mindmap

 Copyright (c) 2008/09/10 Kenneth Kufluk http://kenneth.kufluk.com/

 MIT (X11) license

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

*/

/*
  Things to do:
    - remove Lines - NO - they seem harmless enough!
    - add better "make active" methods
    - remove the "root node" concept.  Tie nodes to elements better, so we can check if a parent element is root

    - allow progressive exploration
    - allow easy supplying of an ajax param for loading new kids and a loader anim
    - allow easy exploration of a ul or ol to find nodes
    - limit to an area
    - allow more content (div instead of an a)
    - test multiple canvases
    - Hidden children should not be bounded
    - Layout children in circles
    - Add/Edit nodes
    - Resize event
    - incorporate widths into the forces, so left boundaries push on right boundaries


  Make demos:
    - amazon explore
    - directgov explore
    - thesaurus
    - themes

*/

(function ($) {
  'use strict';

  var TIMEOUT = 4,  // movement timeout in seconds
    CENTRE_FORCE = 3,  // strength of attraction to the centre by the active node
    Node,
    Line,
    MindmapGlobalOptions;

  // Define all Node related functions.
  Node = function (obj, name, parent, opts) {
    this.obj = obj;
    this.options = obj.options;

    this.name = name;
    //this.href = opts.href;
    this.cssClass = opts['class'];

    if (opts.url) {
      this.url = opts.url;
    }

    // create the element for display
    this.element = $('<div class="' + this.name + '">' + this.name + '</div>').addClass('node ' + this.cssClass);
    $('#bubbleView').prepend(this.element);

    if (!parent) {
      obj.activeNode = this;
      this.element.addClass('active root');
    } else {
      obj.lines[obj.lines.length] = new Line(obj, this, parent);
    }
    this.parent = parent;
    this.children = [];
    if (this.parent) {
      this.parent.children.push(this);
    }

    // animation handling
    this.moving = false;
    this.moveTimer = 0;
    this.obj.movementStopped = false;
    this.visible = true;
    this.x = 1;
    this.y = 1;
    this.dx = 0;
    this.dy = 0;
    this.hasPosition = false;

    this.content = []; // array of content elements to display onclick;

    this.element.css('position', 'absolute');

    var thisnode = this;

    this.element.draggable({
      drag: function () {
        obj.root.animateToStatic();
      }
    });
//// DARIO GOT SORTABLE HERE NOW ;)
//    $( ".labels" ).sortable({
//      revert: true
//    });

// when we get sortable working un-comment the 3 lines in draggable function below


/////////// DARIO GOT DROPPABLE HERE //////////
    var list = [];
    $( "#droppable" ).droppable({
      //connectToSortable: ".labels",
      //helper: "clone",
      //revert: "invalid",
      drop: function( event, ui ) {
        $( this )
          .addClass( "ui-state-highlight" )
          .find(".list")
          .append("<p class='word label label-info " + ui.draggable.text() + "'>" + ui.draggable.text() + "</p>");
          
          $('.' + ui.draggable.text() + '').delay(600).fadeOut('normal', function(){
              $('.labels').prepend("<p class='word label label-info'><span class='term'>" + ui.draggable.text() + "</span><a class='close' data-dismiss='alert'>&#215;</a></p>");
          });

        
        $('#bubblelist_tag_list').val(ui.draggable.text());

        $.ajax({
        type: "POST",
        url: $('.edit_idea').attr('action') + '/save_bubble_list',
        data: { bubblelist : { tag_list : $('#bubblelist_tag_list').val() } },  
        dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
        }).success(function( msg ) {
              //console.log(msg);
              //$(thisobj).html(likes);
          }).error(function(xhr, status, err) {
            //if (xhr.status == 401)
            //console.log("error");
            //console.log(err);
            //console.log(xhr);
          });


        $(this).find("h5").html( "<br /><span class='saved text-success'>Saved!</span> <br />" );
        $('.saved').fadeOut(1200);

        $( ui.draggable ).remove();
      }
    });

    //THIS IS THE CLICK EVENT OF THE NODE (Dario Note)
    this.element.click(function () {
      if (obj.activeNode) {
        obj.activeNode.element.removeClass('active');
        if (obj.activeNode.parent) {
          obj.activeNode.parent.element.removeClass('activeparent');
        }
      }
      if (typeof opts.onclick === 'function') {
        opts.onclick(thisnode);
      }
      obj.activeNode = thisnode;
      obj.activeNode.element.addClass('active');

      if (obj.activeNode.parent) {
        obj.activeNode.parent.element.addClass('activeparent');
      }
      obj.root.animateToStatic();
      return false;
    });

  };

  // ROOT NODE ONLY:  control animation loop
  Node.prototype.animateToStatic = function () {

    clearTimeout(this.moveTimer);
    // stop the movement after a certain time
    var thisnode = this;
    this.moveTimer = setTimeout(function () {
      //stop the movement
      thisnode.obj.movementStopped = true;
    }, TIMEOUT * 1000);

    if (this.moving) {
      return;
    }
    this.moving = true;
    this.obj.movementStopped = false;
    this.animateLoop();
  };

  // ROOT NODE ONLY:  animate all nodes (calls itself recursively)
  Node.prototype.animateLoop = function () {
    var i, len, mynode = this;
    this.obj.canvas.clear();
    for (i = 0, len = this.obj.lines.length; i < len; i++) {
      this.obj.lines[i].updatePosition();
    }
    if (this.findEquilibrium() || this.obj.movementStopped) {
      this.moving = false;
      return;
    }
    setTimeout(function () {
      mynode.animateLoop();
    }, 10);
  };

  // find the right position for this node
  Node.prototype.findEquilibrium = function () {
    var i, len, stable = true;
    stable = this.display() && stable;
    for (i = 0, len = this.children.length; i < len; i++) {
      stable = this.children[i].findEquilibrium() && stable;
    }
    return stable;
  };

  //Display this node, and its children
  Node.prototype.display = function (depth) {
    var parent = this,
      stepAngle,
      angle;

    depth = depth || 0;

    if (this.visible) {
      // if: I'm not active AND my parent's not active AND my children aren't active ...
      if (this.obj.activeNode !== this && this.obj.activeNode !== this.parent && this.obj.activeNode.parent !== this) {
        this.element.hide();
        this.visible = false;
      }
    } else {
      if (this.obj.activeNode === this || this.obj.activeNode === this.parent || this.obj.activeNode.parent === this) {
        this.element.show();
        this.visible = true;
      }
    }
    this.drawn = true;
    // am I positioned?  If not, position me.
    if (!this.hasPosition) {
      this.x = this.options.mapArea.x / 2;
      this.y = this.options.mapArea.y / 2;
      this.element.css({'left': this.x + "px", 'top': this.y + "px"});
      this.hasPosition = true;
    }
    // are my children positioned?  if not, lay out my children around me
    stepAngle = Math.PI * 2 / this.children.length;
    $.each(this.children, function (index) {
      if (!this.hasPosition) {
        if (!this.options.showProgressive || depth <= 1) {
          angle = index * stepAngle;
          this.x = (50 * Math.cos(angle)) + parent.x;
          this.y = (50 * Math.sin(angle)) + parent.y;
          this.hasPosition = true;
          this.element.css({'left': this.x + "px", 'top': this.y + "px"});
        }
      }
    });
    // update my position
    return this.updatePosition();
  };

  // updatePosition returns a boolean stating whether it's been static
  Node.prototype.updatePosition = function () {
    var forces, showx, showy;

    if (this.element.hasClass("ui-draggable-dragging")) {
      this.x = parseInt(this.element.css('left'), 10) + (this.element.width() / 2);
      this.y = parseInt(this.element.css('top'), 10) + (this.element.height() / 2);
      this.dx = 0;
      this.dy = 0;
      return false;
    }

    //apply accelerations
    forces = this.getForceVector();
    this.dx += forces.x * this.options.timeperiod;
    this.dy += forces.y * this.options.timeperiod;

    // damp the forces
    this.dx = this.dx * this.options.damping;
    this.dy = this.dy * this.options.damping;

    //ADD MINIMUM SPEEDS
    if (Math.abs(this.dx) < this.options.minSpeed) {
      this.dx = 0;
    }
    if (Math.abs(this.dy) < this.options.minSpeed) {
      this.dy = 0;
    }
    if (Math.abs(this.dx) + Math.abs(this.dy) === 0) {
      return true;
    }
    //apply velocity vector
    this.x += this.dx * this.options.timeperiod;
    this.y += this.dy * this.options.timeperiod;
    this.x = Math.min(this.options.mapArea.x, Math.max(1, this.x));
    this.y = Math.min(this.options.mapArea.y, Math.max(1, this.y));
    // display
    showx = this.x - (this.element.width() / 2);
    showy = this.y - (this.element.height() / 2) - 10;
    this.element.css({'left': showx + "px", 'top': showy + "px"});
    return false;
  };

  Node.prototype.getForceVector = function () {
    var i, x1, y1, xsign, dist, theta, f,
      xdist, rightdist, bottomdist, otherend,
      fx = 0,
      fy = 0,
      nodes = this.obj.nodes,
      lines = this.obj.lines;

    // Calculate the repulsive force from every other node
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i] === this) {
        continue;
      }
      if (!nodes[i].visible) {
        continue;
      }
      // Repulsive force (coulomb's law)
      x1 = (nodes[i].x - this.x);
      y1 = (nodes[i].y - this.y);
      //adjust for variable node size
//    var nodewidths = (($(nodes[i]).width() + this.element.width())/2);
      dist = Math.sqrt((x1 * x1) + (y1 * y1));
      var myrepulse = this.options.repulse;
      if (this.parent==nodes[i]) myrepulse=myrepulse*100;  //parents stand further away
      if (Math.abs(dist) < 500) {
        if (x1 === 0) {
          theta = Math.PI / 2;
          xsign = 0;
        } else {
          theta = Math.atan(y1 / x1);
          xsign = x1 / Math.abs(x1);
        }
        // force is based on radial distance
        f = (this.options.repulse * 500) / (dist * dist);
        fx += -f * Math.cos(theta) * xsign;
        fy += -f * Math.sin(theta) * xsign;
      }
    }

    // add repulsive force of the "walls"
    //left wall
    xdist = this.x + this.element.width();
    f = (this.options.wallrepulse * 500) / (xdist * xdist);
    fx += Math.min(2, f);
    //right wall
    rightdist = (this.options.mapArea.x - xdist);
    f = -(this.options.wallrepulse * 500) / (rightdist * rightdist);
    fx += Math.max(-2, f);
    //top wall
    f = (this.options.wallrepulse * 500) / (this.y * this.y);
    fy += Math.min(2, f);
    //bottom wall
    bottomdist = (this.options.mapArea.y - this.y);
    f = -(this.options.wallrepulse * 500) / (bottomdist * bottomdist);
    fy += Math.max(-2, f);

    // for each line, of which I'm a part, add an attractive force.
    for (i = 0; i < lines.length; i++) {
      otherend = null;
      if (lines[i].start === this) {
        otherend = lines[i].end;
      } else if (lines[i].end === this) {
        otherend = lines[i].start;
      } else {
        continue;
      }
      // Ignore the pull of hidden nodes
      if (!otherend.visible) {
        continue;
      }
      // Attractive force (hooke's law)
      x1 = (otherend.x - this.x);
      y1 = (otherend.y - this.y);
      dist = Math.sqrt((x1 * x1) + (y1 * y1));
      if (Math.abs(dist) > 0) {
        if (x1 === 0) {
          theta = Math.PI / 2;
          xsign = 0;
        }
        else {
          theta = Math.atan(y1 / x1);
          xsign = x1 / Math.abs(x1);
        }
        // force is based on radial distance
        f = (this.options.attract * dist) / 10000;
        fx += f * Math.cos(theta) * xsign;
        fy += f * Math.sin(theta) * xsign;
      }
    }

    // if I'm active, attract me to the centre of the area
    if (this.obj.activeNode === this) {
      // Attractive force (hooke's law)
      otherend = this.options.mapArea;
      x1 = ((otherend.x / 2) - this.options.centreOffset - this.x);
      y1 = ((otherend.y / 2) - this.y);
      dist = Math.sqrt((x1 * x1) + (y1 * y1));
      if (Math.abs(dist) > 0) {
        if (x1 === 0) {
          theta = Math.PI / 2;
          xsign = 0;
        } else {
          xsign = x1 / Math.abs(x1);
          theta = Math.atan(y1 / x1);
        }
        // force is based on radial distance
        f = (0.1 * this.options.attract * dist * CENTRE_FORCE) / 1000;
        fx += f * Math.cos(theta) * xsign;
        fy += f * Math.sin(theta) * xsign;
      }
    }

    if (Math.abs(fx) > this.options.maxForce) {
      fx = this.options.maxForce * (fx / Math.abs(fx));
    }
    if (Math.abs(fy) > this.options.maxForce) {
      fy = this.options.maxForce * (fy / Math.abs(fy));
    }
    return {
      x: fx,
      y: fy
    };
  };

  Node.prototype.removeNode = function () {
    var i,
      oldnodes = this.obj.nodes,
      oldlines = this.obj.lines;

    for (i = 0; i < this.children.length; i++) {
      this.children[i].removeNode();
    }

    this.obj.nodes = [];
    for (i = 0; i < oldnodes.length; i++) {
      if (oldnodes[i] === this) {
        continue;
      }
      this.obj.nodes.push(oldnodes[i]);
    }

    this.obj.lines = [];
    for (i = 0; i < oldlines.length; i++) {
      if (oldlines[i].start === this) {
        continue;
      } else if (oldlines[i].end === this) {
        continue;
      }
      this.obj.lines.push(oldlines[i]);
    }

    this.element.remove();
  };



  // Define all Line related functions.
  Line = function (obj, startNode, endNode) {
    this.obj = obj;
    this.options = obj.options;
    this.start = startNode;
    this.colour = "blue";
    this.size = "thick";
    this.end = endNode;
  };

  Line.prototype.updatePosition = function () {
    if (!this.options.showSublines && (!this.start.visible || !this.end.visible)) {
      return;
    }
    this.size = (this.start.visible && this.end.visible) ? "thick" : "thin";
    this.color = (this.obj.activeNode.parent === this.start || this.obj.activeNode.parent === this.end) ? "red" : "blue";
    this.strokeStyle = MindmapGlobalOptions.lineColor;

    this.obj.canvas.path("M" + this.start.x + ' ' + this.start.y + "L" + this.end.x + ' ' + this.end.y).attr({'stroke': this.strokeStyle, 'opacity': 0.2, 'stroke-width': '5px'});
  };

  $.fn.addNode = function (parent, name, options) {
    //console.log(this);
    var obj = this[0],
    node = obj.nodes[obj.nodes.length] = new Node(obj, name, parent, options);
    //console.log(obj.root);
    obj.root.animateToStatic();
    return node;
  };

  $.fn.addRootNode = function (name, opts) {
    var node = this[0].nodes[0] = new Node(this[0], name, null, opts);
    this[0].root = node;
    return node;
  };

  $.fn.removeNode = function (name) {
    return this.each(function () {
      if (!!this.mindmapInit) return false;
      //remove a node matching the anme
      alert(name+' removed');
    });
  };

  $.fn.mindmap = function (options) {
    // Define default settings.
    options = $.extend({
      attract: 15,
      repulse: 6,
      damping: 0.55,
      timeperiod: 10,
      wallrepulse: 0.4,
      mapArea: {
        x: -1,
        y: -1
      },
      canvasError: 'alert',
      minSpeed: 0.05,
      maxForce: 0.1,
      showSublines: false,
      updateIterationCount: 20,
      showProgressive: true,
      centreOffset: 100,
      timer: 0,
      lineColor: "#FFF",
      container: ''
    }, options);

    MindmapGlobalOptions = options;

    var $window = $(window);

    return this.each(function () {
      var mindmap = this;

      this.mindmapInit = true;
      this.nodes = [];
      this.lines = [];
      this.activeNode = null;
      this.options = options;
      this.animateToStatic = function () {
        this.root.animateToStatic();
      };
      $window.resize(function () {
        mindmap.animateToStatic();
      });

      //canvas
      if (options.mapArea.x === -1) {
        options.mapArea.x = $('#' + options.container).width();
      }
      if (options.mapArea.y === -1) {
        options.mapArea.y = $('#' + options.container).height();
      }
      if (options.container === '') {
        options.container = document.getElementsByTagName('body');
      }
      //create drawing area
      this.canvas = Raphael(document.getElementById(options.container), 0, 0, options.mapArea.x, options.mapArea.y);
     
      var canvaswidth = $('#' + options.container).width();
      var canvasheight = $('#' + options.container).height();
      $('svg').attr('width', canvaswidth); 
      $('svg').attr('height', canvasheight); 
      // Add a class to the object, so that styles can be applied
      $(this).addClass('js-mindmap-active');

    });
  };
}(jQuery));

/*jslint devel: true, browser: true, continue: true, plusplus: true, indent: 2 */