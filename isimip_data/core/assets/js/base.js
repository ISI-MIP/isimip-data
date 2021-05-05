import 'bootstrap'

$(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $('.btn-copy-to-clipboard').click(function () {
    var code = this.getElementsByTagName('code')[0];
    var text = code.textContent;
    navigator.clipboard.writeText(text);
  })
})
