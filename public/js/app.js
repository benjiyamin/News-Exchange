$(document).ready(function () {
  function renderArticles () {
    return $.get('/api/articles')
      .then(articles => {
        $('#articles').empty()
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
            .click(() => renderComments(article))
          const cardWrapper = $('<div>')
            .addClass('col-lg-6 mb-4')
            .append(card)
          $('#articles').append(cardWrapper)
        })
      })
      .catch(error => { throw error })
  }

  function selectArticle (id) {
    $(`.article-card[data-id='${id}']`).addClass('selected')
  }

  function renderComments (article) {
    $('#comments').empty()
    article.comments.reverse() // Reverse chronological
    article.comments.forEach(comment => {
      const timestamp = $('<small>')
        .addClass('float-right text-muted')
        .text(moment(comment.timestamp).format('MMM DD, h:mm a')) // eslint-disable-line no-undef
      const cardFooter = $('<div>')
        .addClass('card-footer text-muted')
        .append(timestamp)
      const message = $('<span>')
        .text(comment.body)
      const close = $('<button>')
        .addClass('close')
        // .attr('data-id', comment._id)
        .text('×')
        .click(function () {
          $.ajax({
            url: `/api/comments/${comment._id}`,
            type: 'DELETE'
          })
            .done(() => {
              renderArticles()
                .then(() => selectArticle(article._id))
                .catch(error => { throw error })
              $(this).parents('.card').remove()
            })
            .fail(error => { throw error })
        })
      const messageWrapper = $('<p>')
        .append(message, close)
      const author = $('<footer>')
        .addClass('blockquote-footer')
        .text(comment.name || 'Anonymous')
      const blockquote = $('<blockquote>')
        .addClass('blockquote mb-0')
        .append(messageWrapper, author)
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
        renderArticles()
          .then(() => selectArticle(article._id))
          .catch(error => { throw error })
        renderComments(article)
        $('#commentModal').modal('hide')
      })
      .fail(error => { throw error })
      .always(() => {
        $('#nameInput').val('')
        $('#bodyTextarea').val('')
      })
  })

  $('#commentModalBtn').click(function () {
    $('#bodyTextarea').focus()
  })

  renderArticles()
})
