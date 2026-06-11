$(document).ready(function() {
	$('.mask').each(function() {
		IMask(this, {
			mask: '+7 000 00-00-00',
			lazy: true
		})
	})

	const $button = $('.down-up')
	const bottomOffset = 20

	$button.on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 600)
	})

	$(window).on('scroll resize', function() {
		const scrollTop = $(window).scrollTop()
		const windowHeight = $(window).height()
		const windowWidth = $(window).width()
		let footerTop

		if (windowWidth < 991) {
			footerTop = $('footer').offset().top - 210
		} else {
			footerTop = $('footer').offset().top - 220
		}

		const stopPoint = footerTop - windowHeight + bottomOffset + 300

		if (scrollTop > 200) {
			$button.addClass('show')
		} else {
			$button.removeClass('show')
		}
	})

	$.fancybox.defaults.touch = false
	$.fancybox.defaults.closeExisting = true

	$('.header__burger').on('click', function() {
		$('.header-mobile').toggleClass('active')
	})

	$('.header-mobile__close').on('click', function() {
		$('.header-mobile').removeClass('active')
	})

	const bgSwiper = new Swiper('.showcase__swiper', {
		direction: 'vertical',
		loop: true,
		speed: 3200,

		autoplay: {
			delay: 1000,
			disableOnInteraction: false
		},

		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},

		on: {
			slideChangeTransitionStart(swiper) {
				const index = swiper.realIndex

				document.querySelectorAll('.showcase__text-item').forEach((item, i) => {
					item.classList.toggle('active', i === index)
				})
			}
		}
	})

	const swipers = [
		{
			init: false,
			instance: null,
			selector: '.line__container',

			options: {
				slidesPerView: 'auto',
				speed: 2000,

				autoplay: {
					delay: 2000,
					disableOnInteraction: false
				},
				spaceBetween: 16,
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable: true
				}
			},
			breakpoint: 992
		},

		{
			init: false,
			instance: null,
			selector: '.about__container',

			options: {
				slidesPerView: 'auto',
				speed: 2000,

				autoplay: {
					delay: 2000,
					disableOnInteraction: false
				},
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable: true
				}
			},
			breakpoint: 992
		},

		{
			init: false,
			instance: null,
			selector: '.work__container',

			options: {
				slidesPerView: 'auto',
				speed: 2000,

				autoplay: {
					delay: 2000,
					disableOnInteraction: false
				},
				spaceBetween: 16,
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable: true
				}
			},
			breakpoint: 992
		}
	]

	function handleSwipers() {
		swipers.forEach(item => {
			const shouldInit = window.innerWidth < item.breakpoint

			if (shouldInit) {
				if (!item.instance) {
					item.instance = new Swiper(item.selector, item.options)
				}
			} else {
				if (item.instance) {
					if (typeof item.instance.destroy === 'function') {
						item.instance.destroy()
					}

					item.instance = null
				}
			}
		})
	}

	let resizeTimer

	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer)

		resizeTimer = setTimeout(() => {
			handleSwipers()
		}, 150)
	})

	handleSwipers()

	$('.header-catalog__list--item').hover(
		function() {
			$('.header-catalog__list--grid a').removeClass('active')

			$(this).children('ul').stop(true, true).fadeIn(200)

			$(this).find('> .header-catalog__list--grid a').addClass('active')
		},
		function() {
			$(this).children('ul').stop(true, true).fadeOut(200)

			$(this).find('> .header-catalog__list--grid a').removeClass('active')
		}
	)

	function isMobile() {
		return window.innerWidth <= 1024
	}

	let isTouch = isMobile()

	function closeAll() {
		$('.menu__item.dropdown').removeClass('active')
	}

	$('.menu__item.dropdown').on('mouseenter', function() {
		if (isTouch) return

		$(this).addClass('active')
	})

	$('.menu__item.dropdown').on('mouseleave', function() {
		if (isTouch) return

		$(this).removeClass('active')
	})

	$('.menu__item.dropdown > .menu__item--it').on('click', function(e) {
		if (!isTouch) return

		e.preventDefault()

		const $item = $(this).closest('.menu__item.dropdown')

		if ($item.hasClass('active')) {
			$item.removeClass('active')
		} else {
			closeAll()
			$item.addClass('active')
		}
	})

	$(window).on('resize', function() {
		isTouch = isMobile()
		closeAll()
	})

	const brandSwiper = new Swiper('.brand__container', {
		loop: true,
		slidesPerView: 'auto',
		spaceBetween: 40,
		speed: 6000,

		allowTouchMove: false,
		disableOnInteraction: true,

		freeMode: {
			enabled: true,
			momentum: false
		},

		autoplay: {
			delay: 0,
			disableOnInteraction: false
		}
	})

	const relSwiper = new Swiper('.rel__container', {
		loop: true,
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: 2000,

		autoplay: {
			delay: 2000,
			disableOnInteraction: false
		},
		navigation: {
			prevEl: '.rel__prev',
			nextEl: '.rel__next'
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		},

		breakpoints: {
			992: {
				slidesPerView: 2
			}
		}
	})

	const sertSwiper = new Swiper('.sert__container', {
		loop: true,
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: 2000,

		autoplay: {
			delay: 2000,
			disableOnInteraction: false
		},
		navigation: {
			prevEl: '.sert__prev',
			nextEl: '.sert__next'
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		},

		breakpoints: {
			992: {
				slidesPerView: 3
			},
			1300: {
				slidesPerView: 5
			}
		}
	})
})
