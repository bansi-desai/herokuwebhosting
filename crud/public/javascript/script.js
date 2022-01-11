$('#submit1').click(function () {
    $.ajax({
      url: '/server',
      type: 'POST',
      cache: false,
      data: {
        name: $('#name').val(),
        position: $('#position').val(),
        office: $('#office').val(),
        salary: $('#salary').val(),
        email: $('#email').val(),
        phone: $('#phone').val()        
      },
      success: function () {
        $('#error-group').css('display', 'none');
        alert('Your submission was successful');
      },
      error: function (data) {
        $('#error-group').css('display', 'block');
        var errors = JSON.parse(data.responseText);
        var errorsContainer = $('#errors');
        errorsContainer.innerHTML = '';
        var errorsList = '';
  
        for (var i = 0; i < errors.length; i++) {
          errorsList += '<li>' + errors[i].msg + '</li>';
        }
        errorsContainer.html(errorsList);
      }
    });
  });