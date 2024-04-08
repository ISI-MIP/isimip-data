import sha512 from 'js-sha512'

function dropHandler(e) {
  // from https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

  // Prevent default behavior (Prevent file from being opened)
  e.preventDefault()

  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < e.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (e.dataTransfer.items[i].kind === 'file') {
        var file = e.dataTransfer.items[i].getAsFile()
        processFile(e.target, file)
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var j = 0; j < e.dataTransfer.files.length; j++) {
      processFile(e.target, e.dataTransfer.files[j])
    }
  }
}

function processFile(target, file) {
  file.arrayBuffer().then(buffer => {
    target.value = sha512(buffer)

    var form = document.getElementById('metadata-form'),
        submit = document.getElementById('metadata-form-submit')
    form.requestSubmit(submit)
  })
}

const elements = document.getElementsByClassName('sha1-drop')
for (let element of elements) {
  element.addEventListener('drop', dropHandler, false)
}
