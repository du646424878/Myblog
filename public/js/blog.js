function deleteblog(id) {
    
    var url = "/articles/deleteblog/"+ id;
    $.post(url, {},
        function(data, status) {
        onclick = Materialize.toast('删除成功',1800, '', function() {
                window.location = "/index";
          });
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