import * as THREE from 'three'
import Home from './Home'

export default class Camera
{
    constructor()
    {
        // Options
        const home = new Home();
        this.config = home.config
        this.debug = home.debug
        this.time = home.time
        this.sizes = home.sizes
        this.targetElement = home.targetElement
        this.scene = home.scene

        // Set up
        this.mode = 'default' // defaultCamera \ debugCamera

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(5, 5, 5)
        

    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
     }
 
     destroy()
     {
         this.modes.debug.orbitControls.destroy()
     }

}
