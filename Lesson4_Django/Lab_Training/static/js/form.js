$.ajaxSetup({
    headers: { 'X-CSRFToken': csrf_token },
    type: 'POST',
});

$(document).ready(function(){

    $('#submit').click(function(){
        
        $.ajax({
            url: '/web_tool/ajax_data/', 
            data: $('#ajax_form').serialize(),
            success: function(response){ 
                $("#message").html('<div class="alert alert-warning">' + response.message + '</div>');
            },
            error: function(){
                alert('Something error');
            },
        });
    });
});