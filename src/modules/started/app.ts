import {
  BoxGeometry,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

type Size = {
  width: number
  height: number
}

export default class App {
  private scene: Scene
  private camera: OrthographicCamera
  private renderer: WebGLRenderer
  private size: Size
  private material!: ShaderMaterial
  private time = 0

  constructor(
    scene: Scene,
    camera: OrthographicCamera,
    renderer: WebGLRenderer,
    size: Size
  ) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.size = size
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
      uniforms: {
        uTime: { value: 0 }
      }
    })
    const plane = new BoxGeometry(1, 1, 1)
    // const plane = new PlaneGeometry(1, 1, 1)
    const mesh = new Mesh(plane, this.material)
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
