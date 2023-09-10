import * as THREE from 'three'
import Home from './Home.js'


export default class Navigation
{
    constructor()
    {
        const home = new Home();
        this.targetElement = home.targetElement
        this.camera = home.camera
        this.config = home.config
        this.time = home.time

        this.setView()
    }

    setView()
    {
      this.view = {}

      this.view.position = {}
      this.view.position.value = new THREE.Vector3(-4, 3.5, 2.5)
      this.view.position.smoothed = this.view.position.value.clone()
      this.view.position.smoothing = 0.005
      this.view.position.limits = {}
      this.view.position.limits.x = { min: -4, max: 2}
      this.view.position.limits.y = { min: -3, max: 3}
      this.view.position.limits.z = { min: -3, max: 3}
      
      this.view.target = {}
      this.view.target.value = new THREE.Vector3(0, 2.5, -2)

      
      this.view.drag = {}
      this.view.drag.delta = {}
      this.view.drag.delta.x = 0
      this.view.drag.delta.y = 0
      this.view.drag.previous = {}
      this.view.drag.previous.x = 0
      this.view.drag.previous.y = 0
      this.view.drag.sensitivity = 10


      this.view.down = (_x, _y) =>
      {
         this.view.drag.previous.x = _x
         this.view.drag.previous.y = _y
      }

      this.view.move = (_x, _y) => 
      {
         this.view.drag.delta.x += _x - this.view.drag.previous.x 
         this.view.drag.delta.y += _y - this.view.drag.previous.y 

         this.view.drag.previous.x = _x
         this.view.drag.previous.y = _y
      }

      this.view.up = () => 
      {

      }


      /**
       * Mouse events
       */

      this.view.onMouseMove = (_event) => {
         this.view.move(_event.clientX, _event.clientY)
      }


      window.addEventListener('mousemove', this.view.onMouseMove)

      /**
       * Touched event
       */
      this.view.onTouchStart = (_event) =>
      {
         
         this.view.drag.alternative = _event.touches.length > 1

         this.view.down(_event.touches[0].clientX, _event.touches[0].clientY)

         window.addEventListener('touchend', this.view.onTouchEnd, { passive: false })
         window.addEventListener('touchmove', this.view.onTouchMove, { passive: false })
      }

      this.view.onTouchMove = (_event) =>
      {
         this.view.move(_event.touches[0].clientX, _event.touches[0].clientY)
      }

      this.view.onTouchEnd = (_event) =>
      {
         
         this.view.up()

         window.removeEventListener('touchend', this.view.onTouchEnd)
         window.removeEventListener('touchmove', this.view.onTouchMove)
      }

      window.addEventListener('touchstart', this.view.onTouchStart, { passive: false })

    }

    

    update()
    {
      this.view.position.value.x += this.view.drag.delta.x * this.view.drag.sensitivity / this.config.smallestSide

      this.view.drag.delta.x = 0
      this.view.drag.delta.y = 0

      // Apply limits
      this.view.position.value.x = Math.min(Math.max(this.view.position.value.x, this.view.position.limits.x.min), this.view.position.limits.x.max)

      //Smoothing
      this.view.position.smoothed.x += (this.view.position.value.x - this.view.position.smoothed.x) * this.view.position.smoothing

      this.camera.modes.default.instance.position.copy(this.view.position.smoothed)
      this.camera.modes.default.instance.lookAt(this.view.target.value)
    }
}