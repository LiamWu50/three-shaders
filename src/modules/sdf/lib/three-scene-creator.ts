import {
  ACESFilmicToneMapping,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import App from '../app'

export default new (class ThreeSceneCreator {
  public scene!: Scene
  public camera!: OrthographicCamera
  public renderer!: WebGLRenderer
  private controls!: OrbitControls
  public size!: { width: number; height: number }
  public container!: HTMLDivElement

  constructor() {}

  /**
   * 初始化场景
   */
  public init(container: HTMLDivElement) {
    this.container = container

    this.size = {
      width: container.offsetWidth,
      height: container.offsetHeight
    }

    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createControls()
    this.tic()

    window.addEventListener('resize', this.handleResize.bind(this))

    const app = new App(this.scene, this.camera, this.renderer)
    app.init()
  }

  /**
   * 创建场景
   */
  private createScene() {
    this.scene = new Scene()
  }

  /**
   * 创建相机
   */
  private createCamera() {
    const frustumSize = this.size.height
    const aspect = this.size.width / this.size.height
    this.camera = new OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    )
    this.camera.position.set(0, 0, 0)
  }

  /**
   * 创建渲染器
   */
  private createRenderer() {
    const renderer = new WebGLRenderer()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(this.size.width, this.size.height)
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85

    this.container.appendChild(renderer.domElement)
    this.renderer = renderer
    this.handleResize()
  }

  /**
   * 创建控制器
   */
  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  /**
   * 处理窗口大小变化
   */
  private handleResize() {
    this.size.width = this.container.offsetWidth
    this.size.height = this.container.offsetHeight

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.width, this.size.height)
  }

  /**
   * 渲染
   */
  private tic() {
    this.controls.update()

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(() => {
      this.tic()
    })
  }
})()
