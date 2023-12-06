import { OrthographicCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
    console.log('container.offsetWidth', container.offsetWidth)

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
    this.camera.position.set(0, 0, 2)
  }

  /**
   * 创建渲染器
   */
  private createRenderer() {
    const renderer = new WebGLRenderer()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(this.size.width, this.size.height)
    renderer.setClearColor(0x000000, 1)
    renderer.outputColorSpace = SRGBColorSpace

    this.container.appendChild(renderer.domElement)
    this.renderer = renderer
    this.handleResize()
  }

  /**
   * 创建控制器
   */
  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
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

    requestAnimationFrame(() => {
      this.tic()
    })
  }
})()
