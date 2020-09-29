
$(document).ready(function(){

    $(function(){
    
        $('.owl-prev').hide();
        $(".owl-next").click(function () {
        $('.owl-prev').show();
        });

        // web service JS 
        $(document).on( 'scroll', function(){        
            if ($(window).scrollTop() > 100) {
            $('.scroll-top-wrapper').addClass('show');
            }
        });
        $("#webservice").click(function () {
        $('#qnimate').addClass('popup-box-on');
        $('#webservice').addClass('d-none');
        $('#webservice_close').removeClass();
        });
        $("#webservice_close").click(function () {
        $('#qnimate').removeClass('popup-box-on');
        $('#webservice_close').addClass('d-none');
        $('#webservice').removeClass();
        });

    });
        
    $('#registeredSelectPhoneState').editableSelect({ 
        appendTo: '.modal-body',
        effects: 'slide'
    });
});

    
// owl-carousel JS
    $('.owl-carousel').owlCarousel({
        loop:true,
        nav:true,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:5
            },
            1000:{
                items:9
            }
        }
    })


// Swiper JS 
    var swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 10,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    });
