document.addEventListener('DOMContentLoaded', () => {

  // HOLY FUCK THIS SHITTY CODE. SHOOT ME.
  var audios = []
  var numOfAudios = 9

  for (var i = 1; i <= numOfAudios; i++) {
    audios.push(new Howl({
      src: [`/static/audio/${i}.mp3`]
    }))
  }

  const socket = io(`${location.protocol}//${location.hostname}`, {
    transports: ['websocket']
  })

  const $container = document.querySelector('.container')
  $container.addEventListener('click', emitClick)
  var counter = 1

  socket.on('playSound', function (data) {
    counter++
    audios[data.sound].play()
    createAndPlaceElement(data, counter)

    const $currentEl = document.querySelector('.dot:last-child')
    startAnimation($currentEl)
    cleanUpFromDOM($currentEl)
  })

  function getRandomSound() {
    return Math.floor(Math.random() * numOfAudios) + 1
  }

  function startAnimation($el) {
    setTimeout(function() {
      $el.classList.add('grow')
    }, 0.2);
  }

  function cleanUpFromDOM($el) {
    setTimeout(function() {
      $container.removeChild($el);
    }, 7500)
  }

  function emitClick(e) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const x = e.offsetX
    const y = e.offsetY

    const data = {
      x: parseInt(((x  / windowWidth) * 100).toFixed(2)),
      y: parseInt(((y / windowHeight) * 100).toFixed(2)),
      sound: getRandomSound()
    }

    socket.emit('triggerSound', data)
  }

  function createAndPlaceElement(data, counter) {
    const el = document.createElement('div')
    el.className = `dot`
    el.style.top = `calc(${data.y}% - 5rem)`
    el.style.left = `calc(${data.x}% - 5rem)`

    $container.appendChild(el)
    return el
  }
})
