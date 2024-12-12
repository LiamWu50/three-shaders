import {
  DoubleSide,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class App {
  private scene: Scene
  private camera: OrthographicCamera
  private renderer: WebGLRenderer
  private material!: ShaderMaterial
  private geometry!: PlaneGeometry
  private plane!: Mesh

  constructor(
    scene: Scene,
    camera: OrthographicCamera,
    renderer: WebGLRenderer
  ) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
  }

  public init() {
    this.addObjects()
    this.tic()
  }

  private addObjects() {
    this.geometry = new PlaneGeometry(400, 400, 32, 32)
    this.material = this.getMaterial()
    this.plane = new Mesh(this.geometry, this.material)

    this.scene.add(this.plane)
  }

  private getMaterial() {
    return new ShaderMaterial({
      transparent: true,
      side: DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: { value: 0 }
      }
    })
  }

  private tic() {
    requestAnimationFrame(this.tic.bind(this))

    this.material.uniforms.time.value += 0.01
    this.renderer.render(this.scene, this.camera)
  }
}
