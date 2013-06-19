var myPages = ['about', 'projects', 'blog', 'tweeting', 'reading'];

// initial hooks and main calls
$(document).ready(function(){
  
  // initial load functions
  initPanelOnLoad();
  rotateAtomOnLoad();
  
  //adjust slide container on window resize
  $(window).resize( handleWindowResize );
  handleWindowResize();
  
  // handle fancy nav clicks
  handleNavClicks();
  
  // handle pop state!
  handlePopState();
  
  $('#atom').on('click', function(){loadPanel('about')});
  
});


// when page loads, display correct panel and push state to history
function initPanelOnLoad(){
  var panel = location.pathname.slice(1,100).replace(/\//g,'');
  var anchor = location.hash.slice(1,100);
  history.replaceState({panel:panel, anchor:anchor}, '');
  displayPanel( panel, anchor );
}


// rotate atom slightly on page load
function rotateAtomOnLoad(){
  $(window).load(function(){
    setTimeout(function(){
      $('#atom').addClass('rotate');
    }, 300);
  });
}


// resize panel to fit screen width
function handleWindowResize(){

  // always dynamically resize right frame unless we're mobile
  if ( !$('body').hasClass('mobile') ){
    $('#maincol').css('width', $('body').width() - $('#leftcol').width() );
  }
  
  // switch into mobile
  if ( $(window).width() < 750 && !$('body').hasClass('mobile') ){
    $('body').addClass('mobile');
    $('#maincol').css('width', '100%');
    $('#leftcol').css('minHeight', '130px');
  }
  
  // switch out of mobile
  if ( $(window).width() >= 750 && $('body').hasClass('mobile') ){
    $('body').removeClass('mobile');
    var h = 190 + $('#leftcol .info.active').height();
    $('#leftcol').css('minHeight', h+'px');
  }
}


// what to do when a nav link is clicked
function handleNavClicks(){
  $('body').on('click', '.nav', function(e){  
    e.preventDefault();

    // spin the atom
    if ( !$('#atom').hasClass('instant') && !$('#atom').hasClass('extra') ){
      $('#atom').addClass('extra');
      setTimeout(function(){ $('#atom').addClass('instant').removeClass('extra') }, 1000);
      setTimeout(function(){ $('#atom').removeClass('instant')}, 1100);
    }
    
    // get new address
    var new_addr = $(this).attr('href') || $(this).attr('alt');
    
    // just hard redirect if browser does not support pushstate
    if (typeof history.pushState === "undefined") {
      location.href = new_addr;
      return;
    }
    
    // otherwise extract panel and anchor from url
    new_addr = new_addr.replace(/\//g,'');
    new_addr = new_addr.split('#');
    var panel = new_addr[0] || 'about';
    var anchor = new_addr[1];
   
    // and load
    loadPanel( panel, anchor);
    
  });
}


// pushstate and ajax pull new panel
function loadPanel( panel, anchor ){
  
  // update history
  pushState( panel, anchor );

  // check if we have already loaded this panel
  if ( $('#'+panel).length !== 0 ){
    return displayPanel( panel, anchor );
  }

  //otherwise load asynchronously
  $('.panel').hide();
  $('#loading').show();
  
  $.get('/ajax/'+panel, function(data){ 
    $(data).hide().appendTo("#panel-wrapper"); 
    displayPanel( panel, anchor );  
  });

}


// display the given panel and anchor
// (assumes they are already loaded)
function displayPanel( panel, anchor ){

  // swap out panels
  $('.panel, #leftcol .info').hide();
  $('#'+panel).show();
  $('#leftcol .info.'+panel).show();
  
  // update nav links
  $('nav span.active').removeClass('active');
  $('nav #lnk_' + panel).addClass('active');
  
  //resize if necessary
  handleWindowResize();
  
  // scroll to anchor
  if (anchor){
    document.getElementById(anchor).scrollIntoView(true);
  }
}


// push panel and anchor to url + history
function pushState( panel, anchor ){
  var new_addr =  '/' + panel;
  if (anchor){ new_addr += '/#' + anchor; }
  history.pushState({panel:panel, anchor:anchor}, null, new_addr);
}


// restore panels from history state
function handlePopState(){
  $(window).bind('popstate', function(event) {
      var state = event.originalEvent.state;
      console.log(state);
      if (state) {
          displayPanel(state.panel, state.anchor);
      }
  });
}