$(()=>{
    /* Para registar um utilizador */
    $('#buttonRegisterObra').click(e =>{
        e.preventDefault()
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
        },
        error: error => {
            $('#formRegisterObra').append('<p style="color: red;">Impossível de adicionar obra.</p>')
        }
      });
}
})