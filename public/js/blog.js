function deleteblog(id) {
    
    var url = "/articles/deleteblog/"+ id;
    $.post(url, {},
        function(data, status) {
          location.href='/index';
          Materialize.toast('删除博客成功',1000);
        }
    );
    return false;
}
function deletecomment(id) {
    var url = "/articles/comment/delete/" + id;
    $.post(url, {},
        function(data, status) {
            location.reload();
            Materialize.toast('删除评论成功',1000);
        }
    ).
    error(function(data, status) {
        console.log("失败");
    })
}