import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector4
} from 'three'

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

export default class App {
  private scene: Scene
  private material!: ShaderMaterial
  private material1!: MeshBasicMaterial
  private geometry!: PlaneGeometry
  private plane!: Mesh

  constructor(scene: Scene) {
    this.scene = scene
  }

  public init() {
    this.addObjects()
  }

  private addObjects() {
    this.material = new ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new Vector4() }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.material1 = new MeshBasicMaterial({ color: 0xff0000 })

    this.geometry = new PlaneGeometry(1, 1, 1, 1)

    this.plane = new Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }
}
