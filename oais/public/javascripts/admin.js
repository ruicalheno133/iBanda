$(()=>{
    /* Para registar um utilizador */
    $('#buttonRegisterUser').click(e =>{
        e.preventDefault()
        validateFields()
        if ($('#formRegisterUser').valid()) {
            ajaxPostUser()
        }
    })

    /* Para remover um utilizador */
    $('.buttonRemoveUser').click(function(e){
        e.preventDefault()
        ajaxDeleteUser($(this))
    })

    /* Para registar um evento */
    $('#buttonRegisterEvent').click(e =>{
        e.preventDefault()
        ajaxPostEvent()
    })

    /* Para remover um evento */
    $('.buttonRemoveEvent').click(function(e){
        e.preventDefault()
        ajaxDeleteEvent($(this))
    })

    /* 
        AJAX DELETE USER
        Pedido DELETE para remover utilizador
        Elemento precisa do atributo href
    */
    function ajaxDeleteUser(element) {
        var url = element.attr('href')
        $.ajax({
            url: url,
            type: 'DELETE',
            success: () =>{
                element.closest('tr').remove()
            }
        })
    }

    /* 
        AJAX DELETE EVENT
        Pedido DELETE para remover evento
        Elemento precisa do atributo href
    */
    function ajaxDeleteEvent(element) {
        var url = element.attr('href')
        $.ajax({
            url: url,
            type: 'DELETE',
            success: () =>{
                element.closest('.w3-col').remove()
            }
        })
    }

    /* 
        AJAX POST USER
        Pedido POST para adicionar um utilizador
    */
    function ajaxPostUser () {
        var formData = new FormData($('#formRegisterUser')[0])

        $.ajax({
            type: "POST",
            url: '/api/users',
            data: formData,
            processData: false,
            contentType: false,
            success: result => {       
                $('#formRegisterUser').append('<p style="color: green;">Registado com sucesso.</p>')
            },
            error: error => {
                $('#formRegisterUser').append('<p style="color: red;">Utilizador já existe.</p>')
            }
          });
    }

    /* 
        AJAX POST EVENT
        Pedido POST para adicionar um evento
    */
    function ajaxPostEvent () {
        var formData = new FormData($('#formEvent')[0])

        $.ajax({
            type: "POST",
            url: '/api/events',
            data: formData,
            processData: false,
            contentType: false,
            success: result => {       
                window.location.replace('/admin/events')
                //$('#formRegistration').append('<p style="color: green;">Registado com sucesso.</p>')
            },
            error: error => {
                $('#formEvent p').remove()
                $('#formEvent').append('<p style="color: red;">Erro na criação do evento.</p>')
            }
          });
    }

    jQuery.validator.addMethod("Num", function(value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional( element ) || /[0-9]+/.test( value );
      }, 'Please enter a valid email address.');

    /* Para validar os campos no registo do utilizador */
    function validateFields () {
        $('#formRegisterUser').validate({ 
            rules: {
                nome: {
                    required: true
                },
                email: {
                  required: true,
                  email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                    Num: true
                }
              },
            messages: {
                nome: "Nome inválido.",
                email: "Email inválido.",
                password: "A password deve ter no mínimo 6 caracteres e conter, pelo menos, um número"
            },
            wrapper: "small"
        });
    }

    /* User search bar */
    $("#searchUsers").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#usersTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

})