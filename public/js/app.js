// var $ = require("../../dev/js/jquery-2.2.3.js");

function getComments($card,$topLayer){
    var _id = $card.attr('data-id');
    $.ajax({
        method : 'GET',
        url : '/api/review/' + _id,
        success : function (data) {
            console.log(data);
            var str = '';
            data.comments.forEach(function (curr,index) {
                str += '<div class="user"> <h5>'+curr.by+ '</h5>'+ '<p>' + curr.comment + '</p></div>';
            });
            $topLayer.find('.comments').html(str);
        }

    });
}
function makeComment ($card,$topLayer){
    var _id = $card.attr('data-id');
    var user = $('body').attr('data-name');
    console.log(user,'this is by');
    $.ajax({
        method :'POST',
        url : '/api/review/'+_id,
        data : {
            user : user,
            comment : $('#comm').val()
        },
        success : function (data){
            console.log(data);
            var str = '';
            data.comments.forEach(function (curr,index) {
                str += '<div class="user"> <h5>'+curr.by+ '</h5>'+ '<p>' + curr.comment + '</p></div>';
            });
            $topLayer.find('.comments').html(str).fadeIn(300);
        }
        });
}

$('document').ready(function () {

    function Cards(elem){
        this.elem = elem;
    }
    Cards.prototype.expand = function () {
        this.elem.on('click','.card-item',function (e) {
            var cardId = $(this).attr('data-id');
            console.log(cardId,"sddgg");
            var $card = $(this);
            e.preventDefault();
            var $overlay =$('.overlay');
            console.log($overlay);
            var $topLayer = $('.top-layer');
            $overlay.find('.overlay-close').on('click',function (e) {
               $topLayer.css('min-height','0%');
               $overlay.css('width','0%');
            });
            $overlay.css('width','100%');
            $topLayer.css('min-height','100%');
            $topLayer.find('img')
                .attr('src',$(this).find('img').attr('src'))
                .hover(function (e) {
                    console.log('dff');
                $topLayer.find('.likes').fadeIn(200);
                console.log('gfd');
            },function (e) {
                $topLayer.find('.likes').fadeOut(200);
            });
              $topLayer.on('click',function (e) {
                    console.log('click');
                   $topLayer.find('.likes >i').addClass('red');
                });
            var $like = $topLayer.find('#likes-count span');
            var likes = $(this).attr('data-likes') || 0;
            $like.html(likes + ' Likes');
            function makeAjaxTolikes() {
                $.ajax({
                    method : 'GET',
                    url : '/likes/'+cardId,
                    success : function (data){
                        console.log(data);
                        if (!data.likes)
                            data.likes = 0;
                        console.log(data.likes);
                        $like.html(data.likes + ' Likes');
                        $card.attr('data-likes',data.likes);

                    }
                })
            }

            $topLayer.find('.liker').on('click',function (e) {
                makeAjaxTolikes();
            });
            getComments($card,$topLayer);
            $('#comm-click').on('click',function () {
                makeComment($card, $topLayer);
            });
        });

    };
    Cards.prototype.hover = function () {
        this.elem.find('.card-item').hover(function (e) {
            $(this).find('.likes').fadeIn(200);
            console.log('gfd');
        },function (e) {
            $(this).find('.likes').fadeOut(200);
        });
    };
    Cards.prototype.toggleLikes = function () {

    };
    var $cards = new Cards($('.cards'));
    $cards.hover();
    $cards.expand();
    $cards.elem.masonry({
        itemSelector: '.card-item',
        // use element for option
        columnWidth: '.card-item',
        percentPosition: true,
        gutter: 10
    });

    $cards.elem.imagesLoaded()
        .always( function( instance ) {
            console.log('all images loaded');
        })
        .done( function( instance ) {
            console.log('all images successfully loaded');
        })
        .fail( function() {
            console.log('all images loaded, at least one is broken');
        })
        .progress( function( instance, image ) {
            var result = image.isLoaded ? 'loaded' : 'broken';
            $cards.elem.masonry('layout');
            console.log( 'image is ' + result + ' for ' + image.img.src);
        });
});