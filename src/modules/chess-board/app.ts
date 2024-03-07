import { Mesh, PlaneGeometry, Scene, ShaderMaterial } from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class App {
  private scene: Scene
  private material!: ShaderMaterial
  private time = 0

  constructor(scene: Scene) {
    this.scene = scene
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
      extensions: {
        derivatives: true
      },
      uniforms: {
        uTime: { value: 0 }
      }
    })
    const geometry = new PlaneGeometry(1, 1, 1)
    // const geometry = new SphereGeometry(0.5)
    const mesh = new Mesh(geometry, this.material)
    this.scene.add(mesh)
  }

  /**
   * 渲染
   */
  private tic() {
    this.time += 0.01
    this.material.uniforms.uTime.value = this.time

    requestAnimationFrame(() => {
      this.tic()
    })
  }
}
