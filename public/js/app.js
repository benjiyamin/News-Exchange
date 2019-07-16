$(document).ready(function () {
  $('.card').click(function () {
    if ($(this).hasClass('selected')) {
      $('#commentAside').hide()
    } else {
      $('#commentAside').show()
      $('.card').removeClass('selected')
    }
    $(this).toggleClass('selected')
  })
})
