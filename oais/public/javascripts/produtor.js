$(()=>{
    /* Para registar um utilizador */
    $('#buttonRegisterObra').click(e =>{
        e.preventDefault()
        $('#formRegisterObra p ').remove()
        validateFile();
        if ($('#formRegisterObra').valid())
            ajaxPostObra()

    })

    /* 
        AJAX POST Obra
        Pedido POST para adicionar uma obra
    */
   function ajaxPostObra () {
    var formData = new FormData($('#formRegisterObra')[0])

    $.ajax({
        type: "POST",
        url: '/api/obras',
        data: formData,
        processData: false,
        contentType: false,
        success: result => {       
            $('#formRegisterObra').append('<p style="color: green;">Registada com sucesso.</p>')
            ajaxPostNoticia(result)
        },
        error: error => {
            $('#formRegisterObra p ').remove()
            $('#formRegisterObra').append('<p style="color:red;">' + error.responseJSON.replace(/\n/g, '<br />') + '</p>')
        }
      });
    }

    /* 
        AJAX POST NOTICIA
        Pedido POST para adicionar uma noticia
    */
   function ajaxPostNoticia (obra) {
    var formData = new FormData()
    formData.append('titulo', 'Adicionada nova obra.')
    formData.append('texto', obra + '\nIr para <a href="./obras">Obras</a>')
    console.log(obra)
    $.ajax({
        type: "POST",
        url: '/api/noticias',
        data: formData,
        processData: false,
        contentType: false,
        success: result => {       
        },
        error: error => {
    }
  });
}

    jQuery.validator.addMethod("isZIP", function(value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional( element ) || /.zip$/.test( value );
      }, 'Please enter a valid email address.');


        /* Para validar os campos na atualização do utilizador */
        function validateFile () {
            $('#formRegisterObra').validate({ 
                rules: {
                    ficheiro: {
                        required: true,
                        isZIP: true
                    }
                  },
                messages: {
                    ficheiro: "Tipo de ficheiro inválido."
                },
                wrapper: "small"

            });
        }
})