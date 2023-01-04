function rectCollision({rect1, rect2}) {

  return (rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.width)
}

function determineWinner({player, enemy, timerId}) {

  clearTimeout(timerId)
  document.querySelector("#display-text").style.display = 'flex'

  if(player.health === enemy.health) {
    document.querySelector("#display-text").innerHTML = "It's a tie!"
  }else if(player.health > enemy.health){
    document.querySelector("#display-text").innerHTML = 'Player1 wins!'
  }else if(player.health < enemy.health){
    document.querySelector("#display-text").innerHTML = 'Player2 wins!'
  }  
}

let timer = 64
let timerId
function decTimer() {

  if(timer > 0) {
    timerId = setTimeout(decTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer

    if(timer === 63) {
      document.querySelector('#center-text').innerHTML = '3'
    }else if(timer === 62) {
      document.querySelector('#center-text').innerHTML = '2'
    }else if(timer === 61) {
      document.querySelector('#center-text').innerHTML = '1'
    }else if(timer >= 59) {
      document.querySelector('#center-text').innerHTML = 'Fight!'
    }else {
      document.querySelector('#center-text').style.display = 'none'
    }
  }
  
  if(timer === 0){
    determineWinner({player, enemy, timerId})
  }
}
