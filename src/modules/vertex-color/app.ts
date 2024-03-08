import GUI from 'lil-gui'
import { Clock, Mesh, Scene, ShaderMaterial, SphereGeometry } from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class App {
  private scene: Scene
  private clock: Clock
  private mesh!: Mesh
  private material!: ShaderMaterial
  private time = 0
  private gui: GUI

  constructor(scene: Scene) {
    this.scene = scene
    this.clock = new Clock()
    this.gui = new GUI()
  }

  public init() {
    this.addObjects()
    this.addGui()
    this.tic()
  }

  /**
   * 添加物体
   */
  private addObjects() {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.5 },
        uFrequency: { value: 5.0 }
      }
    })
    const geometry = new SphereGeometry(1, 256, 256)
    this.mesh = new Mesh(geometry, this.material)
    this.scene.add(this.mesh)
  }

  /**
   * 添加 GUI
   */
  addGui() {
    this.gui
      .add(this.material.uniforms.uStrength, 'value', 0, 1, 0.01)
      .name('uStrength')

    this.gui
      .add(this.material.uniforms.uFrequency, 'value', 0, 20, 0.01)
      .name('uFrequency')
  }

  /**
   * 渲染
   */
  private tic() {
    this.time = this.clock.getElapsedTime()
    this.material.uniforms.uTime.value = this.time
    this.mesh.rotation.y = this.time

    requestAnimationFrame(() => {
      this.tic()
    })
  }
}
