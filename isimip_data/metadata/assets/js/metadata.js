import sha1 from 'js-sha1'

const input = document.getElementById('input')

function dropHandler(ev) {
  // from https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault()

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile()
        processFile(file)
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      processFile(ev.dataTransfer.files[i])
    }
  }
}

function processFile(file) {
  file.arrayBuffer().then(buffer => {
    input.value = sha1(buffer)
  })
}

input.addEventListener('drop', dropHandler, false)
