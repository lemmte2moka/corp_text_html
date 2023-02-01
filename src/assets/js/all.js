$(window).scroll(function () {
  var scroll = $(window).scrollTop();

  if (window.matchMedia("(max-width: 767px)").matches) {
    if (scroll < 800) {
      $(".js-cart-button-fixed").fadeOut();
    } else {
      $(".js-cart-button-fixed").fadeIn();
    }
  }
});

$(".js-favorite-button").on("touch click", function () {
  $(this).toggleClass("is-favorite");
});