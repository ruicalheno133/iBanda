$(()=>{
    /* Cliques */

    $('#buttonRegister').click(e =>{
        e.preventDefault()
        validateFields()
        if ($('#formRegistration').valid()) {
            ajaxPost()
        }
    })

    $('#buttonUpdate').click(e =>{
        e.preventDefault()
        ajaxPut()
    })

    $('.buttonRemoveUser').click(function(e){
        e.preventDefault()
        ajaxDelete($(this))
    })

    /* Validador de Campos */

    function validateFields () {
        $('#formRegisto').validate({ 
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
                    minlength: 8,
                    number: true
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

    function ajaxPost () {
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

            }
          });
    }

    function ajaxPut () {
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
})