import {
  DoubleSide,
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
  private meshes: Mesh[] = []
  private materials: ShaderMaterial[] = []

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
    this.tic(0)
  }

  private addObjects() {
    this.geometry = new PlaneGeometry(2, 2)

    const number = 90

    for (let i = 0; i < number; i++) {
      const material = this.getMaterial(i / 30)
      const mesh = new Mesh(this.geometry, material)

      this.scene.add(mesh)
      mesh.position.z = -i * 0.1
      this.materials.push(material)
      this.meshes.push(mesh)
    }
  }

  private getMaterial(level: number) {
    return new ShaderMaterial({
      transparent: true,
      side: DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: { value: 0 },
        level: { value: level }
      }
    })
  }

  /**
   * 渲染
   */
  private tic(playhead: number) {
    this.materials.forEach((material, index) => {
      material.uniforms.time.value += playhead * Math.PI * 2
    })

    requestAnimationFrame(() => {
      this.tic(playhead)
    })
  }
}
