$(document).ready(function () {
  $.get('/api/articles')
    .then(articles => {
      articles.forEach(article => {
        const img = $('<img>')
          .attr('src', article.image)
          .addClass('card-img-top')
        const titleLink = $('<a>')
          .attr('href', article.link)
          .addClass('text-dark')
          .attr('target', '_blank')
          .text(article.title)
        const title = $('<h5>')
          .addClass('card-title')
          .append(titleLink)
        const subtitle = $('<h6>')
          .addClass('card-subtitle text-muted mb-2')
          .text(article.topic)
        const link = $('<a>')
          .attr('href', article.link)
          .addClass('text-dark')
          .attr('target', '_blank')
          .text(article.summary)
        const text = $('<p>')
          .addClass('card-text text-muted')
          .append(link)
        const cardBody = $('<div>')
          .addClass('card-body')
          .append(title, subtitle, text)
        const card = $('<div>')
          .addClass('article-card card text-dark')
          .attr('data-id', article._id)
          .append(img, cardBody)
          .click(function () {
            renderComments(article.comments)
          })
        const cardWrapper = $('<div>')
          .addClass('col-lg-6 mb-4')
          .append(card)
        $('#articles').append(cardWrapper)
      })
    })
    .catch(error => { throw error })

  function renderComments (comments) {
    $('#comments').empty()
    comments.forEach(comment => {
      const timestamp = $('<small>')
        .addClass('float-right text-muted')
        .text(moment(comment.timestamp).format('MMM DD, h:mm a')) // eslint-disable-line no-undef
      const cardFooter = $('<div>')
        .addClass('card-footer text-muted')
        .append(timestamp)
      const message = $('<p>')
        .text(comment.body)
      const author = $('<footer>')
        .addClass('blockquote-footer')
        .text(comment.name || 'Anonymous')
      const blockquote = $('<blockquote>')
        .addClass('blockquote mb-0')
        .append(message, author)
      const cardBody = $('<div>')
        .addClass('card-body')
        .append(blockquote)
      const card = $('<div>')
        .addClass('card mb-4')
        .append(cardBody, cardFooter)
      $('#comments').append(card)
    })
  }

  $(document).on('click', '.article-card', function () {
    if ($(this).hasClass('selected')) {
      // Selected => Unselected
      $('#saveCommentBtn').removeAttr('data-id')
      $('#commentAside').hide()
    } else {
      // Unselected => Selected
      const articleId = $(this).data('id')
      $('#saveCommentBtn').attr('data-id', articleId)
      $('.article-card').removeClass('selected')
      $('#commentAside').show()
    }
    $(this).toggleClass('selected')
  })

  $('#saveCommentBtn').click(function () {
    const articleId = $(this).data('id')
    $.post({
      url: `/api/articles/${articleId}`,
      data: {
        name: $('#nameInput').val().trim(),
        body: $('#bodyTextarea').val().trim()
      }
    })
      .done(article => {
        console.log(article)
        renderComments(article.comments)
        $('#commentModal').modal('hide')
      })
      .fail(error => { throw error })
  })
})
