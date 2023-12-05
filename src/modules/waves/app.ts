import * as dat from 'dat.gui'
import gsap from 'gsap'
import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector4,
  WebGLRenderer
} from 'three'

import brush from '@/assets/images/burash.png'

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
  private settings!: { progress: number }
  private gui!: dat.GUI
  private material!: ShaderMaterial
  private material1!: MeshBasicMaterial
  private geometry!: PlaneGeometry
  private plane!: Mesh
  private imageAspect!: number
  private isPlaying = true
  private time = 0
  private meshes: Mesh[] = []
  private max!: number
  private mouse = new Vector2()

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
    this.mouseEvents()
    this.addObjects()
    this.setupResize()
    this.tic()
    // this.setting()

    // this.camera.updateProjectionMatrix()
  }

  private mouseEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX - this.size.width / 2
      this.mouse.y = this.size.height / 2 - e.clientY
    })
  }

  private setting() {
    this.settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.01)
  }

  private setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  private resize() {
    this.imageAspect = 853 / 1280
    let a1: number, a2: number
    if (this.size.height / this.size.width > this.imageAspect) {
      a1 = (this.size.width / this.size.height) * this.imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 = this.size.height / this.size.width / this.imageAspect
    }

    this.material.uniforms.resolution.value.x = this.size.width
    this.material.uniforms.resolution.value.y = this.size.height
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2
  }

  private stop() {
    this.isPlaying = false
  }

  private play() {
    if (!this.isPlaying) {
      this.isPlaying = true
      this.tic()
    }
  }

  /**
   * 渲染
   */
  private tic() {
    if (!this.isPlaying) return
    this.time += 0.05
    this.material.uniforms.time.value = this.time

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(() => {
      this.tic()
    })

    this.meshes.forEach((mesh) => {
      mesh.position.x = this.mouse.x
      mesh.position.y = this.mouse.y
    })
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

    this.max = 3

    this.geometry = new PlaneGeometry(100, 100, 1, 1)

    // this.material1 = new MeshBasicMaterial({
    //   map: new TextureLoader().load(brush),
    //   transparent: true
    // })

    for (let i = 0; i < this.max; i++) {
      const material = new MeshBasicMaterial({
        map: new TextureLoader().load(brush),
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false
      })

      const mesh = new Mesh(this.geometry, material)

      mesh.rotation.z = 2 * Math.PI * Math.random()
      this.scene.add(mesh)
      this.meshes.push(mesh)
    }

    // this.plane = new Mesh(this.geometry, this.material1)
    // this.scene.add(this.plane)
  }
}
