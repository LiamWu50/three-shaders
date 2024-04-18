import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
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
  private geometry!: BufferGeometry
  private particles!: Points

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
    this.geometry = new BufferGeometry()
    const num = 500
    const bound = 20

    const positionArray = new Float32Array(num * 3)
    const colorArray = new Float32Array(num * 3)

    for (let i = 0; i < num; i++) {
      const x = Math.random() * bound - bound / 2
      const y = Math.random() * bound - bound / 2
      const z = Math.random() * bound - bound / 2

      const r = Math.random()
      const g = Math.random()
      const b = Math.random()

      positionArray.set([x, y, z], i * 3)
      colorArray.set([r, g, b], i * 3)
    }

    this.geometry.setAttribute(
      'position',
      new BufferAttribute(positionArray, 3)
    )

    this.geometry.setAttribute('color', new BufferAttribute(colorArray, 3))

    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        time: { value: 0 }
      }
    })

    this.particles = new Points(this.geometry, this.material)
    this.scene.add(this.particles)
  }
}
