$(() => {
    /* Para permitir edição dos dados */
    $('#buttonEdit').click(e =>{
        e.preventDefault()
        $('#formUpdateUser input').prop('disabled', false)
        $('#formUpdateUser select').prop('disabled', false)
    })

    /* Para atualizar um utilizador */
    $('#buttonUpdateUser').click(e =>{
        e.preventDefault()
        validateUpdateFields()
        if ($('#formUpdateUser').valid())
            ajaxPutUser()
    })

    /* Para atualizar a foto de perfil de utilizador */
     $('#buttonUpdateProfilePicProd').click(e =>{
            e.preventDefault()
            ajaxPutProfilePic('produtor')
        })

    /* Para atualizar a foto de perfil de utilizador */
    $('#buttonUpdateProfilePicMus').click(e =>{
            e.preventDefault()
            ajaxPutProfilePic('musico')
        })

    /* Para remover um evento */
    $('.buttonRemoveObra').click(function(e){
        e.preventDefault()
        ajaxDeleteObra($(this))
    })

    /* 
        AJAX DELETE OBRA
        Pedido DELETE para remover uma obra
        Elemento precisa do atributo href
    */
    function ajaxDeleteObra(element) {
        var url = element.attr('href')
        $.ajax({
            url: url,
            type: 'DELETE',
            success: () =>{
                element.closest('tr').remove()
            },
            error: err => {
                alert(JSON.stringify(err))
            }
        })
    }

    /* 
        AJAX PUT PROFILE PIC
        Pedido PUT para atualizar a foto de perfil de um utilizador
    */
   function ajaxPutProfilePic(tipo) {
    var formData = new FormData($('#formUpdateProfilePic')[0])
    $.ajax({
        type: "PUT",
        url: '/api/users/profile-pic/' + $('#formUpdateProfilePic').attr('user'),
        data: formData,
        processData: false,
        contentType: false,
        success: result => {
            if (tipo == 'produtor')
                window.location.href = '/produtor/perfil'
            else 
                window.location.href = '/musico/perfil'
        },
        error: error => {
            $('#formUpdateProfilePic p').remove()
            $('#formUpdateProfilePic').append('<p style="color: red;">Erro ao atualizar foto de perfil.</p>')
        }
      });
    }

    /* 
        AJAX PUT USER
        Pedido PUT para atualizar um utilizador
    */
   function ajaxPutUser() {
    var formData = new FormData($('#formUpdateUser')[0])

    $.ajax({
        type: "PUT",
        url: '/api/users/' + $('#formUpdateUser').attr('user'),
        data: formData,
        processData: false,
        contentType: false,
        success: result => {    
            $('#formUpdateUser p').remove()     
            $('#formUpdateUser').append('<p style="color: green;">Atualizado com sucesso.</p>')
        },
        error: error => {
            $('#formUpdateUser p').remove() 
            $('#formUpdateUser').append('<p style="color: red;"> Impossível de atualizar.</p>')
        }
      });
    }

    jQuery.validator.addMethod("Num", function(value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional( element ) || /[0-9]+/.test( value );
      }, 'Please enter a valid email address.');


        /* Para validar os campos na atualização do utilizador */
        function validateUpdateFields () {
            $('#formUpdateUser').validate({ 
                rules: {
                    nome: {
                        required: true
                    },
                    email: {
                      required: true,
                      email: true
                    },
                    password: {
                        minlength: 6, 
                        Num: true
                    }
                  },
                messages: {
                    nome: "Nome inválido.",
                    email: "Email inválido.",
                    password: "No mínimo 6 caracteres e 1 número."
                },
                wrapper: "small"

            });
        }

    /* SideBar Logica */
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

    $profile_pic = $('#croppie').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    $('#upload-img').on('change', function (){
        console.log('hello')
        var reader = new FileReader();
        reader.onload = function (event) {
            console.log('event.target.result')
            $profile_pic.croppie('bind', {
                url: event.target.result
            })
        }
        reader.readAsDataURL(this.files[0])
    })

    /* Obra search bar */
    $("#searchObras").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#obrasTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
})