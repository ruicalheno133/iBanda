$(()=>{
    /* Cliques */
    $('#buttonRegister').click(e =>{
        e.preventDefault()
        validateFields()
        if ($('#formRegistration').valid()) {
            ajaxPostUser()
        }
    })

    $('#buttonRegisterEvent').click(e =>{
        e.preventDefault()
        ajaxPostEvent()
    })

    $('#buttonUpdate').click(e =>{
        e.preventDefault()
        ajaxPut()
    })

    $('#buttonEdit').click(e =>{
        e.preventDefault()
        $('#formUpdate input').prop('disabled', false)
        $('#formUpdate select').prop('disabled', false)
    })

    $('.buttonRemoveUser').click(function(e){
        e.preventDefault()
        ajaxDelete($(this))
    })

    $('.buttonRemoveEvent').click(function(e){
        e.preventDefault()
        ajaxDeleteEvent($(this))
    })



    /* Validador de Campos */

    function validateFields () {
        $('#formRegistration').validate({ 
            rules: {
                nome: {
                    required: true
                },
                email: {
                  required: true,
                  email: true
                }
              },
            messages: {
                nome: "Nome inválido.",
                email: "Email inválido.",
                password: "A password deve ter no mínimo 8 caracteres e conter, pelo menos, um número"
            },
            wrapper: "small"
        });
    }

    /* Pedidos AJAX */

    function ajaxDelete(element) {
        var url = element.attr('href')
        $.ajax({
            url: url,
            type: 'DELETE',
            success: () =>{
                element.closest('tr').remove()
            }
        })
    }

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

    function ajaxPostUser (form_name) {
        var formData = new FormData($('#formRegistration')[0])

        $.ajax({
            type: "POST",
            url: '/api/users',
            data: formData,
            processData: false,
            contentType: false,
            success: result => {       
                $('#formRegistration').append('<p style="color: green;">Registado com sucesso.</p>')
            },
            error: error => {
                $('#formRegistration').append('<p style="color: red;">Utilizador já existe.</p>')
            }
          });
    }

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

    function ajaxPut() {
        var formData = new FormData($('#formUpdate')[0])
        $.ajax({
            type: "PUT",
            url: '/api/users/' + $('#formUpdate').attr('user'),
            data: formData,
            processData: false,
            contentType: false,
            success: result => {        
                $('#formUpdate').append('<p style="color: green;">Atualizado com sucesso.</p>')
            },
            error: error => {
                $('#formUpdate').append('<p style="color: red;"> Impossível de atualizar.</p>')
            }
          });
    }

    /* SideBar */

    $('#buttonUsersDropdown').click(e =>{
        toggleDropdown('usersDropdown')
    })

    function toggleDropdown(id) {
        var x = document.getElementById(id);
        if (x.className.indexOf("w3-show") == -1) {  
            x.className += " w3-show";
        } else { 
            x.className = x.className.replace(" w3-show", "");
        }
    }

    $('#buttonMusicosDropdown').click(e =>{
        toggleDropdown('musicosDropdown')
    })

    $('#buttonObrasDropdown').click(e =>{
        toggleDropdown('ObrasDropdown')
    })

    /* Remover atributo 'disabled' quando clicamos np atualizar */

    $("#buttonEdit").click(function(){
        $(".inputsTobeEnabled").removeAttr("disabled");
    })
})