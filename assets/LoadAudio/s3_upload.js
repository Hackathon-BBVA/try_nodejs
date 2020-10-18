$( document ).ready(function() {
    $('#GifAnimation').hide(); 
    $("#uploadForm").submit(function() {
        var bucketName = 'smarts001';
        var bucket = new AWS.S3({params: {Bucket: bucketName}});
        var uploadFiles = $('#upFile')[0];
        var upFile = uploadFiles.files[0];
        var time = Date.now();
        var ext = getFileExtension(upFile.name);

        if(ext != 'wav'){
            $('#TextOutput').text('El archivo de audio no tiene la extension deseada (.wav)');
        }else if (upFile && ext == 'wav') {
            var uploadParams = {
                Key: 'record-'+time+'.'+getFileExtension(upFile.name),
                ContentType: upFile.type,
                Body: upFile
            };
            bucket.upload(uploadParams).on('httpUploadProgress', function(evt) {
                $('#GifAnimation').show();
                $('#UpAudio').hide();
                $('#TextOutput').text('Cargando archivo...');
            }).send(function(err, data) {
                var ValueErr = JSON.stringify(err);
                if(ValueErr.length > 5){
                    ValueErr = JSON.parse(ValueErr);          
                    $('#TextOutput').text('Error en la carga de archivos : '+ValueErr.message);
                }else{
                    $('#upFile').val(null);
                    $('#GifAnimation').hide();
                    $('#UpAudio').show();
                    $('#TextOutput').text('Carga de archivo de audio terminada!!!');
                }
            });
        }else{
            $('#TextOutput').text('Error en la carga del archivo de audio');
        }
        return false;
    });
});

function getFileExtension(filename) {
    return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase() : false;
}
