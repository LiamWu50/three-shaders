import {
  AdditiveBlending,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget
} from 'three'

import brush from '@/assets/images/burash.png'
import forest from '@/assets/images/forest.jpg'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

type Size = {
  width: number
  height: number
}

export default class App {
  private scene: Scene
  private scene1: Scene
  private camera: OrthographicCamera
  private renderer: WebGLRenderer
  private size: Size
  private material!: ShaderMaterial
  private geometry!: PlaneGeometry
  private quad!: Mesh
  private geometryFullScreen!: PlaneGeometry
  private imageAspect!: number
  private meshes: Mesh[] = []
  private max = 100
  private mouse = new Vector2(0, 0)
  private prevMouse = new Vector2(0, 0)
  private currentWave = 0
  private baseTexture!: WebGLRenderTarget

  constructor(
    scene: Scene,
    camera: OrthographicCamera,
    renderer: WebGLRenderer,
    size: Size
  ) {
    this.scene = scene
    this.scene1 = new Scene()
    this.camera = camera
    this.renderer = renderer
    this.size = size

    this.baseTexture = new WebGLRenderTarget(
      this.size.width,
      this.size.height,
      {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat
      }
    )
  }

  public init() {
    this.mouseEvents()
    this.addObjects()
    this.setupResize()
    this.tic()
  }

  private mouseEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX - this.size.width / 2
      this.mouse.y = this.size.height / 2 - e.clientY
    })
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

  private addObjects() {
    this.material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        uDisplacement: { value: null },
        uTexture: { value: new TextureLoader().load(forest) },
        resolution: { value: new Vector4() }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.geometry = new PlaneGeometry(64, 64, 1, 1)
    this.geometryFullScreen = new PlaneGeometry(
      this.size.width,
      this.size.height,
      1,
      1
    )

    for (let i = 0; i < this.max; i++) {
      const material = new MeshBasicMaterial({
        map: new TextureLoader().load(brush),
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false
      })

      const mesh = new Mesh(this.geometry, material)
      mesh.visible = false
      mesh.rotation.z = 2 * Math.PI * Math.random()

      this.scene.add(mesh)
      this.meshes.push(mesh)
    }

    this.quad = new Mesh(this.geometryFullScreen, this.material)
    this.scene1.add(this.quad)
  }

  private setNewWave(x: number, y: number, index: number) {
    const mesh = this.meshes[index]
    mesh.visible = true
    mesh.position.x = x
    mesh.position.y = y
    mesh.scale.x = mesh.scale.y = 0.2
    const material = mesh.material as MeshBasicMaterial
    material.opacity = 0.5
  }

  private trackMousePos() {
    if (
      Math.abs(this.mouse.x - this.prevMouse.x) < 4 &&
      Math.abs(this.mouse.y - this.prevMouse.y) < 4
    ) {
      // nothing
    } else {
      this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave)
      this.currentWave = (this.currentWave + 1) % this.max
      console.log(this.currentWave)
    }

    this.prevMouse.x = this.mouse.x
    this.prevMouse.y = this.mouse.y
  }

  /**
   * 渲染
   */
  private tic() {
    this.trackMousePos()

    requestAnimationFrame(this.tic.bind(this))

    this.renderer.setRenderTarget(this.baseTexture)
    this.renderer.render(this.scene, this.camera)
    this.material.uniforms.uDisplacement.value = this.baseTexture.texture
    this.renderer.setRenderTarget(null)
    this.renderer.clear()
    this.renderer.render(this.scene1, this.camera)

    this.meshes.forEach((mesh) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02
        const material = mesh.material as MeshBasicMaterial
        material.opacity *= 0.96

        mesh.scale.x = 0.982 * mesh.scale.x + 0.108
        mesh.scale.y = mesh.scale.x
        if (material.opacity < 0.002) {
          mesh.visible = false
        }
      }
    })
  }
}
