const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  frames: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  imageSrc: './img/samuraiMack/idle.png',
  frames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/idle.png',
      frames: 8
    },
    run: {
      imageSrc: './img/samuraiMack/run.png',
      frames: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/jump.png',
      frames: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/fall.png',
      frames: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/attack1.png',
      frames: 6
    },
    hit: {
      imageSrc: './img/samuraiMack/hit.png',
      frames: 4
    },
    death: {
      imageSrc: './img/samuraiMack/death.png',
      frames: 6
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 950,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/kenji/idle.png',
  frames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/idle.png',
      frames: 4
    },
    run: {
      imageSrc: './img/kenji/run.png',
      frames: 8
    },
    jump: {
      imageSrc: './img/kenji/jump.png',
      frames: 2
    },
    fall: {
      imageSrc: './img/kenji/fall.png',
      frames: 2
    },
    attack1: {
      imageSrc: './img/kenji/attack1.png',
      frames: 4
    },
    hit: {
      imageSrc: './img/kenji/hit.png',
      frames: 3
    },
    death: {
      imageSrc: './img/kenji/death.png',
      frames: 7
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}


decTimer()

function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  background.update()

  //enhance player contrast
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  player.update()
  enemy.update()

  shop.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  if(keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.setAnimation('run')
  }else if(keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
    player.setAnimation('run')
  }else {
    player.setAnimation('idle')
  }

  //enemy movement
  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.setAnimation('run')
  }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
    enemy.setAnimation('run')
  }else {
    enemy.setAnimation('idle')
  }

  //player jump
  if(player.velocity.y < 0) {
    player.setAnimation('jump')
  }else if(player.velocity.y > 0) {
    player.setAnimation('fall')
  }

  //enemy jump
  if(enemy.velocity.y < 0) {
    enemy.setAnimation('jump')
  }else if(enemy.velocity.y > 0) {
    enemy.setAnimation('fall')
  }

  //enemy movement
  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
  }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
  }

  //player collision detection
  if(rectCollision({rect1: player, rect2: enemy}) && player.isAttacking){
    enemy.hit()
    player.isAttacking = false
    gsap.to('#enemy-health', {
      width: enemy.health + '%'
    })
  }

  //enemy collision detection
  if(rectCollision({rect1: enemy, rect2: player}) && enemy.isAttacking){
    player.hit()
    enemy.isAttacking = false
    gsap.to('#player-health', {
      width: player.health + '%'
    })
  }

  //end game when one dies

  if(enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {

  if(!player.dead){
    switch(event.key){
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }
  
  if(!enemy.dead){
    switch(event.key){
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }      
  }
})

window.addEventListener('keyup', (event) => {

  switch(event.key){
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    }
})

