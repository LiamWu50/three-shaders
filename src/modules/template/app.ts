import {
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class App {
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private material!: ShaderMaterial
  private geometry!: PlaneGeometry
  private plane!: Mesh

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
  }

  public init() {
    this.addObjects()
  }

  private addObjects() {
    this.geometry = new BoxGeometry(1, 1, 1)
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: { value: 0 }
      }
    })

    this.plane = new Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }
}
