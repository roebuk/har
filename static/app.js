'use strict'

document.addEventListener('DOMContentLoaded', () => {

  // AVERT YOUR EYES FROM THIS HORRIFIC CODE. IT WORKS (SOMEHOW) BUT IT'S NOT PRETTY.
  var audios = []
  var numOfAudios = 9

  for (var i = 1; i <= numOfAudios; i++) {
    audios.push(new Howl({
      src: [`/static/audio/${i}.mp3`]
    }))
  }

  const localAddresses = ['localhost', '127.0.0.1']
  const port = localAddresses.includes(location.hostname) ? 3000 : 443
  const socket = io(`${location.protocol}//${location.hostname}:${port}`, {
    transports: ['websocket']
  })

  const $container = document.querySelector('.container')
  $container.addEventListener('click', emitClick)

  socket.on('playSound', data => {
    audios[data.sound].play()
    createAndPlaceElement(data)

    const $currentDot = document.querySelector('.dot:last-child')

    // Start the animation
    setTimeout(function() {
      $currentDot.classList.add('grow')
    }, 0.2)

    // Remove the element from the DOM once we're done with it
    setTimeout(function() {
      $container.removeChild($currentDot);
    }, 7500)
  })

  function emitClick(e) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const x = e.offsetX
    const y = e.offsetY

    const data = {
      x: parseInt(((x  / windowWidth) * 100).toFixed(2)),
      y: parseInt(((y / windowHeight) * 100).toFixed(2)),
      sound: Math.floor(Math.random() * numOfAudios) + 1
    }

    socket.emit('triggerSound', data)
  }

  function createAndPlaceElement(data) {
    const el = document.createElement('div')
    el.className = `dot`
    el.style.top = `calc(${data.y}% - 5rem)`
    el.style.left = `calc(${data.x}% - 5rem)`

    $container.appendChild(el)
  }
})
