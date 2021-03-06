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
        if (confirm('De certeza que pretende eliminar este utilizador?'))
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
        if (confirm('De certeza que pretende eliminar este evento?'))
            ajaxDeleteEvent($(this))
    })

     /* Para registar uma noticia */
     $('#buttonRegisterNoticia').click(e =>{
        e.preventDefault()
        ajaxPostNoticia()
    })

     /* Para atualizar uma noticia */
     $('.buttonUpdateNoticia').click(function(e){
        e.preventDefault()
        var id = $(this).attr('nid')
        ajaxPutNoticia(id)
    })

    /* Para remover uma noticia */
    $('.buttonRemoveNoticia').click(function(e){
        e.preventDefault()
        if (confirm('De certeza que pretende eliminar esta notícia?'))
            ajaxDeleteNoticia($(this))
    })

    /* Para remover uma noticia */
    $(document).on('click', '.buttonVisible', function(e){
        e.preventDefault()
        ajaxChangeVisible($(this), 'visivel')
    })

    /* Para remover uma noticia */
    $(document).on('click', '.buttonNotVisible', function(e) {
        e.preventDefault()
        ajaxChangeVisible($(this), 'invisivel')
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
        AJAX DELETE NOTICIA
        Pedido DELETE para remover noticia
        Elemento precisa do atributo href
    */
   function ajaxDeleteNoticia(element) {
        var id = element.attr('href')
        $.ajax({
            url: '/api/noticias/' + id,
            type: 'DELETE',
            success: () =>{
                element.closest('tr').remove()
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
                $('#formRegisterUser p').remove()    
                $('#formRegisterUser').append('<p style="color: green;">Registado com sucesso.</p>')
            },
            error: error => {
                $('#formRegisterUser p').remove() 
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
            },
            error: error => {
                $('#formEvent p').remove()
                $('#formEvent').append('<p style="color: red;">Erro na criação do evento.</p>')
            }
          });
    }


    /* 
        AJAX POST NOTICIA
        Pedido POST para adicionar uma noticia
    */
   function ajaxPostNoticia () {
        var formData = new FormData($('#formNoticia')[0])

        $.ajax({
            type: "POST",
            url: '/api/noticias',
            data: formData,
            processData: false,
            contentType: false,
            success: result => {       
                window.location.replace('/admin/noticias')
            },
            error: error => {
                $('#formNoticia p').remove()
                $('#formNoticia').append('<p style="color: red;">Erro na criação da notícia.</p>' )
        }
      });
    }

    /* 
        AJAX PUT noticia
        Pedido PUT para atualizar uma noticia
    */
   function ajaxPutNoticia (id) {
    var formData = new FormData($('#formUpdateNoticia' + id)[0])

    $.ajax({
        type: "PUT",
        url: '/api/noticias/' + id,
        data: formData,
        processData: false,
        contentType: false,
        success: result => {       
            window.location.replace('/admin/noticias')
        },
        error: error => {
            $('#formUpdateNoticia' + id + 'p').remove()
            $('#formUpdateNoticia' + id).append('<p style="color: red;">Erro na edição da notícia.</p>' )
    }
  });
}

    /* 
        AJAX POST NOTICIA
        Pedido POST para alterar visibilidade da notícia
    */
   function ajaxChangeVisible (element, visibilidade) {
    var id = element.attr('href')
    $.ajax({
        type: "POST",
        url: '/api/noticias/' + id + '/' + visibilidade,
        success: result => {       
            element.empty()
            if (visibilidade == 'visivel'){ 
                element.removeClass('buttonVisible')
                element.addClass('buttonNotVisible')
                element.append('<i class="fas fa-eye-slash"></i>')
                element.closest('tr').css('border-left', '5px solid green')
            }
            else {
                element.removeClass('buttonNotVisible')
                element.addClass('buttonVisible')
                element.append('<i class="fas fa-eye"></i>')
                element.closest('.visibleIndicator').empty()
                element.closest('tr').css('border-left', '5px solid darkred')
            }
        },
        error: error => {
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