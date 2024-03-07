import { Clock, Mesh, Scene, ShaderMaterial, SphereGeometry } from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class App {
  private scene: Scene
  private clock: Clock
  private mesh!: Mesh
  private material!: ShaderMaterial
  private time = 0

  constructor(scene: Scene) {
    this.scene = scene
    this.clock = new Clock()
  }

  public init() {
    this.addObjects()
    this.tic()
  }

  /**
   * 添加物体
   */
  private addObjects() {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 }
      }
    })
    const geometry = new SphereGeometry(1, 256, 256)
    this.mesh = new Mesh(geometry, this.material)
    this.scene.add(this.mesh)
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
