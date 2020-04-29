
// Set fixed elements that need padding-right when locking the scroll
window.paddingRightItems = '#page-header';


var bodyScrollOptions = {
    reserveScrollBarGap: true
};

function openModal(hrefModal) {

    if ($(hrefModal).length > 0){
        $(hrefModal).trigger('beforeOpenModal').fadeIn(300).trigger('afterOpenModal');

        bodyScrollLock.clearAllBodyScrollLocks();
        bodyScrollLock.disableBodyScroll(hrefModal, bodyScrollOptions);
    }

}

function closeModals() {
	$('.popup-block:not(:hidden)').trigger('beforeCloseModal').fadeOut(200, function() {
        bodyScrollLock.clearAllBodyScrollLocks();
    }).trigger('afterCloseModal');
}


$(document.body).on('click','[data-toggle="switch-modal"]',function(e) {
	e.preventDefault();

	var hrefModal = $(this).attr('data-target');

	$('.popup-block:not(:hidden)').fadeOut(200);

	$(hrefModal).fadeIn(200);

	bodyScrollLock.disableBodyScroll(hrefModal, bodyScrollOptions);

});

// Basic open modal
$(document.body).on('click','[data-toggle="modal"]',function(e) {
	e.preventDefault();

	var hrefModal = $(this).attr('data-target');

	openModal(hrefModal);
});

// Close modals if clicked on popup overlay
$(document.body).on('click','.popup-block__overlay',function(e) {
	var closeButton = $(this).children('[data-toggle="modal-dismiss"]');

	if (!(e.target != this)) {
		closeModals();
	}
});


$(document.body).on('click','[data-toggle="modal-dismiss"]',function(e) {
	e.preventDefault();

	closeModals();
});

$(document).off('cut copy paste', '.no-paste').on('cut copy paste', '.no-paste', function(e) {
	e.preventDefault();
});

$('[data-toggle="scroll-to-top"]').click(function(e) {
	e.preventDefault();

	$('html,body').animate({
		scrollTop: 0
	}, 600);
});

$('[data-toggle="anchor"]').click(function(e) {
	e.preventDefault();

	var dataTarget = $(this).attr('data-target'),
		targetPos = $(dataTarget).offset().top - 150;

	$('html,body').animate({
		scrollTop: targetPos
	}, 400);
});

$('[data-toggle="tab"]').click(function(e) {
	e.preventDefault();

	var dataTarget = $(this).attr('data-target');

	if ($(this).parent().is('li')) {
		$(this).parent().addClass('active').siblings().removeClass('active');
	} else {
		$(this).addClass('active').siblings().removeClass('active');
	}

	$(dataTarget).addClass('active').siblings().removeClass('active');
});

$('input[type="number"]').on('keydown', function(e){
	-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||(/65|67|86|88/.test(e.keyCode)&&(e.ctrlKey===true||e.metaKey===true))&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault();
});

// Form Validation
$.extend($.validator.messages, {
    required: "Это поле обязательное",
    email: "Введите правильный формат E-mail",
    url: "Введите правильный формат URL",
    date: "Введите правильный формат даты",
    number: "Введите цифры",
    digits: "Введите цифры",
    creditcard: "Введите правильную кредитную карточку",
    equalTo: "Поля должны соответствовать",
    maxlength: jQuery.validator.format("Максимальная длина - {0} знаков"),
    minlength: jQuery.validator.format("Минимальная длина - {0} знаков"),
    rangelength: jQuery.validator.format("Длина должна быть между {0} и {1} знаками"),
    range: jQuery.validator.format("Введите цифру между {0} и {1}"),
    max: jQuery.validator.format("Максимальное допустимое значение - {0}."),
    min: jQuery.validator.format("Минимально допустимое значение - {0}.")
});

$.validator.methods.email = function(value, element) {
	return this.optional( element ) || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test( value );
}

$.validator.addMethod('lettersonly', function(value, element) {
	return this.optional(element) || /^[a-z]+$/i.test(value);
}, 'Вы можете ввести только буквы');


$.validator.methods.number = function (value, element) {
	return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
};

$.validator.methods.range = function (value, element, param) {
    var globalizedValue = value.replace(",", ".");
    return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
};

$.validator.methods.min = function(value, element, param) {
    value = value.replace(",", ".");
    return this.optional(element) || value >= param;
};

$.validator.methods.max = function(value, element, param) {
    value = value.replace(",", ".");
    return this.optional(element) || value <= param;
};

$(document).ready(function() {

    $(".form-validate").each(function() {
        $(this).validate({
			validateDelegate: function() { },
            onsubmit: true,
			errorElement: "div",
			errorPlacement: function (error, element) {
				error.addClass('invalid-feedback');

				var elementType = element.prop('type');

				switch(elementType) {
					case 'select-one':
						error.appendTo(element.parent());
						break;

					case 'checkbox':
						error.insertAfter(element.parent());
						break;

					case 'radio':
						error.insertAfter(element.parent());

						break;

					default:
						error.insertAfter(element);

						break;

				}

			},
			highlight: function (element, errorClass, validClass ) {
				$(element).addClass("is-invalid").parent().addClass("is-invalid");
			},
			unhighlight: function (element, errorClass, validClass) {
				$(element).removeClass("is-invalid").parent().removeClass("is-invalid");
			},
			focusInvalid: false,
			invalidHandler: function(form, validator) {

				if (!validator.numberOfInvalids())
					return;

				var scrollToElement = $(validator.errorList[0].element);

				if ($(scrollToElement).prop('type') === 'select-one' || $(scrollToElement).prop('type') === 'radio' || $(scrollToElement).prop('type') === 'checkbox') {
					scrollToElement = $(scrollToElement).parent();
				}

				if ($(scrollToElement).parents('.popup-block').length > 0) {
					var thisModal = $(this).parents('.popup-block');

					var scrollTopValue = $(thisModal).scrollTop() + $(scrollToElement).offset().top - 120;

					$(thisModal).animate({
						scrollTop: scrollTopValue
					}, 400);

				} else {
					var scrollTopValue = $(scrollToElement).offset().top - 120;

					$('html, body').animate({
						scrollTop: scrollTopValue
					}, 400);
				}

			},
			ignore: '.tab-pane:hidden *, :disabled, .no-validate'
		});

		setTimeout(function() {
		   $(this).find('.num-input').each(function() {
				$(this).rules('add', {
					required: true,
					number: true
				});
			});

			$(this).find('[type="email"]').each(function() {
				$(this).rules('add', {
					required: true,
					email: true
				});
			});
		}, 0);
	});

});


// меню в шапке открытие на мобильном
$('.page-header__menu-toggle').on('click', function (e) {
	e.preventDefault();
	$(this).toggleClass('page-header__menu-close');
	$('.page-header__nav').toggleClass('active');
});

// slider на главной
$('.first-block__slider').slick({
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: true,
	prevArrow: '<a href="javascript:;" class="first-block__arrow prev"><i class="icon-arrow"></i></a>',
	nextArrow: '<a href="javascript:;" class="first-block__arrow next"><i class="icon-arrow"></i></a>',
	dots: true
});

// Бегущая строка
// $('.marquee').marquee({
//   duration: 7500,
//   gap: 50,
//   delayBeforeStart: 0,
//   direction: 'left',
//   duplicated: true,
// 	startVisible: true
// });

// Поиск открытие
$('.page-header__search').on('click', function (e) {
	$('.page-main__header').hide();
	$('.page-main__search-input-container').addClass('active');
	$('.page-main__search-input').focus();
});

$('.page-main__search-input-close').on('click', function (e) {
	$('.page-main__header').show();
	$('.page-main__search-input-container').removeClass('active');
});

// slider на странице товара основной
$('.page-card__slider-main').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots: false,
	responsive: [
		{
			breakpoint: 576,
			settings: {
				dots: true
			}
		}
	]
});

// slider на странице товара маленький
// $('.page-card__slider-preview').slick({
// 	vertical: true,
// 	verticalSwiping: true,
// 	slidesToShow: 4,
// 	slidesToScroll: 1,
// 	arrows: true,
// 	prevArrow: $(''),
// 	nextArrow: $('.page-card__slider-arrow'),
// 	dots: false
// });

// увеличение картинки по наведению
$(document).ready(function(){
	if ($(window).width() > 1199) {
		$('.page-card__img-zoom').zoom();
	}
});

// переключение картинок по клику по маленькому слайдеру
$('.page-card__preview-slide').on('click', function (e) {
	var index = (parseInt($(this).index()) - 4);
	// console.log(index);
	$('.page-card__slider-main').slick('slickGoTo', index);
});

// попап в корзину
$('.page-card__buy-btn').on('click', function (e) {
	$('.popup-in-cart').show();
});

$('.popup-in-cart__button').on('click', function (e) {
	closeModals();
});

// добавление класса инпуту not-empty когда в инпуте вписано что-то
$('input, textarea').each(function(e) {
	if ($(this).val() != '') {
		$(this).addClass('not-empty').parent().addClass('not-empty');
	} else {
		$(this).removeClass('not-empty').parent().removeClass('not-empty');
	}
});

$(document).off('change focusout keydown keypress input', 'input, textarea').on('change focusout keydown keypress input', 'input, textarea', function(e) {
	if ($(this).val() != '') {
		$(this).addClass('not-empty').parent().addClass('not-empty');
	} else {
		$(this).removeClass('not-empty').parent().removeClass('not-empty');
	}
});

$(document).off('focusin', 'input, textarea').on('focusin', 'input, textarea', function(e) {
	$(this).parent().addClass('focused');
});

$(document).off('focusout', 'input, textarea').on('focusout', 'input, textarea', function(e) {
	$(this).parent().removeClass('focused');
});

$(document).off('keypress keyup blur', '.only-digits').on('keypress keyup blur', '.only-digits', function(event) {
	$(this).val($(this).val().replace(/[^0-9]/g, ''));

	if ((event.which < 48 || event.which > 57)) {
		event.preventDefault();
	}
});

$(document).off('keypress keyup blur', '.only-floats').on('keypress keyup blur', '.only-floats', function(event) {
	$(this).val($(this).val().replace(/[^0-9\,.]/g, ''));

	if ((($(this).val().indexOf('.') != -1 || $(this).val().indexOf(',') != -1)) && (event.which < 48 || event.which > 57)) {
		event.preventDefault();
	}
});


// переключение табов Выбор доставки на странице Оформления заказа
$(".page-checkout__shipping").on("click", "button:not(.active)", function() {
	$(this)
		.addClass("active")
		.siblings()
		.removeClass("active")
		.closest("div.page-checkout__content")
		.find("div.page-checkout__country")
		.removeClass("active")
		.eq($(this).index())
		.addClass("active");
});

// способа доставки
$(".page-checkout__radio-new-post").on("click", function() {
	$('.page-checkout__input-courier').removeClass("active");
	$('.page-checkout__input-new-post').addClass("active");
});

$(".page-checkout__radio-courier").on("click", function() {
	$('.page-checkout__input-new-post').removeClass("active");
	$('.page-checkout__input-courier').addClass("active");
});

//
if ($('.products-grid-index').length > 0) {
	(function ($) {
		var didScroll;
		var lastScrollTop = 0;
		var delta = 5;
		var navbarHeight = $('.products-grid-index').offset().top;

		$(window).on('scroll load', function () {
			var minimalHeight = 160;
			if (document.scrollingElement.scrollTop > minimalHeight) {
				$('body').addClass("scrolled");
			} else if (document.scrollingElement.scrollTop <= minimalHeight) {
				$('body').removeClass("scrolled");
			}
		});

		$(window).scroll(function (event) {
			didScroll = true;
		});

		setInterval(function () {
			if (didScroll) {
				hasScrolled();
				didScroll = false;
			}
		}, 0);

		function hasScrolled() {
			var st = $(this).scrollTop();
			if (Math.abs(lastScrollTop - st) <= delta)
				return;
			if (st > lastScrollTop && st > navbarHeight) {
				// Scroll Down
				$('.nav-main').addClass('js-nav-main-out');
			} else {
				// Scroll Up
				if (st + $(window).height() < $(document).height()) {
					$('.nav-main').removeClass('js-nav-main-out');
				}
			}
			lastScrollTop = st;
		}
	})($);
}


// Увеличение - уменьшение товара на странице Карточка товара. Количество товара.
$(document).on('click','[data-count-button]',function(e) {
	e.preventDefault();

	var thisHref = $(this).parent().find('input'),
		thisHrefValue = parseInt($(thisHref).val());

	var thisHrefMin = parseInt($(thisHref).attr('min')),
		thisHrefMax = parseInt($(thisHref).attr('max'));

	if ($(this).hasClass('plus')) {
		if (thisHrefValue < thisHrefMax) {
			$(thisHref).val(thisHrefValue + 1).trigger('change');
		}
		$(this).parent().find('.disabled').removeClass('disabled');
	} else {
		if (thisHrefValue > thisHrefMin) {
			$(thisHref).val(thisHrefValue - 1).trigger('change');
		}

		if (thisHrefValue == 2) {
			$(this).parent().find('.minus').addClass('disabled');
		}
	}
});
