class Sprite {

  constructor({
    position, 
    imageSrc, 
    scale = 1, 
    frames = 1, 
    offset = {x: 0, y: 0}
  }) {

    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.frames = frames
    this.frame = 0
    this.elapsed = 0
    this.loop = 5
    this.offset = offset
  }

  draw() {
    ctx.drawImage(this.image, 
                  this.frame * (this.image.width / this.frames),
                  0,
                  this.image.width / this.frames,
                  this.image.height,
                  this.position.x - this.offset.x, 
                  this.position.y - this.offset.y,
                  (this.image.width / this.frames) * this.scale,
                  this.image.height * this.scale)
  }

  update() {
    this.draw()
    this.animate()
  }

  animate() {
    this.elapsed++

    if(this.elapsed % this.loop === 0) {
      if(this.frame < this.frames - 1){
        this.frame++
      }else {
        this.frame = 0
      }
    }
  }
}

class Fighter extends Sprite {

  constructor({
    position, 
    velocity, 
    color, 
    imageSrc, 
    scale = 1, 
    frames = 1,
    offset = {x: 0, y: 0},
    sprites,
    attackBox = { offset: [], width: undefined, height: undefined }
  }) {

    super({
      position,
      imageSrc,
      scale,
      frames,
      offset
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color
    this.isAttacking = false
    this.health = 100
    this.frame = 0
    this.elapsed = 0
    this.loop = 5
    this.sprites = sprites
    this.dead = false

    for(const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()
    if(!this.dead) this.animate()

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    // ctx.fillRect(this.attackBox.position.x,
    //               this.attackBox.position.y,
    //               this.attackBox.width,
    //               this.attackBox.height)

    this.position.y += this.velocity.y
    this.position.x += this.velocity.x

    //gravity
    if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330 //corrects landing glitch
    }else{
      this.velocity.y += gravity
    }

  }

  attack() {
    this.setAnimation('attack1')

    setTimeout(() => {
      this.isAttacking = true  
    }, 20*this.frames)
    setTimeout(() => {
      this.isAttacking = false
    }, 40*this.frames)
  }

  hit() {
    this.health -= 20

    if(this.health <= 0) {
      this.setAnimation('death')
    } else {
      this.setAnimation('hit')
    }
  }

  setAnimation(sprite) {

    //override with death
    if(this.image === this.sprites.death.image) {
      if(this.frame === this.sprites.death.frames - 1)
        this.dead = true
      return
    }

    //override with attack
    if(this.image === this.sprites.attack1.image &&
      this.frame < this.sprites.attack1.frames - 1) 
      return

    //override with hit
    if(this.image === this.sprites.hit.image &&
      this.frame < this.sprites.hit.frames - 1) 
      return

    switch(sprite) {
      case 'idle':
        if(this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.frames = this.sprites.idle.frames    
          this.frame = 0
        }
        break
      case 'run':
        if(this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.frames = this.sprites.run.frames    
          this.frame = 0
        }
        break
      case 'jump':
        if(this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.frames = this.sprites.jump.frames    
          this.frame = 0
        }
        break
      case 'fall':
        if(this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.frames = this.sprites.fall.frames    
          this.frame = 0
        }
        break
      case 'attack1':
        if(this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.frames = this.sprites.attack1.frames    
          this.frame = 0
        }
        break
      case 'hit':
        if(this.image !== this.sprites.hit.image) {
          this.image = this.sprites.hit.image
          this.frames = this.sprites.hit.frames    
          this.frame = 0
        }
        break
      case 'death':
        if(this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.frames = this.sprites.death.frames    
          this.frame = 0
        }
        break
    }
  }
}
