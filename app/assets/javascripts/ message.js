$(function(){ 
  // console.log(last_message_id);
  
  var buildHTML = function(message) {
    if (message.content && message.image) {
      var html =`<div class="message-list" data-message-id=` + message.id + `>` +
        `<div class="message-list__upper">` +
          `<div class="message-list__upper__name">` +
            message.user_name +
          `</div>` +
          `<div class="message-list__upper__date">` +
            message.created_at +
          `</div>` +
        `</div>` +
        `<div class="lower-message">` +
          `<p class="message-list__content">` +              
            message.content +
          `</p>` +
          `<img src= "` + message.image + `" class="lower-message__image" >` +
        `</div>` +
      `</div>`
    } else if (message.content) {
      var html = `<div class="message-list" data-message-id=` + message.id + `>` +
        `<div class="message-list__upper">` +
          `<div class="message-list__upper__name">` +
            message.user_name +
          `</div>` +
          `<div class="message-list__upper__date">` +
            message.created_at +
          `</div>` +
        `</div>` +
        `<div class="lower-message">` +
          `<p class="lower-message__content">` +
            message.content +
          `</p>` +
        `</div>` +
      `</div>`
    } else if (message.image) {
      var html = `<div class="message-list" data-message-id=` + message.id + `>` +
        `<div class="upper-message-list">` +
          `<div class="upper-message-list__upper__name">` +
            message.user_name +
          `</div>` +
          `<div class="upper-message-list__upper__date">` +
            message.created_at +
          `</div>` +
        `</div>` +
        `<div class="lower-message">` +
          `<img src="` + message.image + `" class="lower-message__content" >` +
        `</div>` +
      `</div>`
    };
    return html;
  };

  $('#new_message').on('submit', function(e){
  e.preventDefault();
  var formData = new FormData(this);
  
  var url = $(this).attr('action')
  
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    dataType: 'json',
    processData: false,
    contentType: false
  })
    .done(function(data){
      
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $('form')[0].reset();
      $('.message-form__send').attr('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    })
  });

  var reloadMessages = function() {
    last_message_id = $('.message-list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.log(messages)
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
        }    
    })
    .fail(function() {
      console.log('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});